// script.js

document.addEventListener('DOMContentLoaded', () => {
    const tiendaUrlInput = document.getElementById('tiendaUrlInput');
    const buscarBtn = document.getElementById('buscarBtn');
    const resultadosDiv = document.getElementById('resultados');
    const mensajeErrorDiv = document.getElementById('mensajeError');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Clave de API (reemplazar con tu clave real)
    const RAPIDAPI_KEY = '093b140645mshf84fbacd52761f8p10f316jsnb07679229d97';
    const RAPIDAPI_HOST = 'shopify-fast-scraper.p.rapidapi.com';

    buscarBtn.addEventListener('click', () => {
        const tiendaUrl = tiendaUrlInput.value.trim();
        if (tiendaUrl) {
            // Limpiar resultados anteriores y mensajes de error
            resultadosDiv.innerHTML = '';
            mensajeErrorDiv.style.display = 'none';
            mensajeErrorDiv.textContent = '';

            mostrarCarga(true);

            buscarProductos(tiendaUrl);
        } else {
            mostrarError('Por favor, ingresa la URL de una tienda Shopify.');
        }
    });

    /**
     * Realiza la búsqueda de productos en la API de Shopify Fast Scraper.
     * @param {string} tiendaUrlInput - La URL o dominio de la tienda Shopify (ej: shop.flipperzero.one o https://shop.flipperzero.one).
     */
    const buscarProductos = (tiendaUrlInput) => {
        // La API espera una URL completa, si el usuario solo pone el dominio, le agregamos https
        let fullUrl = tiendaUrlInput;
        if (!tiendaUrlInput.startsWith('http://') && !tiendaUrlInput.startsWith('https://')) {
            fullUrl = 'https://' + tiendaUrlInput;
        }

        const apiUrl = `https://shopify-fast-scraper.p.rapidapi.com/ordered-products?url=${encodeURIComponent(fullUrl)}&sort-type=best-selling&scope=store`;

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': RAPIDAPI_HOST,
                'x-rapidapi-key': RAPIDAPI_KEY
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || `Error HTTP ${response.status}: ${response.statusText}`);
                }).catch(() => {
                    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            mostrarCarga(false);

            if (RAPIDAPI_KEY === 'TU_CLAVE_AQUI') {
                mostrarError('Por favor, actualiza la clave de API en script.js para realizar búsquedas.');
                // Podríamos mostrar datos de ejemplo si quisiéramos, pero mejor forzar la clave.
                return;
            }

            if (data && data.products && data.products.length > 0) {
                let storeDisplayName = data.store_name;
                if (!storeDisplayName) {
                    try {
                        // Extraer el hostname de la URL proporcionada por el usuario
                        storeDisplayName = new URL(fullUrl).hostname.replace(/^www\./, '');
                    } catch (e) {
                        // Si la URL no es válida, usar una parte de la entrada original
                        storeDisplayName = tiendaUrlInput.split('/')[0].replace(/^https?:\/\//, '').replace(/^www\./, '');
                    }
                }
                mostrarProductos(data.products, storeDisplayName);
            } else if (data && data.message) {
                mostrarError(data.message);
            }
            else {
                mostrarError('No se encontraron productos para esta tienda o la respuesta no fue la esperada. Verifica la URL de la tienda.');
            }
        })
        .catch(error => {
            mostrarCarga(false);
            console.error('Error en la búsqueda:', error);
            // No mostrar la clave de API en el mensaje de error al usuario
            if (RAPIDAPI_KEY === 'TU_CLAVE_AQUI') {
                 mostrarError(`Error en la búsqueda: ${error.message}. Además, recuerda actualizar la clave de API en script.js.`);
            } else {
                 mostrarError(`Error en la búsqueda: ${error.message}. Verifica la URL de la tienda y la conexión.`);
            }
        });
    };

    /**
     * Muestra los productos en el DOM.
     * @param {Array} productos - Array de objetos de producto.
     * @param {string} nombreTienda - Nombre de la tienda.
     */
    const mostrarProductos = (productos, nombreTienda) => {
        resultadosDiv.innerHTML = '';

        productos.forEach(producto => {
            const productoCard = `
                <div class="col-md-4 mb-4">
                    <div class="card product-card h-100">
                        <img src="${producto.image || 'https://via.placeholder.com/200x150.png?text=Sin+Imagen'}" class="card-img-top" alt="${producto.name || 'Producto sin nombre'}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${producto.name || 'Producto sin nombre'}</h5>
                            <p class="card-text price">${producto.price || 'Precio no disponible'}</p>
                            <p class="card-text store-name mt-auto">Tienda: ${nombreTienda}</p>
                        </div>
                    </div>
                </div>
            `;
            resultadosDiv.innerHTML += productoCard;
        });
    };

    /**
     * Muestra un mensaje de error en el DOM.
     * @param {string} mensaje - El mensaje de error a mostrar.
     */
    const mostrarError = (mensaje) => {
        mensajeErrorDiv.textContent = mensaje;
        mensajeErrorDiv.style.display = 'block';
    };

    /**
     * Muestra u oculta el indicador de carga.
     * @param {boolean} mostrar - True para mostrar, false para ocultar.
     */
    const mostrarCarga = (mostrar) => {
        if (loadingIndicator) {
            loadingIndicator.style.display = mostrar ? 'block' : 'none';
        }
    };

});
