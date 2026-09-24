# Build and Package for cPanel

Write-Host "Building React Frontend..."
Set-Location frontend
npm run build
Set-Location ..

Write-Host "Creating dist.zip..."
Add-Type -AssemblyName System.IO.Compression.FileSystem
$distPath = (Resolve-Path "frontend\dist").Path
$zipPath = (Join-Path (Get-Location) "dist.zip")
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
[System.IO.Compression.ZipFile]::CreateFromDirectory($distPath, $zipPath)

Write-Host "Done! dist.zip created successfully ($((Get-Item $zipPath).Length) bytes)."
Write-Host "Upload dist.zip to your cPanel public_html/ and extract all files."
