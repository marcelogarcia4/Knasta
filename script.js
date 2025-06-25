document.getElementById("buscarBtn").addEventListener("click", () => {
  const palabra = document.getElementById("busqueda").value.trim();
  const resultados = document.getElementById("resultados");
  const mensajeError = document.getElementById("mensajeError");

  if (!palabra) return;

  resultados.innerHTML = "";
  mensajeError.style.display = "none";

  fetch(`https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(palabra)}&page=1&country=us&language=en`, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com',
      'x-rapidapi-key': '093b140645mshf84fbacd52761f8p10f316jsnb07679229d97'
    }
  })
    .then(response => response.json())
    .then(data => {
      if (!data || !data.data || !data.data.products || data.data.products.length === 0) {
        mensajeError.textContent = "No se encontraron productos.";
        mensajeError.style.display = "block";
        return;
      }

      data.data.products.forEach(producto => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
          <div class="card h-100">
            <img src="${producto.imageUrl || 'https://via.placeholder.com/200x150'}" class="card-img-top" alt="${producto.title}">
            <div class="card-body">
              <h5 class="card-title">${producto.title}</h5>
              <p class="card-text">${producto.priceStr || 'Precio no disponible'}</p>
              <a href="${producto.offerPageUrl}" target="_blank" class="btn btn-sm btn-primary">Ver producto</a>
            </div>
          </div>
        `;
        resultados.appendChild(card);
      });
    })
    .catch(err => {
      console.error(err);
      mensajeError.textContent = "Error al buscar productos. Intenta nuevamente.";
      mensajeError.style.display = "block";
    });
});
