# Currency Converter API (Portfolio Project)

This project is a portfolio demonstration of building, testing, and deploying a TypeScript-based serverless API on Vercel. It showcases modern backend engineering skills, API security, and automated testing.

## Overview

The Currency Converter API provides endpoints to:
- Convert an amount from one currency to another (`/api/convert-currencies`)
- Retrieve a list of supported currencies (`/api/get-currency-list`)

All endpoints are protected with an API token and support CORS for cross-origin requests.

## Technical Skills Demonstrated

- **TypeScript**: All source and test code is written in TypeScript, demonstrating type safety and modern JavaScript practices.
- **Serverless Functions (Vercel)**: Uses Vercel's serverless function platform for scalable, low-maintenance API deployment.
- **API Security**: Implements token-based authentication using custom headers.
- **CORS Configuration**: Custom CORS headers are set via `vercel.json` for secure cross-origin access.
- **External API Integration**: Fetches real-time currency data from [vatcomply.com](https://www.vatcomply.com/).
- **Automated Testing**: Comprehensive Jest test suites for all endpoints, including mocking of external dependencies.
- **Environment Management**: Uses `.nvmrc` for Node.js version control and `.gitignore` for clean source control.
- **Modern Tooling**: Includes `ts-jest`, `@types/jest`, and TypeScript configuration for robust development and testing.

## Project Structure

```
api/
  convert-currencies.ts      # Currency conversion endpoint
  get-currency-list.ts       # Supported currencies endpoint
tests/
  convert-currencies.test.ts # Tests for conversion endpoint
  get-currency-list.test.ts  # Tests for currency list endpoint
jest.config.js               # Jest configuration
package.json                 # Project metadata and scripts
tsconfig.json                # TypeScript configuration
vercel.json                  # Vercel deployment and CORS config
.nvmrc                       # Node.js version
```

## How to Run Locally

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Set environment variable**
   - Create a `.env.local` file with:
     ```
     NEXT_PUBLIC_API_TOKEN=your-token-here
     ```
3. **Run tests**
   ```sh
   npm test
   ```
4. **Deploy**
   - Deploy to Vercel or run locally with Vercel CLI.

## Why This Project?

This project demonstrates:
- Real-world API design and security
- TypeScript and Node.js best practices
- Automated testing and CI-readiness
- Serverless deployment and configuration

---

**Author:** Daniel Holmes

