
#!/bin/bash

# Exit immediately if any command fails
set -e

echo "📋 Starting CI checks..."

# Run TypeScript type checking
echo "🔍 Running TypeScript type checking..."
bash scripts/check-types.sh

# Run ESLint for code quality checks
echo "🔍 Running ESLint code quality checks..."
npx eslint "src/**/*.{ts,tsx}" --max-warnings=0

# Run tests if they exist
if [ -d "src/tests" ] || [ -d "src/__tests__" ]; then
  echo "🧪 Running tests..."
  npm test -- --passWithNoTests
fi

echo "✅ All CI checks passed successfully!"
exit 0
