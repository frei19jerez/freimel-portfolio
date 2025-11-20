// ======================================================
// Freimel Jerez WebApp — JavaScript Global
// Archivo: /js/main.js
// Funciones: menú responsive, WhatsApp, año dinámico,
// toggle COP/USD, instalación PWA, banner cookies
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
    const RAW_NUMBER = "573206780200";

    const isEmail = (s) => /^\S+@\S+\.\S+$/.test(String(s || "").trim());
    const normalizePhone = (s) => {
      const d = String(s || "").replace(/\D+/g, "");
      return d ? (d.startsWith("57") ? d : `57${d}`) : "";
    };

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

    const isReady = () => {
      const nombre  = (form.nombre?.value || "").trim();
      const correo  = (form.correo?.value || "").trim();
      const mensaje = (form.mensaje?.value || "").trim();
      return !!(nombre && isEmail(correo) && mensaje);
    };

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
      }, 150);
    };

    form.addEventListener("input", updateWA);
    form.addEventListener("change", updateWA);
    updateWA();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!isReady()) return alert("Por favor completa nombre, correo válido y mensaje.");

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Abriendo WhatsApp…";
      }

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
      try {
        localStorage.setItem("currencyPref", curr);
      } catch (e) {}

      buttons.forEach(b =>
        b.classList.toggle("active", b.dataset.currency === curr)
      );

      const showCOP = curr === "COP";
      amountsCOP.forEach(el => el.classList.toggle("hidden", !showCOP));
      amountsUSD.forEach(el => el.classList.toggle("hidden", showCOP));
    };

    let pref = "COP";
    try {
      pref = localStorage.getItem("currencyPref") || "COP";
    } catch (e) {}

    setCurrency(pref);

    buttons.forEach(btn =>
      btn.addEventListener("click", () => setCurrency(btn.dataset.currency))
    );
  })();

}); // FIN DOMContentLoaded



// ======================================================
// 5️⃣ INSTALACIÓN DE LA PWA (BOTÓN "INSTALAR APP")
// ======================================================

let deferredPrompt;
const btnInstalar = document.getElementById("btnInstalar");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (btnInstalar) btnInstalar.style.display = "inline-block";

  btnInstalar.onclick = async () => {
    btnInstalar.style.display = "none";

    deferredPrompt.prompt();
    const resultado = await deferredPrompt.userChoice;
    console.log("Instalación:", resultado.outcome);

    deferredPrompt = null;
  };
});

window.addEventListener("appinstalled", () => {
  console.log("🔥 La app Freimel Jerez WebApp fue instalada");
  if (btnInstalar) btnInstalar.style.display = "none";
});


// ======================================================
// 6️⃣ BANNER DE COOKIES (Aceptar / Rechazar)
// ======================================================
(() => {
  const banner  = document.getElementById("cookies-banner");
  const btnAccept = document.getElementById("accept-cookies");
  const btnReject = document.getElementById("reject-cookies");

  if (!banner || !btnAccept || !btnReject) return;

  if (!localStorage.getItem("cookies-choice")) {
    banner.style.display = "flex";
  }

  btnAccept.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "accepted");
    banner.style.display = "none";
  });

  btnReject.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "rejected");
    banner.style.display = "none";
  });
})();
