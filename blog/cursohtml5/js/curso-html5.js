// ==================================
// CURSO HTML5 – JS GLOBAL (VERSIÓN FINAL)
// Autor: Freimel Jerez WebApp
// ==================================

/*
  ✔ Funciona para 23 lecciones
  ✔ Controla el desbloqueo al terminar cada vídeo
  ✔ Guarda progreso en localStorage
  ✔ Incluye menú hamburguesa
  ✔ Permite (opcionalmente) liberar lecciones por fecha:
    - Activa o desactiva el control por fecha declarando ENABLE_DATE_GATING en el HTML
    - Define el día mínimo con RELEASE_DAY

  Este archivo detecta automáticamente la lección actual y la siguiente en función del nombre
  del fichero HTML en el que se inserta. Para funcionar, cada página del curso debe tener
  un nombre que siga el patrón utilizado en el array `lessonsList`.
*/

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Configuración automática de lecciones
  // ---------------------------------------------------------------------------
  // Lista de archivos de lecciones en orden. Ajusta los nombres para que coincidan
  // exactamente con los archivos de tu curso. El script determina la lección
  // actual comparando el nombre del archivo que se está cargando con este array.
  var lessonsList = [
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

  // Obtén el nombre del archivo HTML actual (sin parámetros de consulta)
  var fileName = (function () {
    var path = window.location.pathname;
    // Toma sólo la última parte del path (después de la última barra)
    var name = path.substring(path.lastIndexOf('/') + 1);
    // Elimina cualquier parámetro de consulta (?foo=bar) si existe
    var qIndex = name.indexOf('?');
    if (qIndex !== -1) {
      name = name.substring(0, qIndex);
    }
    return name;
  })();

  // Determina el índice de la lección actual en el array
  var currentLessonIndex = lessonsList.indexOf(fileName);
  // Si no se encuentra el archivo, asumimos la primera lección
  if (currentLessonIndex === -1) currentLessonIndex = 0;

  // Número de lección (1-based)
  var currentLesson = currentLessonIndex + 1;
  // URL de la siguiente lección o null si ésta es la última
  var nextLessonUrl = currentLessonIndex < lessonsList.length - 1 ? lessonsList[currentLessonIndex + 1] : null;

  // ---------------------------------------------------------------------------
  // Configuración opcional por fecha
  // ---------------------------------------------------------------------------
  // Estas opciones se pueden definir como variables globales en el HTML antes de
  // cargar este script. Por ejemplo:
  //   <script>var ENABLE_DATE_GATING = true; var RELEASE_DAY = 15;</script>
  // Si no se definen, se usan estos valores por defecto.
  var enableDateGating = typeof ENABLE_DATE_GATING !== 'undefined' ? ENABLE_DATE_GATING : false;
  var releaseDay = typeof RELEASE_DAY !== 'undefined' ? RELEASE_DAY : 23;

  // ---------------------------------------------------------------------------
  // DOM READY – Configuración general
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    // Año automático en el footer
    var yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }

    // Scroll suave para enlaces internos
    var internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Configurar el botón de la siguiente lección
    var nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
      nextBtn.title = 'Debes ver el video completo para continuar';
      // Comprueba si la lección ya está completada en localStorage
      if (localStorage.getItem('cursoHTML5_leccion_' + currentLesson)) {
        enableNextButton();
      }
    }

    // Menú hamburguesa
    var burger = document.querySelector('.hamburger');
    var nav = document.querySelector('.nav');
    if (burger && nav) {
      burger.addEventListener('click', function () {
        nav.classList.toggle('open');
      });
    }
  });

  // ---------------------------------------------------------------------------
  // YOUTUBE IFRAME API
  // ---------------------------------------------------------------------------
  var player;

  // La API de YouTube llama a esta función cuando está lista
  window.onYouTubeIframeAPIReady = function () {
    var iframe = document.getElementById('player');
    if (!iframe) return;
    player = new YT.Player('player', {
      events: {
        onStateChange: window.onPlayerStateChange
      }
    });
  };

  // Esta función detecta cuando termina el video (estado "ENDED")
  window.onPlayerStateChange = function (event) {
    if (event.data === YT.PlayerState.ENDED && isReleasedByDate()) {
      unlockNextLesson();
    }
  };

  // ---------------------------------------------------------------------------
  // DESBLOQUEO DE LECCIÓN
  // ---------------------------------------------------------------------------
  function unlockNextLesson() {
    try {
      localStorage.setItem('cursoHTML5_leccion_' + currentLesson, 'completada');
    } catch (err) {
      console.warn('No se pudo guardar el progreso localmente.', err);
    }
    enableNextButton();
  }

  // Activa el botón de la siguiente lección y asigna la acción de navegación
  function enableNextButton() {
    var btn = document.getElementById('nextBtn');
    if (!btn) return;
    btn.disabled = false;
    btn.classList.remove('locked');
    btn.classList.add('enabled');
    btn.textContent = nextLessonUrl ? '➡️ Ir a la siguiente lección' : '✅ Lección completada';
    if (nextLessonUrl) {
      btn.addEventListener('click', function () {
        window.location.href = nextLessonUrl;
      });
    }
  }

  // ---------------------------------------------------------------------------
  // CONTROL POR FECHA DE LIBERACIÓN
  // ---------------------------------------------------------------------------
  function isReleasedByDate() {
    if (!enableDateGating) return true;
    var today = new Date();
    return today.getDate() >= releaseDay;
  }
})();
