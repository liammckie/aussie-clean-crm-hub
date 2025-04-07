
#!/usr/bin/env node

/**
 * This is a linting script to be used with npm.
 * To register it, add to package.json scripts:
 * "lint": "node src/scripts/lint.js"
 */

const { execSync } = require('child_process');

try {
  console.log('🔍 Running ESLint...');
  // Run ESLint on TypeScript files
  execSync('npx eslint "src/**/*.{ts,tsx}" --max-warnings=0', {
    stdio: 'inherit',
  });
  console.log('✅ No ESLint errors or warnings found!');
} catch (error) {
  console.error('❌ ESLint found issues:', error.message);
  process.exit(1);
}
