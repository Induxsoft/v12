
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
"C:\Program Files\7-Zip\7z.exe" a -r %1\recurent.zip ..\recurent\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\catcars.zip ..\catcars\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\vendesk.zip ..\vendesk\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\mkplink.zip ..\mkplink\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\ventas.zip ..\ventas\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\irq.zip ..\ws-internal-requests\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\qa.zip ..\qa\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\catprod.zip ..\catprod\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\sitesman.zip ..\sitesman\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\r5iv12.zip ..\r5iv12\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\catfab.zip ..\catfab\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\rhrs.zip ..\rhrs\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\sigesac.zip ..\sigesac\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\batch.zip ..\dkl-batch-api\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\stgt_geq.zip ..\STGT_guarderias2024\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\alibeb.zip ..\alibeb\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\userext.zip ..\userext\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\orgcat.zip ..\orgcat\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\cmpreq.zip ..\cmpreq\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\rhgfcdi.zip ..\rhgfcdi\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\lgcli.zip ..\lgcli\src\*
"C:\Program Files\7-Zip\7z.exe" a -r %1\rhgt.zip ..\rhgt\src\*
GOTO EOF

:ERROR1
ECHO DEBE INDICAR UN DIRECTORIO DE SALIDA
GOTO EOF

:EOF