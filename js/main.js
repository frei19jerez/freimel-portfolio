// ======================================================
// Freimel Jerez WebApp — JavaScript Global
// Archivo: /js/main.js
// Funciones: menú responsive, WhatsApp, año dinámico, moneda COP/USD
// ======================================================

// ===== Espera a que el DOM esté listo =====
document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // 1️⃣ MENÚ HAMBURGUESA RESPONSIVE
  // ===============================
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      const isActive = nav.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isActive ? "true" : "false");
    });

    // Cierra el menú al hacer clic en un enlace (mejora UX móvil)
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ===============================
  // 2️⃣ AÑO DINÁMICO EN EL FOOTER
  // ===============================
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // ===============================
  // 3️⃣ FORMULARIO → WHATSAPP
  // ===============================
  const form = document.getElementById("contactForm");
  if (form) {
    const waBtn = document.getElementById("whatsappLink");
    const RAW_NUMBER = "573206780200"; // Tu número en formato internacional (sin +)

    // Validación simple de email
    const isEmail = (s) => /^\S+@\S+\.\S+$/.test(String(s || "").trim());

    // Normaliza el teléfono (solo dígitos, añade 57 si falta)
    const normalizePhone = (s) => {
      const d = String(s || "").replace(/\D+/g, "");
      return d ? (d.startsWith("57") ? d : `57${d}`) : "";
    };

    // Construye el enlace de WhatsApp
    const buildWAHref = () => {
      const fd = new FormData(form);
      const nombre   = (fd.get("nombre")   || "").trim();
      const correo   = (fd.get("correo")   || "").trim();
      const telefono = normalizePhone(fd.get("telefono"));
      const servicio = (fd.get("servicio") || "General").trim();
      const mensaje  = (fd.get("mensaje")  || "").trim();

      const texto = encodeURIComponent(
        `Hola, soy ${nombre}. Correo: ${correo}. Tel: ${telefono || "N/A"}. ` +
        `Servicio: ${servicio}. Mensaje: ${mensaje}`
      );

      return `https://wa.me/${RAW_NUMBER}?text=${texto}`;
    };

    // Comprueba si el formulario está listo para enviar
    const isReady = () => {
      const nombre  = (form.nombre?.value || "").trim();
      const correo  = (form.correo?.value || "").trim();
      const mensaje = (form.mensaje?.value || "").trim();
      return !!(nombre && isEmail(correo) && mensaje);
    };

    // Actualiza dinámicamente el botón de WhatsApp
    let t;
    const updateWA = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (!waBtn) return;
        waBtn.href = buildWAHref();
        const ready = isReady();
        waBtn.setAttribute("aria-disabled", String(!ready));
        waBtn.style.opacity = ready ? "1" : "0.6";
        waBtn.style.pointerEvents = ready ? "auto" : "none";
        waBtn.title = ready
          ? "Abrir WhatsApp"
          : "Completa nombre, correo y mensaje";
      }, 120);
    };

    // Detecta cambios en el formulario
    form.addEventListener("input", updateWA);
    form.addEventListener("change", updateWA);
    updateWA();

    // Manejo de envío
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (typeof form.reportValidity === "function" && !form.reportValidity()) return;
      if (!isReady()) {
        alert("Por favor completa nombre, correo válido y mensaje.");
        return;
      }
      if (!waBtn || !waBtn.href) {
        alert("No se pudo generar el mensaje de WhatsApp.");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Abriendo WhatsApp…";
      }

      // Abre WhatsApp
      const win = window.open(waBtn.href, "_blank");
      if (!win) window.location.href = waBtn.href;

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Enviar";
        }
      }, 1500);
    });
  }

  // ===============================
  // 4️⃣ TOGGLE DE MONEDA (COP / USD)
  // ===============================
  (() => {
    const buttons = document.querySelectorAll(".price-toggle .toggle-btn");
    if (!buttons.length) return;

    const amountsCOP = document.querySelectorAll(".amount[data-cop]");
    const amountsUSD = document.querySelectorAll(".amount[data-usd]");

    const setCurrency = (curr) => {
      // Guarda preferencia en localStorage
      try {
        localStorage.setItem("currencyPref", curr);
      } catch (e) {
        console.warn("No se pudo guardar preferencia en localStorage");
      }

      // Actualiza el botón activo
      buttons.forEach(b =>
        b.classList.toggle("active", b.dataset.currency === curr)
      );

      // Muestra precios según moneda
      const showCOP = curr === "COP";
      amountsCOP.forEach(el => el.classList.toggle("hidden", !showCOP));
      amountsUSD.forEach(el => el.classList.toggle("hidden", showCOP));
    };

    // Recupera preferencia guardada
    let pref = "COP";
    try {
      pref = localStorage.getItem("currencyPref") || "COP";
    } catch (e) {}

    // Aplica la moneda inicial
    setCurrency(pref);

    // Detecta clics en los botones
    buttons.forEach(btn =>
      btn.addEventListener("click", () => setCurrency(btn.dataset.currency))
    );
  })();

}); // FIN DEL DOMContentLoaded
