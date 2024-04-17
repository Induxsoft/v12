@echo Despliegue para desarrollo  
IF "%~1"=="" GOTO ERROR1

xcopy ..\cxp\src "%1" /q /s /i
xcopy ..\cxc\src "%1" /q /s /i
xcopy ..\compras\src "%1" /q /s /i
xcopy ..\movinv\src "%1" /q /s /i
xcopy ..\webshell\src "%1" /q /s /i
xcopy ..\dkl-ddm\src "%1" /q /s /i
xcopy ..\dkl-web\src "%1" /q /s /i
xcopy ..\v12\src "%1" /q /s /i
xcopy ..\dbext\src "%1" /q /s /i
xcopy ..\gop\src "%1" /q /s /i
xcopy ..\mpi\src "%1" /q /s /i
xcopy ..\catbas\src "%1" /q /s /i
xcopy ..\efectivo\src "%1" /q /s /i
xcopy ..\rhgf\src "%1" /q /s /i
xcopy ..\recurent\src "%1" /q /s /i
xcopy ..\catcars\src "%1" /q /s /i
xcopy ..\vendesk\src "%1" /q /s /i
xcopy ..\mkplink\src "%1" /q /s /i
xcopy ..\ventas\src "%1" /q /s /i
xcopy ..\ws-internal-requests\src "%1" /q /s /i
xcopy ..\qa\src "%1" /q /s /i
xcopy ..\catprod\src "%1" /q /s /i
xcopy ..\sitesman\src "%1" /q /s /i
xcopy ..\r5iv12\src "%1" /q /s /i
xcopy ..\catfab\src "%1" /q /s /i
xcopy ..\rhrs\src "%1" /q /s /i
xcopy ..\sigesac\src "%1" /q /s /i
xcopy ..\dkl-batch-api\src "%1" /q /s /i
xcopy ..\STGT_guarderias2024\src "%1" /q /s /i
xcopy ..\alibeb\src "%1" /q /s /i
xcopy ..\userext\src "%1" /q /s /i
xcopy ..\orgcat\src "%1" /q /s /i
xcopy ..\cmpreq\src "%1" /q /s /i

GOTO EOF

:ERROR1
ECHO DEBE INDICAR EL DIRECTORIO DE LOS BINARIOS DE DEVKRON
GOTO EOF

:EOF