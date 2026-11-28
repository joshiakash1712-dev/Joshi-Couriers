import { RefObject, useEffect } from 'react';

let activeLocks = 0;
let savedHtmlOverflow = '';
let savedHtmlOverscroll = '';
let savedBodyOverflow = '';
let savedBodyOverscroll = '';
let savedBodyPaddingRight = '';

function lockDocumentScroll() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;

  if (activeLocks === 0) {
    const html = document.documentElement;
    const body = document.body;

    savedHtmlOverflow = html.style.overflow;
    savedHtmlOverscroll = html.style.overscrollBehavior;
    savedBodyOverflow = body.style.overflow;
    savedBodyOverscroll = body.style.overscrollBehavior;
    savedBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    if (scrollbarWidth > 0) {
      const computedPaddingRight = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
    }
  }

  activeLocks += 1;
}

function unlockDocumentScroll() {
  if (typeof document === 'undefined') return;

  activeLocks = Math.max(0, activeLocks - 1);

  if (activeLocks === 0) {
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = savedHtmlOverflow;
    html.style.overscrollBehavior = savedHtmlOverscroll;
    body.style.overflow = savedBodyOverflow;
    body.style.overscrollBehavior = savedBodyOverscroll;
    body.style.paddingRight = savedBodyPaddingRight;
  }
}

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    lockDocumentScroll();
    return () => {
      unlockDocumentScroll();
    };
  }, [isLocked]);
}

function isInsideScrollableDescendant(target: EventTarget | null, boundary: HTMLElement): boolean {
  let node = target instanceof HTMLElement ? target : null;
  while (node && node !== boundary) {
    const style = window.getComputedStyle(node);
    const overflowY = style.overflowY;
    if (
      (overflowY === 'auto' || overflowY === 'scroll') &&
      node.scrollHeight > node.clientHeight + 1
    ) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

function findActiveModalScrollContainer(backdrop: HTMLElement): HTMLElement | null {
  const candidates = backdrop.querySelectorAll<HTMLElement>('[data-modal-scroll="true"]');
  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    if (candidate.scrollHeight > candidate.clientHeight + 1) {
      return candidate;
    }
  }
  return null;
}

export function useModalScrollForwarding(
  backdropRef: RefObject<HTMLElement | null>,
  isEnabled: boolean,
  rebindKey?: unknown
) {
  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!isEnabled || !backdrop) return;

    let lastTouchY: number | null = null;
    let forwardingTouch = false;
    let rafId: number | null = null;
    let activeTarget: HTMLElement | null = null;
    let virtualTop = 0;
    let desiredTop = 0;
    let lastTimestamp = 0;

    const cancelSmoothAnimation = () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      activeTarget = null;
    };

    const stepSmoothScroll = (now: number) => {
      if (!activeTarget || !activeTarget.isConnected) {
        cancelSmoothAnimation();
        return;
      }

      const dt = Math.min(0.05, Math.max(0.001, (now - lastTimestamp) / 1000));
      lastTimestamp = now;

      const maxScrollTop = Math.max(0, activeTarget.scrollHeight - activeTarget.clientHeight);
      desiredTop = Math.max(0, Math.min(maxScrollTop, desiredTop));

      const diff = desiredTop - virtualTop;
      if (Math.abs(diff) < 0.5) {
        activeTarget.scrollTop = desiredTop;
        virtualTop = desiredTop;
        rafId = null;
        return;
      }

      const factor = 1 - Math.exp(-16 * dt);
      virtualTop += diff * factor;
      activeTarget.scrollTop = virtualTop;
      rafId = window.requestAnimationFrame(stepSmoothScroll);
    };

    const handleWheel = (e: WheelEvent) => {
      if (isInsideScrollableDescendant(e.target, backdrop)) {
        cancelSmoothAnimation();
        return;
      }

      const target = findActiveModalScrollContainer(backdrop);
      if (!target) return;

      let deltaY = e.deltaY;
      if (e.deltaMode === 1) {
        deltaY *= 16;
      } else if (e.deltaMode === 2) {
        deltaY *= target.clientHeight;
      }

      if (deltaY === 0) return;

      e.preventDefault();

      const maxScrollTop = Math.max(0, target.scrollHeight - target.clientHeight);
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        cancelSmoothAnimation();
        target.scrollTop = Math.max(0, Math.min(maxScrollTop, target.scrollTop + deltaY));
        return;
      }

      if (activeTarget !== target || rafId === null) {
        activeTarget = target;
        virtualTop = target.scrollTop;
        desiredTop = target.scrollTop;
      } else if (Math.abs(target.scrollTop - virtualTop) > 3) {
        virtualTop = target.scrollTop;
        desiredTop = target.scrollTop;
      }

      desiredTop = Math.max(0, Math.min(maxScrollTop, desiredTop + deltaY));

      if (rafId === null) {
        lastTimestamp = performance.now();
        rafId = window.requestAnimationFrame(stepSmoothScroll);
      }
    };

    const handlePointerDown = () => {
      cancelSmoothAnimation();
    };

    const handleTouchStart = (e: TouchEvent) => {
      cancelSmoothAnimation();
      if (e.touches.length !== 1 || isInsideScrollableDescendant(e.target, backdrop)) {
        forwardingTouch = false;
        lastTouchY = null;
        return;
      }
      forwardingTouch = true;
      lastTouchY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!forwardingTouch || lastTouchY === null || e.touches.length !== 1) return;

      const target = findActiveModalScrollContainer(backdrop);
      if (!target) return;

      const currentY = e.touches[0].clientY;
      const deltaY = lastTouchY - currentY;
      if (Math.abs(deltaY) > 1) {
        e.preventDefault();
        target.scrollTop += deltaY;
        lastTouchY = currentY;
      }
    };

    const handleTouchEnd = () => {
      forwardingTouch = false;
      lastTouchY = null;
    };

    backdrop.addEventListener('wheel', handleWheel, { passive: false });
    backdrop.addEventListener('pointerdown', handlePointerDown, { passive: true });
    backdrop.addEventListener('touchstart', handleTouchStart, { passive: true });
    backdrop.addEventListener('touchmove', handleTouchMove, { passive: false });
    backdrop.addEventListener('touchend', handleTouchEnd, { passive: true });
    backdrop.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      cancelSmoothAnimation();
      backdrop.removeEventListener('wheel', handleWheel);
      backdrop.removeEventListener('pointerdown', handlePointerDown);
      backdrop.removeEventListener('touchstart', handleTouchStart);
      backdrop.removeEventListener('touchmove', handleTouchMove);
      backdrop.removeEventListener('touchend', handleTouchEnd);
      backdrop.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [backdropRef, isEnabled, rebindKey]);
}

