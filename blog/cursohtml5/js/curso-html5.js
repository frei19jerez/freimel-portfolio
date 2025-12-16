// ==================================
// CURSO HTML5 – JS GLOBAL (VERSIÓN PRO FINAL)
// Autor: Freimel Jerez WebApp
// ==================================

/*
  ✔ Funciona para las 23 lecciones
  ✔ Controla desbloqueo por video
  ✔ Guarda progreso en localStorage
  ✔ Incluye menú hamburguesa
*/

// ================================
// CONFIGURACIÓN DE LA LECCIÓN
// 👉 SOLO CAMBIAS ESTO EN CADA HTML
// ================================
const CURRENT_LESSON = 1;
const NEXT_LESSON_URL = "02-como-funciona-el-navegador.html";

// ================================
// DOM READY (UNO SOLO – PRO)
// ================================
document.addEventListener("DOMContentLoaded", () => {

  // Año automático
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  // Botón siguiente (estado inicial)
  const btn = document.getElementById("nextBtn");
  if (btn) {
    btn.title = "Debes ver el video completo para continuar";

    // Si ya completó la lección antes
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

// Esta función la llama YouTube
function onYouTubeIframeAPIReady() {
  const iframe = document.getElementById("player");
  if (!iframe) return;

  player = new YT.Player("player", {
    events: {
      onStateChange: onPlayerStateChange
    }
  });
}

// Detecta cuando termina el video
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    unlockNextLesson();
  }
}

// ================================
// DESBLOQUEO DE LECCIÓN
// ================================
function unlockNextLesson() {
  localStorage.setItem(`cursoHTML5_leccion_${CURRENT_LESSON}`, "completada");
  enableNextButton();
}

// Habilita el botón
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
