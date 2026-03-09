// ======================================================
// Freimel Jerez WebApp — JavaScript Global (OPTIMIZADO)
// Rendimiento + UX + SEO + AdSense
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // 1️⃣ MENÚ RESPONSIVE
  // =========================
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (hamburger && nav) {

    hamburger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

  }


  // =========================
  // 2️⃣ AÑO DINÁMICO
  // =========================
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();


  // =========================
  // 3️⃣ FORMULARIO → WHATSAPP (FLASH ⚡)
  // =========================
  const form = document.getElementById("contactForm");
  const RAW_NUMBER = "573206780200";

  if (form) {

    const isEmail = (s) => /^\S+@\S+\.\S+$/.test(s);

    const normalizePhone = (s) => {
      const d = s.replace(/\D+/g, "");
      if (!d) return "";
      return d.startsWith("57") ? d : "57" + d;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = form.nombre.value.trim();
      const correo = form.correo.value.trim();
      const telefono = normalizePhone(form.telefono.value || "");
      const servicio = form.servicio.value || "General";
      const mensaje = form.mensaje.value.trim();

      if (!nombre || !isEmail(correo) || !mensaje) {
        alert("Completa los datos obligatorios.");
        return;
      }

      const text =
        `Hola, soy ${nombre}. ` +
        `Correo: ${correo}. ` +
        `Teléfono: ${telefono}. ` +
        `Servicio: ${servicio}. ` +
        `Mensaje: ${mensaje}`;

      const url =
        "https://wa.me/" + RAW_NUMBER +
        "?text=" + encodeURIComponent(text);

      // REDIRECCIÓN INSTANTÁNEA ⚡
      window.location.href = url;

    });

  }


  // =========================
  // 4️⃣ TOGGLE MONEDA (RÁPIDO)
  // =========================
  const buttons = document.querySelectorAll(".price-toggle .toggle-btn");

  if (buttons.length) {

    const cop = document.querySelectorAll("[data-cop]");
    const usd = document.querySelectorAll("[data-usd]");

    const setCurrency = (currency) => {

      localStorage.setItem("currencyPref", currency);

      buttons.forEach(btn =>
        btn.classList.toggle("active", btn.dataset.currency === currency)
      );

      cop.forEach(el =>
        el.classList.toggle("hidden", currency !== "COP")
      );

      usd.forEach(el =>
        el.classList.toggle("hidden", currency !== "USD")
      );

    };

    const pref = localStorage.getItem("currencyPref") || "COP";

    setCurrency(pref);

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (!btn.classList.contains("active")) {
          setCurrency(btn.dataset.currency);
        }
      });
    });

  }

}); // DOMContentLoaded END



// ======================================================
// 5️⃣ INSTALACIÓN PWA (BOTÓN INSTANTÁNEO)
// ======================================================

let deferredPrompt = null;
const btnInstalar = document.getElementById("btnInstalar");

if (btnInstalar) btnInstalar.style.display = "none";

window.addEventListener("beforeinstallprompt", (e) => {

  e.preventDefault();
  deferredPrompt = e;

  if (btnInstalar)
    btnInstalar.style.display = "inline-block";

});

if (btnInstalar) {

  btnInstalar.addEventListener("click", async () => {

    if (!deferredPrompt) return;

    btnInstalar.style.display = "none";

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    deferredPrompt = null;

  });

}

window.addEventListener("appinstalled", () => {

  if (btnInstalar)
    btnInstalar.style.display = "none";

});



// ======================================================
// 6️⃣ COOKIES BANNER (LIVIANO)
// ======================================================

(() => {

  const banner = document.getElementById("cookies-banner");
  const accept = document.getElementById("accept-cookies");
  const reject = document.getElementById("reject-cookies");

  if (!banner || !accept || !reject) return;

  if (!localStorage.getItem("cookies-choice")) {
    banner.style.display = "flex";
  }

  const hide = () => banner.style.display = "none";

  accept.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "accepted");
    hide();
  });

  reject.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "rejected");
    hide();
  });

})();