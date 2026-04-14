$ErrorActionPreference = 'Stop'

Set-Location .\Frontend
npm install
npm run build

Remove-Item -Recurse -Force ..\Backend\public\* -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force .\dist\* ..\Backend\public\

Write-Host 'Production build copied to Backend/public successfully.'
