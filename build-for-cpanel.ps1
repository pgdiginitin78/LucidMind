# Build and Package for cPanel

Write-Host "1. Building React Frontend..." -ForegroundColor Cyan
Set-Location frontend
npm run build
Set-Location ..

Write-Host "2. Preparing complete cPanel package..." -ForegroundColor Cyan
Add-Type -AssemblyName System.IO.Compression.FileSystem

$packageDir = Join-Path (Get-Location) "cpanel_deploy_temp"
if (Test-Path $packageDir) { Remove-Item $packageDir -Recurse -Force }
New-Item -ItemType Directory -Path $packageDir | Out-Null

# Copy frontend dist files to root of package
Copy-Item -Path "frontend\dist\*" -Destination $packageDir -Recurse -Force

# Copy backend files to api/ folder in package
$apiDir = Join-Path $packageDir "api"
New-Item -ItemType Directory -Path $apiDir | Out-Null
Copy-Item -Path "backend\*" -Destination $apiDir -Recurse -Force
# Ensure .env is explicitly copied
if (Test-Path "backend\.env") {
    Copy-Item -Path "backend\.env" -Destination $apiDir -Force
}

# 3. Create full dist.zip (contains frontend + api/)
Write-Host "3. Creating dist.zip (Full Frontend + Backend API)..." -ForegroundColor Cyan
$distZip = Join-Path (Get-Location) "dist.zip"
if (Test-Path $distZip) { Remove-Item $distZip -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($packageDir, $distZip)

# 4. Create standalone api.zip (for quickly updating public_html/api/)
Write-Host "4. Creating api.zip (Backend API only)..." -ForegroundColor Cyan
$apiZip = Join-Path (Get-Location) "api.zip"
if (Test-Path $apiZip) { Remove-Item $apiZip -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($apiDir, $apiZip)

# Cleanup temp dir
Remove-Item $packageDir -Recurse -Force

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "DEPLOYMENT PACKAGES READY:" -ForegroundColor Green
Write-Host "1. dist.zip ($([Math]::Round((Get-Item $distZip).Length / 1MB, 2)) MB)" -ForegroundColor Yellow
Write-Host "   -> Upload to cPanel public_html/ and extract all files."
Write-Host "2. api.zip ($([Math]::Round((Get-Item $apiZip).Length / 1KB, 2)) KB)" -ForegroundColor Yellow
Write-Host "   -> Upload directly to cPanel public_html/api/ and extract."
Write-Host "==========================================================" -ForegroundColor Green

