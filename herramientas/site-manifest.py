#!/usr/bin/env python3
"""Genera el site.manifest de una plantilla de sitio de V12.

Uso (desde la raíz del repo Induxsoft/v12):

    python3 herramientas/site-manifest.py v12 v12-content-site
    python3 herramientas/site-manifest.py --historial v12 v12-content-site
    python3 herramientas/site-manifest.py --check v12

Escribe src/_templates/sites/<plantilla>/site.manifest (JSON), que lee
`updatesite` (paquete dkl-web):

    {
      "template": "v12",
      "version": "1.0.234",
      "files": [
        {"path": "_protected/render.dk", "sha256": "...", "history": ["...", "..."]}
      ]
    }

- `path`: ruta relativa a la plantilla, siempre con "/".
- `sha256`: huella del archivo tal como se publica. El empaquetador (D17) arma los
  zips con `git -c core.autocrlf=true archive`, así que los archivos de texto llegan
  a los servidores con CRLF; la huella se calcula sobre esa forma.
- `history` (solo con --historial): todas las huellas que el archivo tuvo en commits
  anteriores de Induxsoft/v12, en sus dos formas (CRLF, como se publica, y LF, como
  está en git), más la forma LF del archivo actual. No incluye `sha256`.

--check no escribe nada: sale con 1 si algún `sha256` del manifiesto no corresponde
a los archivos actuales (manifiesto desactualizado), o si sobran o faltan archivos.

Requisitos: python3 y git. Con --historial hace falta el historial completo
(`git fetch --depth=2000 origin main` si el clon es superficial).
"""

import argparse
import hashlib
import io
import json
import os
import subprocess
import sys
import tarfile

MANIFIESTO = "site.manifest"
BASE = "src/_templates/sites"


def es_binario(datos):
    """Misma regla que git (convert.c, gather_stats + convert_is_binary)."""
    muestra = datos
    nul = 0
    cr_solo = 0
    imprimibles = 0
    no_imprimibles = 0
    n = len(muestra)
    for i, c in enumerate(muestra):
        if c == 13:
            if i + 1 < n and muestra[i + 1] == 10:
                pass
            else:
                cr_solo += 1
            continue
        if c == 10:
            continue
        if c == 127:
            no_imprimibles += 1
        elif c < 32:
            if c in (8, 9, 27, 12):  # \b \t ESC \f
                imprimibles += 1
            elif c == 0:
                nul += 1
                no_imprimibles += 1
            else:
                no_imprimibles += 1
        else:
            imprimibles += 1
    # git ignora un ^Z final (EOF de DOS)
    if n and muestra[-1] == 26:
        no_imprimibles -= 1
    if cr_solo or nul:
        return True
    return (imprimibles >> 7) < no_imprimibles


def como_se_publica(datos):
    """Emula core.autocrlf=true al sacar el archivo de git: LF -> CRLF en archivos de
    texto que no traen ningún CR. Si el archivo ya trae CR o es binario, va igual."""
    if b"\r" in datos or es_binario(datos):
        return datos
    return datos.replace(b"\n", b"\r\n")


def sha(datos):
    return hashlib.sha256(datos).hexdigest()


def git(repo, *args, entrada=None):
    r = subprocess.run(["git", "-C", repo] + list(args), input=entrada,
                       stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if r.returncode != 0:
        raise RuntimeError("git %s: %s" % (" ".join(args), r.stderr.decode("utf-8", "replace").strip()))
    return r.stdout


def archivos_actuales(dir_plantilla):
    res = {}
    for raiz, dirs, archivos in os.walk(dir_plantilla):
        dirs.sort()
        for nombre in sorted(archivos):
            completo = os.path.join(raiz, nombre)
            rel = os.path.relpath(completo, dir_plantilla).replace(os.sep, "/")
            if rel == MANIFIESTO:
                continue
            with open(completo, "rb") as f:
                res[rel] = f.read()
    return res


def huellas_de_commit(repo, commit, ruta_plantilla, autocrlf):
    """{ruta relativa: sha256} de la plantilla en un commit, con git archive."""
    valor = "true" if autocrlf else "false"
    try:
        tar = git(repo, "-c", "core.autocrlf=" + valor, "archive", "--format=tar", commit, "--", ruta_plantilla)
    except RuntimeError:
        return {}
    res = {}
    prefijo = ruta_plantilla.rstrip("/") + "/"
    with tarfile.open(fileobj=io.BytesIO(tar)) as t:
        for m in t.getmembers():
            if not m.isfile():
                continue
            if not m.name.startswith(prefijo):
                continue
            rel = m.name[len(prefijo):]
            if rel == MANIFIESTO:
                continue
            res[rel] = sha(t.extractfile(m).read())
    return res


def historial(repo, ruta_plantilla):
    commits = git(repo, "log", "--format=%H", "--", ruta_plantilla).decode().split()
    hist = {}
    for c in commits:
        for autocrlf in (True, False):
            for rel, h in huellas_de_commit(repo, c, ruta_plantilla, autocrlf).items():
                hist.setdefault(rel, set()).add(h)
    return hist, len(commits)


def version_paquete(repo):
    with open(os.path.join(repo, "src", "pack.manifest"), encoding="utf-8-sig") as f:
        return json.load(f).get("version", "")


def generar(repo, plantilla, con_historial, version):
    ruta_plantilla = BASE + "/" + plantilla
    dir_plantilla = os.path.join(repo, ruta_plantilla)
    if not os.path.isdir(dir_plantilla):
        raise SystemExit("No existe la plantilla: " + dir_plantilla)
    actuales = archivos_actuales(dir_plantilla)
    hist, ncommits = ({}, 0)
    if con_historial:
        hist, ncommits = historial(repo, ruta_plantilla)
    files = []
    for rel in sorted(actuales):
        datos = actuales[rel]
        h = sha(como_se_publica(datos))
        e = {"path": rel, "sha256": h}
        if con_historial:
            conocidas = set(hist.get(rel, set()))
            conocidas.add(sha(datos))  # forma LF del archivo actual
            conocidas.discard(h)
            e["history"] = sorted(conocidas)
        files.append(e)
    m = {"template": plantilla, "version": version, "files": files}
    return m, dir_plantilla, ncommits


def principal():
    ap = argparse.ArgumentParser(description="Genera el site.manifest de las plantillas de sitio de V12")
    ap.add_argument("plantillas", nargs="+", help="nombres de plantilla (carpetas de src/_templates/sites)")
    ap.add_argument("--repo", default=".", help="raíz del repo Induxsoft/v12 (por omisión, la carpeta actual)")
    ap.add_argument("--historial", action="store_true", help="agregar las huellas de versiones anteriores (git log)")
    ap.add_argument("--version", default="", help="versión del manifiesto (por omisión, la de src/pack.manifest)")
    ap.add_argument("--check", action="store_true", help="solo verificar que el manifiesto existente esté al día")
    a = ap.parse_args()

    repo = os.path.abspath(a.repo)
    version = a.version or version_paquete(repo)
    falla = False
    for p in a.plantillas:
        m, dir_plantilla, ncommits = generar(repo, p, a.historial, version)
        destino = os.path.join(dir_plantilla, MANIFIESTO)
        if a.check:
            if not os.path.isfile(destino):
                print("%s: no tiene %s" % (p, MANIFIESTO))
                falla = True
                continue
            with open(destino, encoding="utf-8-sig") as f:
                viejo = json.load(f)
            a_viejo = {e["path"]: e["sha256"] for e in viejo.get("files", [])}
            a_nuevo = {e["path"]: e["sha256"] for e in m["files"]}
            difs = sorted(set(a_viejo) ^ set(a_nuevo)) + sorted(k for k in a_nuevo if k in a_viejo and a_viejo[k] != a_nuevo[k])
            if difs:
                falla = True
                print("%s: manifiesto desactualizado en %d archivo(s):" % (p, len(difs)))
                for d in difs:
                    print("   " + d)
            else:
                print("%s: al día (%d archivos)" % (p, len(a_nuevo)))
            continue
        with open(destino, "w", encoding="utf-8", newline="\n") as f:
            json.dump(m, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print("%s: %d archivos, versión %s%s -> %s" % (
            p, len(m["files"]), version,
            (", historial de %d commits" % ncommits) if a.historial else "",
            os.path.relpath(destino, repo)))
        if a.historial:
            for e in m["files"]:
                print("   %3d  %s" % (len(e["history"]), e["path"]))
    return 1 if falla else 0


if __name__ == "__main__":
    sys.exit(principal())
