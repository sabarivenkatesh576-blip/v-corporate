# V-CORP 1-Click Startup PowerShell Script
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host "  V-CORP — Virtual Corporate Experience & Career Readiness Platform" -ForegroundColor Yellow
Write-Host "  Smart India Hackathon 2026 Edition" -ForegroundColor Green
Write-Host "=========================================================================" -ForegroundColor Cyan
Write-Host ""

$env:PATH = "C:\Program Files\nodejs;" + $env:PATH
Set-Location $PSScriptRoot

Write-Host "🚀 Launching Full-Stack Environment..." -ForegroundColor White
Write-Host "• Frontend Client: http://localhost:5173" -ForegroundColor Cyan
Write-Host "• Backend Server:  http://localhost:5000" -ForegroundColor Green
Write-Host "• Demo Student:    demo@vcorp.local / Demo@12345" -ForegroundColor Yellow
Write-Host "• Demo Admin:      admin@vcorp.local / Admin@12345" -ForegroundColor Magenta
Write-Host ""

npm run dev
