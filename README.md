# Roulette — BCS Tech Test

A small Angular application that implements a roulette wheel with both random and deterministic spins, built with a focus on clean architecture, predictable state management, and polished UI interactions.

The goal of this project is not just to “make it work”, but to demonstrate considered frontend decisions around state, rendering, animation, and testing.

## ✨ Features

- 🎰 European roulette wheel (real number order, colours, and layout)

- 🔁 Random and fixed spins

  - Random spins use a cryptographically secure RNG

  - Fixed spins deterministically land on a chosen number

- 🎯 SVG-based wheel rendering

  - Programmatic segment geometry

  - Smooth CSS-driven rotation

  - Static pointer / ticker for result alignment

- 🧠 Signal-based state management

  - Centralised game state

  - Derived/computed values for UI

- 🛡 Route guard to prevent accessing results without a completed spin

- 🧪 Unit tests with Vitest

  - Component tests

  - Service tests

  - Guard tests

- 🎨 Subtle UI polish

  - Pressed button interactions

  - Small reward messages for special outcomes

  - Minimal, casino-inspired styling

## 🛠 Tech Stack

- Angular 21

- Standalone components

- Angular Signals

- SVG + CSS animations

- TailwindCSS for some styling

- Vitest for unit testing

- Prettier for formatting

## 🚀 Getting Started

### Install dependencies

`npm install`

### Run the development server

`ng serve`

Then open:
👉 http://localhost:4200

The app will reload automatically as you make changes.

### 🧪 Running Tests

Unit tests are written using Vitest and can be run with:

`ng test`

Tests cover:

- core game state behaviour

- route guards

- component interaction logic

### 🏗 Build

To create a production build:

`ng build`

The compiled output will be placed in the dist/ directory.

### 🧩 Project Structure (high level)

```
src/
├─ app/
│ ├─ core/
│ │ ├─ components/ # Reusable UI components (roulette wheel)
│ │ ├─ services/ # Game state + logic
│ │ └─ guards/ # Route guards
│ └─ pages/
│ ├─ welcome/
│ ├─ game/
│ └─ result/
```

## 📝 Notes

- Game logic is intentionally separated from rendering logic.

- The roulette wheel component is purely presentational.

- The game state service acts as the single source of truth.

- Animations are handled via CSS transitions rather than JS-heavy logic.

- Tests focus on behaviour, not implementation details.

Thanks for taking the time to review this submission.
If you have any questions about specific implementation choices, I’d be happy to talk them through.
