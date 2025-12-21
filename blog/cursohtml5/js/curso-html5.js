// ==================================
// CURSO HTML5 – JS GLOBAL (VERSIÓN PRO)
// Autor: Freimel Jerez WebApp
// ==================================

/*
  ✔ Funciona para las 23 lecciones
  ✔ Controla desbloqueo por video
  ✔ Guarda progreso en localStorage
  ✔ Incluye menú hamburguesa
  ✔ Opción (configurable) para controlar liberación por día del mes
  ⤷ Si no deseas control por fecha, ajusta ENABLE_DATE_GATING a false
*/

// ================================
// CONFIGURACIÓN DE LA LECCIÓN
// 👉 Ajusta estos valores en cada HTML donde se use este JS
// ================================
const CURRENT_LESSON   = 1;                                // Número de la lección actual
const NEXT_LESSON_URL  = "02-como-funciona-el-navegador.html"; // URL relativa de la siguiente lección

// Configuración opcional para liberar por fecha
const ENABLE_DATE_GATING = false; // Coloca 'true' para activar el control por fecha
const RELEASE_DAY = 23;            // Día mínimo del mes para liberar (si está activo)

// ================================
// DOM READY – Configuración general
// ================================
document.addEventListener("DOMContentLoaded", () => {
  // Año automático en el footer
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Configurar el botón de la siguiente lección
  const btn = document.getElementById("nextBtn");
  if (btn) {
    btn.title = "Debes ver el video completo para continuar";
    // Si la lección ya estaba completada, activar botón
    if (localStorage.getItem(`cursoHTML5_leccion_${CURRENT_LESSON}`)) {
      enableNextButton();
    }
  }

  // Menú hamburguesa
  const burger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }
});

// ================================
// YOUTUBE IFRAME API
// ================================
let player;

// YouTube llama a esta función cuando la API se ha cargado
function onYouTubeIframeAPIReady() {
  const iframe = document.getElementById("player");
  if (!iframe) return;

  // Crear reproductor y escuchar cambios de estado
  player = new YT.Player("player", {
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

// Detecta cuando termina el video (estado "ENDED")
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED && isReleasedByDate()) {
    unlockNextLesson();
  }
}

// ================================
// DESBLOQUEO DE LECCIÓN
// ================================
function unlockNextLesson() {
  // Guardar progreso en localStorage
  try {
    localStorage.setItem(`cursoHTML5_leccion_${CURRENT_LESSON}`, "completada");
  } catch (err) {
    console.warn("No se pudo guardar el progreso localmente.", err);
  }
  enableNextButton();
}

// Habilitar botón de siguiente lección y asignar acción
function enableNextButton() {
  const btn = document.getElementById("nextBtn");
  if (!btn) return;

  btn.disabled = false;
  btn.classList.remove("locked");
  btn.classList.add("enabled");
  btn.textContent = "➡️ Ir a la siguiente lección";
  btn.onclick = () => {
    window.location.href = NEXT_LESSON_URL;
  };
}

// ================================
// CONTROL POR FECHA DE LIBERACIÓN
// ================================
function isReleasedByDate() {
  // Si no deseas control por fecha, devuelve siempre true
  if (!ENABLE_DATE_GATING) return true;
  const today = new Date();
  return today.getDate() >= RELEASE_DAY;
}

// ================================
// FIN DEL ARCHIVO
// ================================
