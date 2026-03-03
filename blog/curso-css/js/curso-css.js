// =======================================
// CURSO CSS - SISTEMA DE PROGRESO PRO
// Freimel Jerez WebApp
// =======================================

document.addEventListener("DOMContentLoaded", () => {

  const TOTAL_LECCIONES = 36; // antes del proyecto final
  const PROYECTO_FINAL = 37;

  // Obtener progreso guardado
  let progreso = localStorage.getItem("cursoCSS_progreso");

  if (!progreso) {
    progreso = 2; // solo las 2 primeras desbloqueadas
    localStorage.setItem("cursoCSS_progreso", progreso);
  } else {
    progreso = parseInt(progreso);
  }

  actualizarCurso(progreso, TOTAL_LECCIONES, PROYECTO_FINAL);

});


// =======================================
// ACTUALIZAR ESTADO VISUAL
// =======================================

function actualizarCurso(progreso, TOTAL, FINAL) {

  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {

    const numero = index + 1;

    // ===== PROYECTO FINAL =====
    if (numero === FINAL) {

      if (progreso > TOTAL) {

        desbloquearCard(card, numero, true);

      }

      return;
    }

    // ===== CLASES NORMALES =====
    if (numero <= progreso) {

      if (card.classList.contains("locked")) {

        desbloquearCard(card, numero);

      }

    }

  });

  activarBotones(TOTAL);

}


// =======================================
// DESBLOQUEAR CARD
// =======================================

function desbloquearCard(card, numero, esProyecto = false) {

  const titulo = card.querySelector("h3").innerText;
  const badge = card.querySelector(".badge").innerText;

  card.classList.remove("locked");
  card.classList.add("unlocked");

  if (esProyecto) {

    card.innerHTML = `
      <span class="badge">${badge}</span>
      <h3>${titulo}</h3>
      <a href="/blog/curso-css/37-proyecto-final-css.html" class="btn">
        Ver Proyecto Final
      </a>
    `;

  } else {

    card.innerHTML = `
      <span class="badge">${badge}</span>
      <h3>${titulo}</h3>
      <button class="btn completar" data-num="${numero}">
        Completar clase
      </button>
    `;
  }

}


// =======================================
// ACTIVAR BOTONES
// =======================================

function activarBotones(TOTAL) {

  const botones = document.querySelectorAll(".completar");

  botones.forEach(btn => {

    btn.addEventListener("click", () => {

      const numero = parseInt(btn.dataset.num);
      let progresoActual = parseInt(localStorage.getItem("cursoCSS_progreso"));

      if (numero === progresoActual) {

        progresoActual++;

        localStorage.setItem("cursoCSS_progreso", progresoActual);

        actualizarCurso(progresoActual, TOTAL, 37);

      }

    });

  });

}
