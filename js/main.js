// ======================================================
// Freimel Jerez WebApp — JavaScript Global
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // 1️⃣ MENÚ RESPONSIVE
  // =========================
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      const open = nav.classList.toggle("active");
      hamburger.setAttribute("aria-expanded", open);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        hamburger.setAttribute("aria-expanded", false);
      });
    });
  }

  // =========================
  // 2️⃣ AÑO DINÁMICO
  // =========================
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // =========================
  // 3️⃣ FORM → WHATSAPP
  // =========================
  const form = document.getElementById("contactForm");
  if (form) {
    const waBtn = document.getElementById("whatsappLink");
    const RAW_NUMBER = "573206780200";

    const isEmail = (s) => /^\S+@\S+\.\S+$/.test(s);
    const normalizePhone = (s) => {
      const d = String(s).replace(/\D+/g, "");
      return d ? (d.startsWith("57") ? d : `57${d}`) : "";
    };

    const buildHref = () => {
      const fd = new FormData(form);
      const nombre   = fd.get("nombre")?.trim();
      const correo   = fd.get("correo")?.trim();
      const telefono = normalizePhone(fd.get("telefono"));
      const servicio = fd.get("servicio")?.trim() || "General";
      const mensaje  = fd.get("mensaje")?.trim();

      return `https://wa.me/${RAW_NUMBER}?text=` +
        encodeURIComponent(
          `Hola, soy ${nombre}. Correo: ${correo}. Tel: ${telefono}. ` +
          `Servicio: ${servicio}. Mensaje: ${mensaje}`
        );
    };

    const requiredOk = () => {
      return (
        form.nombre.value.trim() &&
        isEmail(form.correo.value.trim()) &&
        form.mensaje.value.trim()
      );
    };

    const update = () => {
      if (!waBtn) return;
      waBtn.href = buildHref();

      if (requiredOk()) {
        waBtn.style.opacity = "1";
        waBtn.style.pointerEvents = "auto";
        waBtn.removeAttribute("aria-disabled");
      } else {
        waBtn.style.opacity = "0.6";
        waBtn.style.pointerEvents = "none";
        waBtn.setAttribute("aria-disabled", "true");
      }
    };

    form.addEventListener("input", update);
    update();

    form.addEventListener("submit", e => {
      e.preventDefault();
      if (!requiredOk()) return alert("Completa los datos obligatorios.");

      window.open(waBtn.href, "_blank");
    });
  }

  // =========================
  // 4️⃣ TOGGLE MONEDA
  // =========================
  (() => {
    const buttons = document.querySelectorAll(".price-toggle .toggle-btn");
    if (!buttons.length) return;

    const cop = document.querySelectorAll("[data-cop]");
    const usd = document.querySelectorAll("[data-usd]");

    const setCurr = (c) => {
      localStorage.setItem("currencyPref", c);
      buttons.forEach(b => b.classList.toggle("active", b.dataset.currency === c));
      cop.forEach(e => e.classList.toggle("hidden", c !== "COP"));
      usd.forEach(e => e.classList.toggle("hidden", c !== "USD"));
    };

    const pref = localStorage.getItem("currencyPref") || "COP";
    setCurr(pref);

    buttons.forEach(btn => {
      btn.addEventListener("click", () => setCurr(btn.dataset.currency));
    });
  })();

}); // DOMContentLoaded END



// ======================================================
// 5️⃣ INSTALACIÓN DE LA PWA (Botón "Instalar")
// ======================================================

let deferredPrompt;
const btnInstalar = document.getElementById("btnInstalar");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (btnInstalar) {
    btnInstalar.style.display = "inline-block";
  }
});

if (btnInstalar) {
  btnInstalar.addEventListener("click", async () => {
    btnInstalar.style.display = "none";

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    console.log("Resultado instalación:", result.outcome);

    deferredPrompt = null;
  });
}

window.addEventListener("appinstalled", () => {
  console.log("🔥 PWA instalada correctamente");
  if (btnInstalar) btnInstalar.style.display = "none";
});


// ======================================================
// 6️⃣ COOKIES BANNER
// ======================================================
(() => {
  const banner = document.getElementById("cookies-banner");
  const accept = document.getElementById("accept-cookies");
  const reject = document.getElementById("reject-cookies");

  if (!banner || !accept || !reject) return;

  if (!localStorage.getItem("cookies-choice")) {
    banner.style.display = "flex";
  }

  accept.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "accepted");
    banner.style.display = "none";
  });

  reject.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "rejected");
    banner.style.display = "none";
  });
})();
