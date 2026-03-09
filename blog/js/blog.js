// ====== NAVEGACIÓN AUTOMÁTICA ENTRE ARTÍCULOS ======
(function () {

  const post = document.querySelector(".post");
  if (!post) return;

  const url = window.location.pathname;
  const match = url.match(/articulo-(\d+)\.html/);

  if (!match) return;

  const current = parseInt(match[1]);

  const prev = current - 1;
  const next = current + 1;

  const nav = document.createElement("div");
  nav.className = "post-nav";

  let prevLink = "";
  let nextLink = "";

  if (prev >= 1) {
    prevLink = `<a href="articulo-${prev}.html">← Artículo anterior</a>`;
  }

  if (next <= 5) {
    nextLink = `<a href="articulo-${next}.html">Siguiente artículo →</a>`;
  }

  nav.innerHTML = `
    <div>${prevLink}</div>
    <div>${nextLink}</div>
  `;

  post.appendChild(nav);

})();


// ====== MENU HAMBURGER ======

document.addEventListener("DOMContentLoaded", function(){

  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if(!hamburger || !nav) return;

  hamburger.addEventListener("click", function(){
    nav.classList.toggle("show");
  });

});