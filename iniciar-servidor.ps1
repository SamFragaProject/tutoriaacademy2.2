Write-Host "`n=== INICIANDO SERVIDOR TUTORIA ===" -ForegroundColor Cyan
Write-Host "Limpiando procesos anteriores..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host " Procesos limpiados" -ForegroundColor Green
Write-Host "`nIniciando servidor en puerto 3002..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
Start-Sleep -Seconds 8
Write-Host "`n SERVIDOR INICIADO!" -ForegroundColor Green
Write-Host "`n Abre tu navegador en: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:3002" -ForegroundColor Yellow
Write-Host "`n  Espera 5-10 segundos para que compile completamente" -ForegroundColor Cyan
Write-Host " Si no carga, presiona F5 para refrescar`n" -ForegroundColor White
