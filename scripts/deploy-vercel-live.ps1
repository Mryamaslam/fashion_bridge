# Deploy live site to Vercel with Supabase (real DB, not mock).
# Run once: npx vercel login
# Then: .\scripts\deploy-vercel-live.ps1

$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot ".." ".env.local" | Resolve-Path
if (-not (Test-Path $envFile)) {
  Write-Host "Missing .env.local — add Supabase URL and publishable key first." -ForegroundColor Red
  exit 1
}

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim()
    Set-Item -Path "env:$name" -Value $value
  }
}

if (-not $env:NEXT_PUBLIC_SUPABASE_URL -or $env:NEXT_PUBLIC_SUPABASE_URL -match "YOUR_PROJECT") {
  Write-Host "Set NEXT_PUBLIC_SUPABASE_URL in .env.local first." -ForegroundColor Red
  exit 1
}

Write-Host "Linking Vercel project..." -ForegroundColor Cyan
npx vercel link --yes

function Set-VercelEnv($name, $value) {
  if (-not $value) { return }
  Write-Host "Setting $name on Vercel..." -ForegroundColor Cyan
  $value | npx vercel env add $name production --force 2>$null
  $value | npx vercel env add $name preview --force 2>$null
  $value | npx vercel env add $name development --force 2>$null
}

Set-VercelEnv "NEXT_PUBLIC_SUPABASE_URL" $env:NEXT_PUBLIC_SUPABASE_URL
Set-VercelEnv "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" $env:NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
Set-VercelEnv "SUPABASE_SECRET_KEY" $env:SUPABASE_SECRET_KEY

Write-Host "Deploying production..." -ForegroundColor Cyan
npx vercel --prod --yes

Write-Host ""
Write-Host "Done. Copy the production URL from above." -ForegroundColor Green
Write-Host "Then in Supabase → Authentication → URL Configuration:" -ForegroundColor Yellow
Write-Host "  Site URL = your Vercel URL"
Write-Host "  Redirect URLs = your Vercel URL/**"
Write-Host ""
Write-Host "Set NEXT_PUBLIC_SITE_URL to the same Vercel URL in .env.local and redeploy once."
