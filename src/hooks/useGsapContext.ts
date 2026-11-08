import React, { useLayoutEffect, useEffect, useRef, useCallback, RefObject, DependencyList } from 'react';
import { gsap } from '../lib/gsap';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type GsapContextCallback = (context: gsap.Context) => void | (() => void);

export interface UseGsapContextOptions {
  scope?: RefObject<Element | null> | Element | null;
  dependencies?: DependencyList;
  revertOnUpdate?: boolean;
}

/**
 * Custom hook to safely manage GSAP context lifecycle, scoping, and cleanup in React components.
 * Automatically wraps animations in `gsap.context()` and ensures `ctx.revert()` is called on unmount or update.
 * 
 * @param callback The animation logic to execute inside the GSAP context
 * @param scopeOrOptions Ref or Element to scope selectors to, or configuration options object
 * @param dependencies Optional dependency array if passing scope directly
 */
export function useGsapContext(
  callback: GsapContextCallback,
  scopeOrOptions?: RefObject<Element | null> | Element | null | UseGsapContextOptions,
  dependencies: DependencyList = []
) {
  // Normalize options
  let scope: RefObject<Element | null> | Element | null | undefined;
  let deps: DependencyList = dependencies;
  let revertOnUpdate = true;

  if (scopeOrOptions && typeof scopeOrOptions === 'object' && 'dependencies' in scopeOrOptions) {
    scope = scopeOrOptions.scope;
    deps = scopeOrOptions.dependencies ?? [];
    if (scopeOrOptions.revertOnUpdate !== undefined) {
      revertOnUpdate = scopeOrOptions.revertOnUpdate;
    }
  } else {
    scope = scopeOrOptions as RefObject<Element | null> | Element | null | undefined;
  }

  const ctxRef = useRef<gsap.Context | null>(null);

  // Helper to wrap event handlers so animations triggered by user interaction are also collected in the context
  const contextSafe = useCallback(<T extends (...args: any[]) => any>(func: T): T => {
    return ((...args: any[]) => {
      if (ctxRef.current) {
        return ctxRef.current.add(() => func(...args));
      }
      return func(...args);
    }) as T;
  }, []);

  useIsomorphicLayoutEffect(() => {
    const scopeElement = scope && 'current' in scope ? scope.current : scope;

    const ctx = gsap.context((self) => {
      callback(self);
    }, scopeElement || undefined);

    ctxRef.current = ctx;

    return () => {
      if (revertOnUpdate) {
        ctx.revert();
      }
    };
  }, deps);

  return {
    context: ctxRef,
    contextSafe,
  };
}

export default useGsapContext;
