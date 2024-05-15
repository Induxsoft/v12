@echo ACTUALIZAR  
IF "%~1"=="" GOTO ERROR1
git -C "..\webcomponents" pull https://%1@github.com/Induxsoft/webcomponents.git
git -C "..\cxc" pull https://%1@github.com/Induxsoft/cxc.git
git -C "..\cxp" pull https://%1@github.com/Induxsoft/cxp.git
git -C "..\compras" pull https://%1@github.com/Induxsoft/compras.git
git -C "..\movinv" pull https://%1@github.com/Induxsoft/movinv.git
git -C "..\webshell" pull https://%1@github.com/Induxsoft/webshell.git
git -C "..\dkl-ddm" pull https://%1@github.com/Induxsoft/dkl-ddm.git
git -C "..\dkl-web" pull https://%1@github.com/Induxsoft/dkl-web.git
git -C "..\v12" pull https://%1@github.com/Induxsoft/v12.git
git -C "..\dbext" pull https://%1@github.com/Induxsoft/dbext.git
git -C "..\gop" pull https://%1@github.com/Induxsoft/gop.git
git -C "..\mpi" pull https://%1@github.com/Induxsoft/mpi.git
git -C "..\catbas" pull https://%1@github.com/Induxsoft/catbas.git
git -C "..\efectivo" pull https://%1@github.com/Induxsoft/efectivo.git
git -C "..\rhgf" pull https://%1@github.com/Induxsoft/rhgf.git
git -C "..\recurent" pull https://%1@github.com/Induxsoft/recurent.git
git -C "..\catcars" pull https://%1@github.com/Induxsoft/catcars.git
git -C "..\vendesk" pull https://%1@github.com/Induxsoft/vendesk.git
git -C "..\mkplink" pull https://%1@github.com/Induxsoft/mkplink.git
git -C "..\ventas" pull https://%1@github.com/Induxsoft/ventas.git
git -C "..\ws-internal-requests" pull https://%1@github.com/Induxsoft/ws-internal-requests.git
git -C "..\qa" pull https://%1@github.com/Induxsoft/qa.git
git -C "..\catprod" pull https://%1@github.com/Induxsoft/catprod.git
git -C "..\sitesman" pull https://%1@github.com/Induxsoft/sitesman.git
git -C "..\r5iv12" pull https://%1@github.com/Induxsoft/r5iv12.git
git -C "..\catfab" pull https://%1@github.com/Induxsoft/catfab.git
git -C "..\rhrs" pull https://%1@github.com/Induxsoft/rhrs.git
git -C "..\sigesac" pull https://%1@github.com/sipbsa/sigesac.git
git -C "..\dkl-batch-api" pull https://%1@github.com/Induxsoft/dkl-batch-api.git
git -C "..\STGT_guarderias2024" pull https://%1@github.com/Induxsoft/STGT_guarderias2024.git
git -C "..\alibeb" pull https://%1@github.com/Induxsoft/alibeb.git
git -C "..\userext" pull https://%1@github.com/Induxsoft/userext.git
git -C "..\orgcat" pull https://%1@github.com/Induxsoft/orgcat.git
git -C "..\cmpreq" pull https://%1@github.com/Induxsoft/cmpreq.git
git -C "..\rhgfcdi" pull https://%1@github.com/Induxsoft/rhgfcdi.git
git -C "..\lgcli" pull https://%1@github.com/Induxsoft/lgcli.git
git -C "..\rhgt" pull https://%1@github.com/Induxsoft/rhgt.git
git -C "..\stgt_recargas_2024" pull https://%1@github.com/Induxsoft/stgt_recargas_2024.git
GOTO EOF

:ERROR1
ECHO DEBE INDICAR EL TOKEN DE ACCESO PERSONAL
GOTO EOF

:EOF