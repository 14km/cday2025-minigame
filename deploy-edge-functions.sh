#!/bin/bash

# Load environment variables
set -a
source .env
set +a

# Check if token exists
if [ -z "$VITE_SUPABASE_ACCESS_TOKEN" ]; then
  echo "Error: VITE_SUPABASE_ACCESS_TOKEN not found in .env"
  exit 1
fi

export SUPABASE_ACCESS_TOKEN=$VITE_SUPABASE_ACCESS_TOKEN

# Link project
echo "Linking to Supabase project..."
npx supabase link --project-ref oapwrpmohheorgbweeon

# Deploy Edge Functions
echo ""
echo "Deploying all Edge Functions..."
echo ""

# Find all directories in supabase/functions except _shared
for dir in supabase/functions/*/; do
  func_name=$(basename "$dir")

  # Skip _shared directory
  if [ "$func_name" = "_shared" ]; then
    continue
  fi

  echo "Deploying $func_name..."
  npx supabase functions deploy "$func_name" --no-verify-jwt

  if [ $? -eq 0 ]; then
    echo "✅ $func_name deployed successfully"
  else
    echo "❌ Failed to deploy $func_name"
  fi
  echo ""
done

echo "Deployment complete!"
