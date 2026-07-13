sed -i 's/bg-slate-900/bg-slate-50/g' src/pages/OrgWorkspaceView.tsx
sed -i 's/text-white/text-slate-900/g' src/pages/OrgWorkspaceView.tsx
sed -i 's/bg-slate-800/bg-slate-200/g' src/pages/OrgWorkspaceView.tsx
sed -i 's/border-slate-800/border-slate-200/g' src/pages/OrgWorkspaceView.tsx
sed -i 's/text-slate-400/text-slate-500/g' src/pages/OrgWorkspaceView.tsx
sed -i 's/text-slate-300/text-slate-700/g' src/pages/OrgWorkspaceView.tsx
sed -i 's/hover:bg-slate-800/hover:bg-slate-100/g' src/pages/OrgWorkspaceView.tsx
sed -i 's/text-blue-400/text-blue-600/g' src/pages/OrgWorkspaceView.tsx

for file in src/components/OrgWorkspace/*.tsx; do
  sed -i 's/bg-slate-800/bg-white/g' "$file"
  sed -i 's/border-slate-700/border-slate-200/g' "$file"
  sed -i 's/border-slate-800/border-slate-200/g' "$file"
  sed -i 's/text-white/text-slate-900/g' "$file"
  sed -i 's/text-slate-400/text-slate-500/g' "$file"
  sed -i 's/text-slate-300/text-slate-700/g' "$file"
  sed -i 's/text-blue-400/text-blue-600/g' "$file"
  sed -i 's/text-emerald-400/text-emerald-600/g' "$file"
  sed -i 's/text-amber-400/text-amber-600/g' "$file"
  sed -i 's/text-rose-400/text-rose-600/g' "$file"
  sed -i 's/bg-slate-900\/50/bg-slate-50/g' "$file"
  sed -i 's/bg-slate-900/bg-slate-50/g' "$file"
  sed -i 's/hover:bg-slate-700\/50/hover:bg-slate-50/g' "$file"
  sed -i 's/hover:bg-slate-700/hover:bg-slate-100/g' "$file"
  sed -i 's/bg-blue-500\/10/bg-blue-50/g' "$file"
  sed -i 's/bg-emerald-500\/10/bg-emerald-50/g' "$file"
  sed -i 's/bg-amber-500\/10/bg-amber-50/g' "$file"
  sed -i 's/bg-rose-500\/10/bg-rose-50/g' "$file"
  sed -i 's/bg-purple-500\/10/bg-purple-50/g' "$file"
done
