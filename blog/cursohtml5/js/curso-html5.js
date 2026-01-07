// ==================================
// CURSO HTML5 – JS GLOBAL (VERSIÓN FINAL)
// Autor: Freimel Jerez WebApp
// ==================================

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1) CONFIGURACIÓN DE LECCIONES (00 a 23)
  // ---------------------------------------------------------------------------
  // IMPORTANTÍSIMO: estos nombres deben coincidir EXACTO con tus archivos.
  var lessonsList = [
    '00-instalacion-vscode.html',
    '01-como-funciona-la-web.html',
    '02-como-funciona-el-navegador.html',
    '03-que-es-html.html',
    '04-etiquetas-basicas.html',
    '05-texto-y-parrafos.html',
    '06-listas.html',
    '07-imagenes.html',
    '08-tablas.html',
    '09-formularios.html',
    '10-captura-de-datos.html',
    '11-validaciones-html.html',
    '12-enlaces.html',
    '13-etiquetas-semanticas.html',
    '14-media-para-la-web.html',
    '15-audio-y-video.html',
    '16-etiqueta-source.html',
    '17-iframe.html',
    '18-espacio-de-trabajo.html',
    '19-figuras-y-atributos.html',
    '20-etiquetas-complementarias.html',
    '21-svg-en-linea.html',
    '22-svg-con-herramientas.html',
    '23-proyecto-final-html5.html'
  ];

  // ---------------------------------------------------------------------------
  // 2) DETECTAR ARCHIVO ACTUAL
  // ---------------------------------------------------------------------------
  var fileName = (function () {
    var path = window.location.pathname;
    var name = path.substring(path.lastIndexOf('/') + 1);
    var qIndex = name.indexOf('?');
    if (qIndex !== -1) name = name.substring(0, qIndex);
    return name;
  })();

  // Índice de la lección actual en el array
  var currentLessonIndex = lessonsList.indexOf(fileName);

  // Si estamos en index.html (lista del curso) u otro archivo no listado,
  // no rompemos nada; solo marcamos como -1.
  var isLessonPage = currentLessonIndex !== -1;

  // currentLessonNumber será 0..23 (según el nombre), y currentLessonPos 1..N
  var currentLessonPos = isLessonPage ? (currentLessonIndex + 1) : -1; // 1..24
  var currentLessonNumber = isLessonPage ? currentLessonIndex : -1;     // 0..23

  // URL de la siguiente lección (solo si estamos en una lección válida)
  var nextLessonUrl = (function () {
    if (!isLessonPage) return null;
    if (currentLessonIndex < lessonsList.length - 1) return lessonsList[currentLessonIndex + 1];
    return null;
  })();

  // ---------------------------------------------------------------------------
  // 3) OPCIONAL: CONTROL POR FECHA
  // ---------------------------------------------------------------------------
  // Puedes declarar en el HTML antes de cargar este JS:
  // <script>var ENABLE_DATE_GATING=true; var RELEASE_DAY=15;</script>
  var enableDateGating = typeof ENABLE_DATE_GATING !== 'undefined' ? ENABLE_DATE_GATING : false;
  var releaseDay = typeof RELEASE_DAY !== 'undefined' ? RELEASE_DAY : 1;

  function isReleasedByDate() {
    if (!enableDateGating) return true;
    var today = new Date();
    return today.getDate() >= releaseDay;
  }

  // ---------------------------------------------------------------------------
  // 4) HELPERS DE PROGRESO (localStorage)
  // ---------------------------------------------------------------------------
  function storageKey(lessonNumber) {
    // lessonNumber: 0..23
    return 'cursoHTML5_leccion_' + lessonNumber;
  }

  function isCompleted(lessonNumber) {
    try {
      return localStorage.getItem(storageKey(lessonNumber)) === 'completada';
    } catch (e) {
      return false;
    }
  }

  function setCompleted(lessonNumber) {
    try {
      localStorage.setItem(storageKey(lessonNumber), 'completada');
    } catch (e) {
      console.warn('No se pudo guardar el progreso.', e);
    }
  }

  // ---------------------------------------------------------------------------
  // 5) DOM READY: UI GENERAL + INDEX (LISTA DEL CURSO)
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    // Año automático en footer
    var yearElement = document.getElementById('year');
    if (yearElement) yearElement.textContent = String(new Date().getFullYear());

    // Menú hamburguesa
    var burger = document.querySelector('.hamburger');
    var nav = document.querySelector('.nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    // --- Si estamos en el INDEX del curso (lista con candados) ---
    // Detecta si existe .course-list .lesson
    var courseLinks = document.querySelectorAll('.course-list .lesson');
    if (courseLinks && courseLinks.length) {
      paintCourseIndex(courseLinks);
    }

    // --- Si estamos en una LECCIÓN con botón nextBtn ---
    var nextBtn = document.getElementById('nextBtn');
    if (nextBtn && isLessonPage) {
      // Si ya está completada, habilita el botón inmediatamente
      if (isCompleted(currentLessonNumber)) {
        enableNextButton();
      } else {
        // si no está completada, deja el botón bloqueado si tu HTML lo trae bloqueado
        nextBtn.title = 'Debes ver el video completo para continuar';
      }
    }

    // Scroll suave para enlaces internos
    var internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  });

  // ---------------------------------------------------------------------------
  // 6) PINTAR INDEX DEL CURSO (DESBLOQUEAR LINKS)
  // ---------------------------------------------------------------------------
  function paintCourseIndex(courseLinks) {
    courseLinks.forEach(function (lessonEl) {
      var numAttr = lessonEl.getAttribute('data-lesson'); // "0", "1", ...
      var num = parseInt(numAttr, 10);

      if (isNaN(num)) return;

      // Regla: lección 00 siempre disponible
      // Regla: lección 01 siempre disponible (puedes cambiar si quieres)
      // Regla: desde 02 en adelante: se desbloquea si la anterior está completada
      var unlocked =
        (num === 0) ||
        (num === 1) ||
        isCompleted(num - 1);

      var statusEl = lessonEl.querySelector('.status');

      if (unlocked) {
        lessonEl.classList.remove('locked');
        lessonEl.classList.add('unlocked');
        if (statusEl) statusEl.textContent = (num === 23) ? '🏁' : '▶ Disponible';
        // habilitar click
        lessonEl.style.pointerEvents = 'auto';
        lessonEl.style.opacity = '1';
      } else {
        lessonEl.classList.add('locked');
        lessonEl.classList.remove('unlocked');
        if (statusEl) statusEl.textContent = '🔒';
        // bloquear click
        lessonEl.style.pointerEvents = 'none';
        lessonEl.style.opacity = '0.6';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 7) YOUTUBE IFRAME API: DETECTAR FIN DE VIDEO
  // ---------------------------------------------------------------------------
  var player;

  // YouTube llama a esta función cuando la API está lista
  window.onYouTubeIframeAPIReady = function () {
    // Solo crea el player si existe el iframe con id="player"
    var iframe = document.getElementById('player');
    if (!iframe) return;

    // Si NO estamos en una lección listada, no hacemos nada
    if (!isLessonPage) return;

    player = new YT.Player('player', {
      events: {
        onStateChange: onPlayerStateChange
      }
    });
  };

  function onPlayerStateChange(event) {
    // Cuando termina el video
    if (event.data === YT.PlayerState.ENDED && isReleasedByDate()) {
      unlockCurrentLessonAndEnableNext();
    }
  }

  // ---------------------------------------------------------------------------
  // 8) DESBLOQUEAR LECCIÓN + HABILITAR BOTÓN SIGUIENTE
  // ---------------------------------------------------------------------------
  function unlockCurrentLessonAndEnableNext() {
    if (!isLessonPage) return;
    setCompleted(currentLessonNumber);
    enableNextButton();
  }

  function enableNextButton() {
    var btn = document.getElementById('nextBtn');
    if (!btn) return;

    btn.disabled = false;
    btn.classList.remove('locked');
    btn.classList.add('enabled');

    if (nextLessonUrl) {
      btn.textContent = '➡️ Ir a la siguiente lección';
      // Evitar duplicar listeners
      btn.onclick = function () {
        window.location.href = nextLessonUrl;
      };
    } else {
      btn.textContent = '✅ Lección completada';
      btn.onclick = null;
    }
  }

})();
