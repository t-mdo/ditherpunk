# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite application called "ditherpunk". The project uses React 19 with Vite for fast development and building.

## Development Commands

- **Start dev server**: `npm run dev` - Starts Vite dev server with HMR
- **Build**: `npm run build` - Compiles TypeScript (`tsc -b`) then builds with Vite
- **Lint**: `npm run lint` - Runs ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally

## Architecture

- **Entry point**: `src/main.tsx` - Renders the root React app into `#root` div
- **Main component**: `src/App.tsx` - Currently contains the default Vite template
- **TypeScript configuration**: Split configuration with `tsconfig.app.json` (app code) and `tsconfig.node.json` (build tooling)
- **Strict mode**: TypeScript strict mode is enabled with additional checks (`noUnusedLocals`, `noUnusedParameters`, etc.)
- **Module system**: ES modules with bundler resolution

## TypeScript Configuration

The project uses strict TypeScript settings:
- Target: ES2022
- JSX: react-jsx (automatic runtime)
- Bundler module resolution
- `verbatimModuleSyntax` and `erasableSyntaxOnly` enabled

## Linting

ESLint is configured with:
- JavaScript recommended rules
- TypeScript recommended rules
- React Hooks recommended rules (latest)
- React Refresh rules for Vite
- Ignores `dist` directory

## Pairing rules
This project's goal is learning, so Claude shouldn't generate big chunks of code on its own. Favor explanations and interactions. User needs to do things manually to learn
