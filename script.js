const inputBusqueda = document.getElementById("busqueda");
const buscarBtn = document.getElementById("buscarBtn");

let paginaActual = 1;
let ultimaBusqueda = '';

function buscarProductos(pagina = 1) {
  const palabra = inputBusqueda.value.trim();
  if (!palabra) return;
  ultimaBusqueda = palabra;
  paginaActual = pagina;
  const resultados = document.getElementById("resultados");
  const mensajeError = document.getElementById("mensajeError");

  if (pagina === 1) {
    resultados.innerHTML = "";
  }
  mensajeError.style.display = "none";

  fetch(`https://real-time-product-search.p.rapidapi.com/search?q=${encodeURIComponent(palabra)}&page=${pagina}&country=us&language=en`, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'real-time-product-search.p.rapidapi.com',
      'x-rapidapi-key': 'fc3af22cc3msh41c305ad918e17cp1659e4jsnbb9ff6802d24' // Nueva API key
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta completa de la API:', data); // <-- Log para depuración
      if (!data || !data.data || !data.data.products || data.data.products.length === 0) {
        if (pagina === 1) {
          mensajeError.textContent = "No se encontraron productos.";
          mensajeError.style.display = "block";
        }
        return;
      }

      data.data.products.forEach(producto => {
        // Determinar el nombre del mercado (sitio de destino)
        let destino = '';
        let url = (producto.offer && producto.offer.offer_page_url) || '';
        if (url) {
          try {
            const hostname = new URL(url).hostname.replace('www.', '');
            if (hostname.includes('amazon')) destino = 'Amazon';
            else if (hostname.includes('ebay')) destino = 'eBay';
            else if (hostname.includes('walmart')) destino = 'Walmart';
            else if (hostname.includes('aliexpress')) destino = 'AliExpress';
            else if (hostname.includes('mercadolibre')) destino = 'MercadoLibre';
            else if (hostname.includes('shopee')) destino = 'Shopee';
            else if (hostname.includes('bestbuy')) destino = 'BestBuy';
            else if (hostname.includes('huntsmart')) destino = 'HuntSmart';
            else if (hostname.includes('google')) destino = 'Google Shopping';
            else destino = hostname.charAt(0).toUpperCase() + hostname.slice(1);
          } catch (e) {
            destino = 'Otro';
          }
        } else {
          destino = 'Otro';
        }
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
          <div class="card h-100">
            <img src="${(producto.product_photos && producto.product_photos[0]) || 'https://via.placeholder.com/200x150'}" class="card-img-top" alt="${producto.product_title}">
            <div class="card-body">
              <h5 class="card-title">${producto.product_title || 'Sin título'}</h5>
              <p class="card-text mb-1">
                ${(producto.offer && producto.offer.price) || 'Precio no disponible'}
                <span class="store-name ml-2">| ${destino}</span>
              </p>
              <a href="${url || '#'}" target="_blank" class="btn btn-sm btn-primary mt-2">Ver producto</a>
            </div>
          </div>
        `;
        resultados.appendChild(card);
      });

      // Botón para cargar más
      let btnMas = document.getElementById('btnMasResultados');
      if (btnMas) btnMas.remove();
      if (data.data.products.length > 0) {
        const btn = document.createElement('button');
        btn.id = 'btnMasResultados';
        btn.className = 'btn btn-primary btn-block my-4';
        btn.textContent = 'Mostrar más productos';
        btn.onclick = () => buscarProductos(paginaActual + 1);
        resultados.parentNode.appendChild(btn);
      }
    })
    .catch(err => {
      console.error(err);
      mensajeError.textContent = "Error al buscar productos. Intenta nuevamente.";
      mensajeError.style.display = "block";
    });
}

buscarBtn.addEventListener("click", () => buscarProductos(1));
inputBusqueda.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    buscarProductos(1);
  }
});

