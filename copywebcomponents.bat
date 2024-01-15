@echo off
echo Copiar JS Y CSS de Webcomponents
copy ..\webcomponents\src\js\*.* .\src\_templates\sites\v12\js
copy ..\webcomponents\src\css\*.* .\src\_templates\sites\v12\css
copy ..\dkl-linux-fixes\pub\*.* .\src
copy ..\dkl-linux-fixes\csv\csv\ref\CsvHelper.dll .\src