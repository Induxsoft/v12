@echo EMPAQUETAR  
IF "%~1"=="" GOTO ERROR1

rmdir /s /q %1
mkdir %1

"C:\Program Files\7-Zip\7z.exe" a -r %1\cxp.zip ..\cxp\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\cxc.zip ..\cxc\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\compras.zip ..\compras\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\movinv.zip ..\movinv\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\webshell.zip ..\webshell\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\dkl-ddm.zip ..\dkl-ddm\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\dkl-web.zip ..\dkl-web\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\v12.zip ..\v12\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\dbext.zip ..\dbext\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\pregop.zip ..\gop\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\mpi.zip ..\mpi\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\catbas.zip ..\catbas\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\efectivo.zip ..\efectivo\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\rhgf.zip ..\rhgf\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\sigesac.zip ..\sigesac\src\*

GOTO EOF

:ERROR1
ECHO DEBE INDICAR UN DIRECTORIO DE SALIDA
GOTO EOF

:EOF