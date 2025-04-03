
#!/usr/bin/env node

/**
 * This is a format script to be used with npm.
 * To register it, add to package.json scripts:
 * "format": "node src/scripts/format.js"
 */

const { execSync } = require('child_process');
const { existsSync } = require('fs');

// Check if .prettierrc exists
if (!existsSync('./.prettierrc')) {
  console.error('Error: .prettierrc file not found in project root');
  process.exit(1);
}

try {
  console.log('Formatting project files...');
  // Format the entire src directory and configuration files
  execSync('npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}" "*.{js,ts,json}"', {
    stdio: 'inherit',
  });
  console.log('✅ Formatting complete!');
} catch (error) {
  console.error('❌ Error during formatting:', error.message);
  process.exit(1);
}
