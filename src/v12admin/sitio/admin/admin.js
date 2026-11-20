// Administrador de V12 Server: comportamiento mínimo (sin dependencias)
(function () {
  // Certificado: muestra solo los campos del tipo elegido
  var sel = document.getElementById('sel-cert');
  function cert() {
    document.querySelectorAll('[data-cert]').forEach(function (e) {
      e.style.display = (sel && e.getAttribute('data-cert') === sel.value) ? '' : 'none';
    });
  }
  if (sel) { sel.addEventListener('change', cert); cert(); }

  // Importar licencia: lee el archivo elegido en el textarea (sin multipart)
  var arch = document.getElementById('archivo-lic'), txt = document.getElementById('contenido-lic');
  if (arch && txt) {
    arch.addEventListener('change', function () {
      if (!arch.files.length) return;
      var r = new FileReader();
      r.onload = function () { txt.value = r.result; };
      r.readAsText(arch.files[0]);
    });
  }

  // Trabajos en curso: consulta su bitácora cada 3 s hasta que terminen
  document.querySelectorAll('pre[data-trabajo][data-fin="0"]').forEach(function (pre) {
    var id = pre.getAttribute('data-trabajo');
    var t = setInterval(function () {
      fetch('./?s=trabajo&id=' + encodeURIComponent(id), { credentials: 'same-origin' })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          var lineas = (j.log || '').split('\n');
          pre.textContent = lineas.slice(-200).join('\n');
          pre.scrollTop = pre.scrollHeight;
          if (j.terminado === '1') { clearInterval(t); setTimeout(function () { location.reload(); }, 1500); }
        })
        .catch(function () {});
    }, 3000);
  });
})();
