// ======================================================
// Freimel Jerez WebApp — JavaScript Global (OPTIMIZADO)
// Rendimiento + UX + SEO + AdSense
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // 1️⃣ MENÚ RESPONSIVE (RÁPIDO)
  // =========================
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      const open = nav.classList.contains("active");

      if (open) {
        nav.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
      } else {
        nav.classList.add("active");
        hamburger.setAttribute("aria-expanded", "true");
      }
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
  const waBtn = document.getElementById("whatsappLink");
  const RAW_NUMBER = "573206780200";

  if (form && waBtn) {
    let isValid = false;

    const isEmail = (s) => /^\S+@\S+\.\S+$/.test(s);

    const normalizePhone = (s) => {
      const d = String(s).replace(/\D+/g, "");
      return d ? (d.startsWith("57") ? d : `57${d}`) : "";
    };

    const buildHref = () => {
      const fd = new FormData(form);

      return (
        `https://wa.me/${RAW_NUMBER}?text=` +
        encodeURIComponent(
          `Hola, soy ${fd.get("nombre")}. ` +
          `Correo: ${fd.get("correo")}. ` +
          `Teléfono: ${normalizePhone(fd.get("telefono"))}. ` +
          `Servicio: ${fd.get("servicio") || "General"}. ` +
          `Mensaje: ${fd.get("mensaje")}`
        )
      );
    };

    const validate = () => {
      isValid =
        form.nombre.value.trim() &&
        isEmail(form.correo.value.trim()) &&
        form.mensaje.value.trim();

      waBtn.style.opacity = isValid ? "1" : "0.6";
      waBtn.style.pointerEvents = isValid ? "auto" : "none";
      waBtn.setAttribute("aria-disabled", String(!isValid));
    };

    form.addEventListener("input", () => {
      requestAnimationFrame(validate);
    });

    validate();

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!isValid) {
        alert("Completa los datos obligatorios.");
        return;
      }

      window.open(buildHref(), "_blank");
    });
  }

  // =========================
  // 4️⃣ TOGGLE MONEDA (SIN LAG)
  // =========================
  (() => {
    const buttons = document.querySelectorAll(".price-toggle .toggle-btn");
    if (!buttons.length) return;

    const cop = document.querySelectorAll("[data-cop]");
    const usd = document.querySelectorAll("[data-usd]");

    const setCurrency = (currency) => {
      localStorage.setItem("currencyPref", currency);

      buttons.forEach(btn =>
        btn.classList.toggle("active", btn.dataset.currency === currency)
      );

      cop.forEach(el => el.classList.toggle("hidden", currency !== "COP"));
      usd.forEach(el => el.classList.toggle("hidden", currency !== "USD"));
    };

    const pref = localStorage.getItem("currencyPref") || "COP";

    document.documentElement.style.visibility = "hidden";
    requestAnimationFrame(() => {
      setCurrency(pref);
      document.documentElement.style.visibility = "visible";
    });

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        if (!btn.classList.contains("active")) {
          setCurrency(btn.dataset.currency);
        }
      });
    });
  })();

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
  if (btnInstalar) btnInstalar.style.display = "inline-block";
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
  if (btnInstalar) btnInstalar.style.display = "none";
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

  const hide = () => (banner.style.display = "none");

  accept.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "accepted");
    hide();
  });

  reject.addEventListener("click", () => {
    localStorage.setItem("cookies-choice", "rejected");
    hide();
  });
})();
