# GuidedJSON 🚀

**GuidedJSON** is a fast, comprehensive, and beautiful JSON formatting, validation, and conversion suite designed specifically for modern web developers.

![JSON Formatter UI](https://guidedjson.com/og-image.png)

## What GuidedJSON Solves

Working with large JSON payloads can be frustrating when tools lack advanced features, are too slow, or bombard you with ads. GuidedJSON brings the power of an IDE directly into your browser:
- **Instant JSON Validation & Formatting:** Quickly detect missing commas or mismatched brackets.
- **Data Transformation:** Generate accurate JSON Schemas (Draft-07), TypeScript Types, and interactive React Forms from a single payload.
- **API Payload Building:** Prototype the exact shape of your RESTful API data structures with confidence.

## Features & Workflows

### 1. JSON Validator and Formatter
GuidedJSON features an intelligent editor powered by `monaco-editor`. It provides syntax highlighting, folding, error linting, and 1-click auto-fixes.

### 2. JSON to TypeScript Generation
Paste a convoluted API response and instantly generate strict, nested TypeScript Interfaces for your front-end applications. Say goodbye to manual `interface` definitions.

### 3. JSON Schema Generator
Writing JSON Schema by hand is tedious and error-prone. Paste an example object into GuidedJSON, and it will emit a compliant `draft-07` or `2020-12` schema defining properties, required fields, and primitive types.

### 4. Search and Graph Visualization
Easily search through massive JSON files (up to tens of thousands of lines) and view data represented visually as a DAG (Directed Acyclic Graph).

## Project Structure & Architecture

This project is a React Single Page Application setup using Create React App (CRA). It uses programmatic SEO routes to serve specific metadata and content depending on the tool URL.

- **Routing:** Handled via `react-router-dom` using `Suspense` and `lazy()` loading to split bundles.
- **SEO & Meta Tags:** Handled via `react-helmet-async`.
- **Sitemap Automation:** Run `npm run build` to execute the Node.js script located at `scripts/generate-sitemap.js`, which dynamically generates an up-to-date `public/sitemap.xml`.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository: `git clone git@github.com:your-repo/guidedjson.git`
2. Install dependencies: `npm install`
3. Start the dev server: `npm start`
4. Visit `http://localhost:3000`

### Building for Production
To bundle a highly optimized production build along with an automatically updated sitemap:

```bash
npm run build
```

This ensures the sitemap correctly logs all programmatic SEO routes such as `/json-validator`, `/json-to-typescript`, and `/blog` before minification.

## SEO Optimization

GuidedJSON is highly optimized for search engines aiming for "JSON Tools for Developers":
- Fast static builds.
- Dynamic route-based `<Helmet>` updates for Title, Descriptions, and OpenGraph variables.
- Structured Data injecting `SoftwareApplication` / `WebApplication` and `FAQPage` metadata.
- Pre-configured `robots.txt` explicitly allowing indexers and directing to the `sitemap.xml`.

---
*Built with React, Monaco, and ❤️ for developers.*
