# Contributing to Joshi Couriers

Thank you for your interest in contributing to the **Joshi Couriers** daily logistics and parcel tracking portal.

## Getting Started

1. **Fork the Repository** to your GitHub account.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/joshi-couriers.git
   cd joshi-couriers
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Start local development server**:
   ```bash
   npm run dev
   ```

## Development & Code Guidelines

- **TypeScript**: Strictly typed components and context hooks. Standard enums only.
- **Styling**: Tailwind CSS v4 utility classes.
- **Viewport Resilience**: Use `min-h-[100dvh]` rather than `h-screen` for full viewport layouts.
- **Copy Standards**:
  - Do NOT use em-dashes anywhere in rendered UI copy. Use colons, commas, hyphens, or natural phrasing.
  - Keep copy authentic, human, and grounded in the Jalna, Partur, and Mantha corridor.
- **Touch Targets**: Mobile buttons and interactive elements must have minimum 44px by 44px hit areas.

## Pre-PR Verification

Before submitting your pull request, verify:

```bash
npm run lint
npm run build
```

Both commands must pass with zero errors.
