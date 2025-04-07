
#!/bin/bash

echo "Running TypeScript type checking..."
npx tsc --noEmit > type-errors.log 2>&1
exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "✅ No TypeScript errors found!"
  rm type-errors.log
else
  echo "❌ TypeScript errors found. See type-errors.log for details."
  echo "===== ERROR LOG START ====="
  cat type-errors.log
  echo "===== ERROR LOG END ====="
fi

exit $exit_code
