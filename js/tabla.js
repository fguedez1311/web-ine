 // DOM elements
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentItemsSpan = document.getElementById('currentItems');
const totalItemsSpan = document.getElementById('totalItems');

// Pagination variables
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [];
let data = {};
//Esta Función simplifica los .then
function myFetch(url){
    return fetch(url).then(res=>res.json())
}
async function getData(url){
    try {
        data = await myFetch(url)
        return data
    } catch (error) {
        console.log({error})
    }
}
 function renderTable(){
// Calculate pagination

    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    if (paginatedData.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" style="padding: 1rem 1.5rem; text-align: center; color: #6b7280;">
                            No se encontraron publicaciones que coincidan con la búsqueda
                        </td>
                    </tr>
                `;
                return;
    }
// Add a small delay between rows for animation
    paginatedData.forEach((publicacion, index) => {
        setTimeout(() => {
            const row = document.createElement('tr');
            row.className = 'fade-in-row';
            row.style.animationDelay = `${index * 0.05}s`;
            
            // Get format icon
            const formatIcon = getFormatIcon(publicacion.tipo);
            
            row.innerHTML = `
                <td class="title-cell">
                    <div>${publicacion.titulo}</div>
                </td>
                <td class="description-cell">
                    <div class="tooltip">
                        ${publicacion.descripcion}
                        <span class="tooltiptext">${publicacion.descripcion}</span>
                    </div>
                </td>
                <td>
                    ${formatIcon}
                </td>
                <td class="url-cell">
                    <a href="${publicacion.url}" target="_blank" class="url-link" title="${publicacion.url}">
                        ${shortenUrl(publicacion.url)}
                    </a>
                    <button class="copy-btn" onclick="copyToClipboard('${publicacion.url}')" title="Copiar URL">
                        <i class="fas fa-copy"></i>
                    </button>
                </td>
                <td>
                    <a href="${publicacion.url}" target="_blank" class="action-link">
                        Abrir <i class="fas fa-external-link-alt" style="margin-left: 0.25rem;"></i>
                    </a>
                </td>
            `;
            
            tableBody.appendChild(row);
        }, 0);
    });
    // Update pagination info
    currentItemsSpan.textContent = `${startIndex + 1}-${Math.min(endIndex, filteredData.length)}`;
    totalItemsSpan.textContent = filteredData.length;
    
    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = endIndex >= filteredData.length;
            
 }
  // Shorten URL for display
        function shortenUrl(url) {
            try {
                const urlObj = new URL(url);
                return urlObj.hostname + urlObj.pathname.substring(0, 15) + (urlObj.pathname.length > 15 ? '...' : '');
            } catch {
                return url.length > 30 ? url.substring(0, 30) + '...' : url;
            }
        }

        // Copy URL to clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                // Show feedback
                const toast = document.createElement('div');
                toast.className = 'toast';
                toast.textContent = 'URL copiada al portapapeles';
                document.body.appendChild(toast);
                
                setTimeout(() => {
                    toast.remove();
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar: ', err);
            });
        }

 
// Get the appropriate icon for each format
    function getFormatIcon(format) {
        let iconClass, icon;
        
        switch(format.toLowerCase()) {
            case 'pdf':
                iconClass = 'pdf-icon';
                icon = 'fa-file-pdf';
                break;
            case 'xls':
            case 'xlsx':
                iconClass = 'xls-icon';
                icon = 'fa-file-excel';
                break;
            case 'ppt':
            case 'pptx':
                iconClass = 'ppt-icon';
                icon = 'fa-file-powerpoint';
                break;
            case 'jpg':
            case 'jpeg':
            case 'png':
                iconClass = 'jpg-icon';
                icon = 'fa-file-image';
                break;
            case 'video':
            case 'mp4':
            case 'mov':
                iconClass = 'video-icon';
                icon = 'fa-file-video';
                break;
            default:
                iconClass = 'bg-gray-500';
                icon = 'fa-file';
        }
        
        return `<div class="format-icon ${iconClass}">
            <i class="fas ${icon}"></i>
        </div>`;
    }
      // Filter data based on search input
        function filterData() {
            const searchTerm = searchInput.value.toLowerCase();
            
            if (searchTerm === '') {
                 filteredData = [...data.publicaciones]; 
            } else {
                filteredData = data.publicaciones.filter(publicacion => 
                    publicacion.titulo.toLowerCase().includes(searchTerm) || 
                    publicacion.descricion.toLowerCase().includes(searchTerm) ||
                    publicacion.tipo.toLowerCase().includes(searchTerm) ||
                    publicacion.url.toLowerCase().includes(searchTerm)
                );
            }
            
            // Reset to first page when filtering
            currentPage = 1;
            renderTable();
            updatePagination();
        }
         // Update pagination controls
        function updatePagination() {
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            
            // Disable/enable buttons as needed
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage === totalPages || totalPages === 0;
        }
          // Event listeners
        searchInput.addEventListener('input', filterData);
        
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable();
                updatePagination();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
                updatePagination();
            }
        });



async function initTable() {
    // Inicializa la tabla con datos del archivo JSON
    try {
        data = await getData('datos.json');
        filteredData = [...data.publicaciones]; 
        renderTable();
       
        // Aquí puedes usar filteredData como necesites
    } catch (error) {
        console.log(error);
    }
}

// Inicializa la tabla cuando la página carga
document.addEventListener('DOMContentLoaded', initTable);