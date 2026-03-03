// ==================================
// CURSO HTML5 – JS GLOBAL (VERSIÓN FINAL LIMPIA)
// Autor: Freimel Jerez WebApp
// ==================================

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1) CONFIGURACIÓN DE LECCIONES (00 a 23)
  // ---------------------------------------------------------------------------
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
  var path = window.location.pathname;
  var fileName = path.substring(path.lastIndexOf('/') + 1).split('?')[0];

  var currentLessonIndex = lessonsList.indexOf(fileName);
  var isLessonPage = currentLessonIndex !== -1;
  var currentLessonNumber = isLessonPage ? currentLessonIndex : -1;
  var nextLessonUrl =
    isLessonPage && currentLessonIndex < lessonsList.length - 1
      ? lessonsList[currentLessonIndex + 1]
      : null;

  // ---------------------------------------------------------------------------
  // 3) PROGRESO (localStorage)
  // ---------------------------------------------------------------------------
  function storageKey(num) {
    return 'cursoHTML5_leccion_' + num;
  }

  function isCompleted(num) {
    return localStorage.getItem(storageKey(num)) === 'completada';
  }

  function setCompleted(num) {
    localStorage.setItem(storageKey(num), 'completada');
  }

  // ---------------------------------------------------------------------------
  // 4) DOM READY
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {

    // Año automático
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Menú hamburguesa
    var burger = document.querySelector('.hamburger');
    var nav = document.querySelector('.nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }

    // Pintar index del curso
    var courseLinks = document.querySelectorAll('.course-list .lesson');
    if (courseLinks.length) {
      paintCourseIndex(courseLinks);
    }

    // Botón siguiente
    var nextBtn = document.getElementById('nextBtn');
    if (nextBtn && isLessonPage) {
      if (isCompleted(currentLessonNumber)) {
        enableNextButton();
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 5) DESBLOQUEAR LECCIONES EN INDEX
  // ---------------------------------------------------------------------------
  function paintCourseIndex(courseLinks) {
    courseLinks.forEach(function (lessonEl) {
      var num = parseInt(lessonEl.dataset.lesson, 10);
      if (isNaN(num)) return;

      var unlocked =
        num === 0 ||
        num === 1 ||
        isCompleted(num - 1);

      var statusEl = lessonEl.querySelector('.status');

      if (unlocked) {
        lessonEl.classList.remove('locked');
        lessonEl.classList.add('unlocked');
        lessonEl.style.pointerEvents = 'auto';
        lessonEl.style.opacity = '1';
        if (statusEl) statusEl.textContent = (num === 23) ? '🏁' : '▶ Disponible';
      } else {
        lessonEl.classList.add('locked');
        lessonEl.classList.remove('unlocked');
        lessonEl.style.pointerEvents = 'none';
        lessonEl.style.opacity = '0.6';
        if (statusEl) statusEl.textContent = '🔒';
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 6) YOUTUBE API
  // ---------------------------------------------------------------------------
  var player;

  window.onYouTubeIframeAPIReady = function () {
    var iframe = document.getElementById('player');
    if (!iframe || !isLessonPage) return;

    player = new YT.Player('player', {
      events: {
        onStateChange: onPlayerStateChange
      }
    });
  };

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      unlockLesson();
    }
  }

  function unlockLesson() {
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
      btn.onclick = function () {
        window.location.href = nextLessonUrl;
      };
    } else {
      btn.textContent = '✅ Curso completado';
    }
  }

})();
