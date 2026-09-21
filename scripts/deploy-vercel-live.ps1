# Deploy live site to Vercel with MongoDB (real DB, not mock).
# Run once: npx vercel login
# Then: .\scripts\deploy-vercel-live.ps1

$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot ".." ".env.local" | Resolve-Path
if (-not (Test-Path $envFile)) {
  Write-Host "Missing .env.local — add MONGODB_URI and the other backend vars first." -ForegroundColor Red
  exit 1
}

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim()
    Set-Item -Path "env:$name" -Value $value
  }
}

if (-not $env:MONGODB_URI) {
  Write-Host "Set MONGODB_URI in .env.local first." -ForegroundColor Red
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

Set-VercelEnv "MONGODB_URI" $env:MONGODB_URI
Set-VercelEnv "MONGODB_DB_NAME" $env:MONGODB_DB_NAME
Set-VercelEnv "AUTH_SECRET" $env:AUTH_SECRET
Set-VercelEnv "CLOUDINARY_CLOUD_NAME" $env:CLOUDINARY_CLOUD_NAME
Set-VercelEnv "CLOUDINARY_API_KEY" $env:CLOUDINARY_API_KEY
Set-VercelEnv "CLOUDINARY_API_SECRET" $env:CLOUDINARY_API_SECRET

Write-Host "Deploying production..." -ForegroundColor Cyan
npx vercel --prod --yes

Write-Host ""
Write-Host "Done. Copy the production URL from above." -ForegroundColor Green
Write-Host "Set NEXT_PUBLIC_SITE_URL to the same Vercel URL in .env.local and redeploy once."
