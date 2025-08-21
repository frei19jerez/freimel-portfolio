// ===== Menú Hamburguesa =====
document.addEventListener("DOMContentLoaded", () => {
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

  // ===== Año en el footer =====
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});


// ===== Formulario → WhatsApp =====
const form = document.getElementById("contactForm");
if (form) {
  const waBtn = document.getElementById("whatsappLink");

  const RAW_NUMBER = "573206780200"; // Número fijo (formato internacional)

  // Validación simple de email
  const isEmail = (s) => /^\S+@\S+\.\S+$/.test(String(s || "").trim());

  // Normaliza teléfono (solo dígitos, añade +57 si falta)
  const normalizePhone = (s) => {
    const d = String(s || "").replace(/\D+/g, "");
    return d ? (d.startsWith("57") ? d : `57${d}`) : "";
  };

  // Construye el mensaje para WhatsApp
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

  // Verifica que se pueda enviar
  const isReady = () => {
    const nombre  = (form.nombre?.value || "").trim();
    const correo  = (form.correo?.value || "").trim();
    const mensaje = (form.mensaje?.value || "").trim();
    return !!(nombre && isEmail(correo) && mensaje);
  };

  // Actualiza el enlace/botón dinámicamente
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


// ===== Toggle de moneda (COP / USD) =====
(() => {
  const buttons = document.querySelectorAll(".price-toggle .toggle-btn");
  if (!buttons.length) return;

  const amountsCOP = document.querySelectorAll(".amount[data-cop]");
  const amountsUSD = document.querySelectorAll(".amount[data-usd]");

  const setCurrency = (curr) => {
    try {
      localStorage.setItem("currencyPref", curr);
    } catch (e) {
      console.warn("No se pudo guardar preferencia en localStorage");
    }
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
