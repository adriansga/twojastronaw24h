@echo off  
cd "G:\Mój dysk\.AI PROJEKTY\Stronyai\.1MOJE\Strony\Hosting"
git add .                                                                                                              
git commit -m "Aktualizacja %date% %time%"
git push origin main
echo.
echo Gotowe! Strona zaktualizowana.
pause