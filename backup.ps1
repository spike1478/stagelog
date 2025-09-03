$ErrorActionPreference = 'Stop'

$src = 'C:\Users\Maya\stagelog'
$destRoot = 'C:\Users\Maya\staglog-backups'
if (-not (Test-Path $destRoot)) { New-Item -ItemType Directory -Path $destRoot | Out-Null }

$timestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$dest = Join-Path $destRoot ("stagelog_backup_" + $timestamp)

# Create destination
New-Item -ItemType Directory -Path $dest | Out-Null

# Copy all files (including hidden), preserve structure
Copy-Item -Path (Join-Path $src '*') -Destination $dest -Recurse -Force -ErrorAction Stop

Write-Host "Backup created: $dest"

