#!/bin/bash
# .github/scripts/test-and-report.sh
# This script runs tests and generates a summary for GitHub Actions
set -e
COMPONENT="$1"
IMAGE_TAG="$2"
if [[ "$COMPONENT" == "backend" ]]; then
  echo "✅ Backend Docker build completed successfully"
  echo "## 🧪 Backend Test Results" >> $GITHUB_STEP_SUMMARY
  echo '' >> $GITHUB_STEP_SUMMARY
  BACKEND_TEST_OUTPUT=$(docker run --rm hedlaron/microadventures-backend:${IMAGE_TAG}-test uv run pytest --cov=. --cov-report=term-missing --maxfail=1 --tb=short 2>&1)
  if echo "$BACKEND_TEST_OUTPUT" | grep -q 'FAILED (errors='; then
    echo '<details><summary><span style="color:red;font-weight:bold;">❌ Backend Tests Failed (click to expand)</span></summary>' >> $GITHUB_STEP_SUMMARY
    echo '' >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo "$BACKEND_TEST_OUTPUT" >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo '</details>' >> $GITHUB_STEP_SUMMARY
  elif echo "$BACKEND_TEST_OUTPUT" | grep -q 'ValidationError'; then
    echo '<details open><summary><span style="color:red;font-weight:bold;">❌ Backend Environment Error (click to expand)</span></summary>' >> $GITHUB_STEP_SUMMARY
    echo '' >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo "$BACKEND_TEST_OUTPUT" >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo '<br><b>❗️ Environment variables missing for backend tests. See error details above.</b>' >> $GITHUB_STEP_SUMMARY
    echo '</details>' >> $GITHUB_STEP_SUMMARY
  else
    echo '<details open><summary><span style="color:green;font-weight:bold;">✅ Backend Tests Passed (click to expand)</span></summary>' >> $GITHUB_STEP_SUMMARY
    echo '' >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo "$BACKEND_TEST_OUTPUT" >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo '</details>' >> $GITHUB_STEP_SUMMARY
  fi
  echo '' >> $GITHUB_STEP_SUMMARY
  echo "### Backend Coverage Summary" >> $GITHUB_STEP_SUMMARY
  BACKEND_COV=$(docker run --rm hedlaron/microadventures-backend:${IMAGE_TAG}-test cat /app/htmlcov/index.html 2>/dev/null | grep -A 10 '<h2>Coverage summary' | head -n 12)
  if [ -z "$BACKEND_COV" ]; then
    echo '<span style="color:orange;">⚠️ No backend coverage report found.</span>' >> $GITHUB_STEP_SUMMARY
  else
    echo '```html' >> $GITHUB_STEP_SUMMARY
    echo "$BACKEND_COV" >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
  fi
elif [[ "$COMPONENT" == "frontend" ]]; then
  echo "✅ Frontend Docker build completed successfully"
  echo "## 🎨 Frontend Test Results" >> $GITHUB_STEP_SUMMARY
  echo '' >> $GITHUB_STEP_SUMMARY
  FRONTEND_TEST_OUTPUT=$(docker run --rm hedlaron/microadventures-frontend:${IMAGE_TAG}-test npm run test:coverage 2>&1)
  if echo "$FRONTEND_TEST_OUTPUT" | grep -q 'FAIL'; then
    echo '<details><summary><span style="color:red;font-weight:bold;">❌ Frontend Tests Failed (click to expand)</span></summary>' >> $GITHUB_STEP_SUMMARY
    echo '' >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo "$FRONTEND_TEST_OUTPUT" >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo '</details>' >> $GITHUB_STEP_SUMMARY
  elif echo "$FRONTEND_TEST_OUTPUT" | grep -q 'No tests found'; then
    echo '<span style="color:orange;">⚠️ No frontend tests found or executed.</span>' >> $GITHUB_STEP_SUMMARY
  else
    echo '<details open><summary><span style="color:green;font-weight:bold;">✅ Frontend Tests Passed (click to expand)</span></summary>' >> $GITHUB_STEP_SUMMARY
    echo '' >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo "$FRONTEND_TEST_OUTPUT" >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
    echo '</details>' >> $GITHUB_STEP_SUMMARY
  fi
  echo '' >> $GITHUB_STEP_SUMMARY
  echo "### Frontend Coverage Summary" >> $GITHUB_STEP_SUMMARY
  FRONTEND_COV=$(docker run --rm hedlaron/microadventures-frontend:${IMAGE_TAG}-test cat /usr/src/app/coverage/coverage-summary.json 2>/dev/null)
  if [ -z "$FRONTEND_COV" ]; then
    echo '<span style="color:orange;">⚠️ No frontend coverage report found.</span>' >> $GITHUB_STEP_SUMMARY
  else
    echo '```json' >> $GITHUB_STEP_SUMMARY
    echo "$FRONTEND_COV" >> $GITHUB_STEP_SUMMARY
    echo '```' >> $GITHUB_STEP_SUMMARY
  fi
fi
