# 🧪 Test Suite Documentation

This document provides comprehensive information about the test suite for the Next.js application.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Framework](#test-framework)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Test Files](#test-files)
- [Coverage](#coverage)
- [Writing New Tests](#writing-new-tests)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project uses **Vitest** as the test runner and **React Testing Library** for component testing. The test suite provides comprehensive coverage for:

- React components (`app/layout.tsx`, `app/page.tsx`)
- Next.js configuration (`next.config.ts`)
- Node.js scripts (`scripts/smart-commit.mjs`)

### Test Statistics

- **Total Test Files**: 4
- **Total Test Cases**: 118+
- **Components Tested**: 2
- **Configuration Files Tested**: 1
- **Scripts Tested**: 1

## 🛠️ Test Framework

### Core Dependencies

- **Vitest** (v3.0.5): Modern, fast test runner with native ESM support
- **React Testing Library** (v16.1.0): Testing utilities for React components
- **jsdom** (v25.0.1): DOM implementation for Node.js
- **@testing-library/jest-dom** (v6.6.3): Custom matchers for DOM assertions

### Why Vitest?

1. **Fast**: Native ESM support and parallelization
2. **Compatible**: Jest-compatible API
3. **Modern**: Built for Vite and modern frameworks
4. **TypeScript**: First-class TypeScript support
5. **Watch Mode**: Intelligent test re-running

## 🚀 Running Tests

### Installation

First, install the dependencies:

```bash
pnpm install
```

### Basic Commands

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run tests with UI dashboard
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

### Running Specific Tests

```bash
# Run tests for a specific file
pnpm vitest app/layout.test.tsx

# Run tests matching a pattern
pnpm vitest --grep "should render"

# Run tests in a specific directory
pnpm vitest app/
```

## 📁 Test Structure

### File Organization