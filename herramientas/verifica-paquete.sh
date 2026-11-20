#!/bin/bash
# Comprobaciones del paquete v12 antes de empujar o empaquetar (D104). Uso: herramientas/verifica-paquete.sh
#   1. src/v12.license y src/v12.license.dkl son idénticos (el comando va con y sin .dkl: dkl solo agrega .dkl a los
#      nombres sin punto, así que "./dkl v12.license" lee el archivo sin extensión).
#   2. src/ no trae configuración local: el zip se extrae sobre la raíz de Devkron y sobrescribiría la del cliente.
#   3. Están los archivos de V12 On Premise: induxsoft.license.dll/.dkh y v12admin/{bin,fastcgi,sitio}.
set -euo pipefail
S="$(cd "$(dirname "$0")/../src" && pwd)"
fallas=0
falla() { echo "FALLA: $*"; fallas=$((fallas + 1)); }
cmp -s "$S/v12.license" "$S/v12.license.dkl" && echo "OK  v12.license = v12.license.dkl" || falla "src/v12.license y src/v12.license.dkl difieren (copie uno sobre el otro)"
for f in v12.license.json v12.estado.json v12.revocada v12.lic _device.id devkron.license connections.xml \
         v12admin/v12server.json v12admin/datos v12admin/dist; do
  [ -e "$S/$f" ] && falla "src/$f es configuración o datos locales: no va en el paquete"
done
for f in induxsoft.license.dll induxsoft.license.dkh v12admin/bin/trabajo.dkl v12admin/fastcgi/alias.dkl v12admin/sitio/admin/index.dkl; do
  [ -f "$S/$f" ] || falla "falta src/$f"
done
otros=$(cd "$S/v12admin/fastcgi" && ls | grep -vx alias.dkl || true)
[ -z "$otros" ] || falla "src/v12admin/fastcgi solo debe traer alias.dkl (los demás los copia el instalador de la distribución de Devkron): $otros"
[ $fallas -eq 0 ] && echo "verifica-paquete: 0 fallas" || { echo "verifica-paquete: $fallas fallas"; exit 1; }
