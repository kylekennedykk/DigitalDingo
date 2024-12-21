for file in \
  "src/lib/contexts/DreamtimeFlowContext.tsx" \
  "src/components/layout/ClientLayout.tsx" \
  "src/app/providers.tsx" \
  "src/components/layout/PageWithFlow.tsx" \
  "src/components/ui/loading-states.tsx" \
  "src/components/GradientCard.tsx" \
  "src/components/LatestProjects.tsx"; do
  if [ -f "$file" ]; then
    echo "✅ $file exists"
  else
    echo "❌ $file missing"
  fi
done