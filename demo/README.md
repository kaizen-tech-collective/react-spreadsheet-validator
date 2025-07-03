# React Spreadsheet Validator - Demo

This is a demonstration application for the React Spreadsheet Validator library, built with Vite and React.

## Development vs Production

This demo is configured to work in two modes:

### Development Mode (default)

- Uses local source code via Vite aliases
- Imports from `@kaizen-tech-collective/react-spreadsheet-validator` resolve to `../src/index.tsx`
- Allows real-time development and testing of library changes

### Production Mode

- Uses the actual published npm package
- No aliases - imports resolve to the installed package
- Simulates real-world usage of the published library

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

### Development

1. Start the development server (uses local source):

   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:3000`

### Production Build

To test with the actual published package:

1. Install the published package version:

   ```bash
   npm install @kaizen-tech-collective/react-spreadsheet-validator@latest
   ```

2. Build in production mode:

   ```bash
   npm run build:prod
   ```

3. Preview the production build:
   ```bash
   npm run preview
   ```

## Project Structure

- `src/App.tsx` - Main demo application component
- `src/index.tsx` - Application entry point
- `vite.config.ts` - Vite configuration with conditional aliases

## Import Strategy

The demo uses package-name imports:

```tsx
import { ReactSpreadsheetImport, type Result } from '@kaizen-tech-collective/react-spreadsheet-validator';
```

- **Development**: Vite alias resolves this to `../src/index.tsx`
- **Production**: Standard npm package resolution

This approach allows the demo to:

- Test the library during development with live reloading
- Validate the published package works correctly
- Be deployed independently using the published package

## Demo Features

This demo showcases:

- File upload and parsing (Excel, CSV)
- Column matching and mapping interface
- Data validation with custom rules
- Error handling and correction UI
- Result display with structured output

## Deployment

For production deployment:

1. Set `NODE_ENV=production` or use `npm run build:prod`
2. Ensure the published package is available in your package registry
3. Deploy the built `dist/` folder to your hosting platform
