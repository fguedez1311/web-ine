 // Sample JSON data (in a real scenario, this would be loaded from an external file)
        const publicationsData = {
            "publications": [
                {
                    "title": "Indicadores Económicos 2023",
                    "description": "Reporte completo de indicadores económicos nacionales para el año 2023",
                    "format": "pdf",
                    "url": "https://example.com/reports/economic-indicators-2023.pdf"
                },
                {
                    "title": "Estadísticas Demográficas",
                    "description": "Datos actualizados sobre población, natalidad y mortalidad",
                    "format": "xls",
                    "url": "https://example.com/reports/demographic-stats.xlsx"
                },
                {
                    "title": "Presentación Sector Industrial",
                    "description": "Análisis del crecimiento del sector industrial en la última década",
                    "format": "ppt",
                    "url": "https://example.com/presentations/industrial-sector.pptx"
                },
                {
                    "title": "Infografía Educación 2023",
                    "description": "Resumen gráfico de los principales indicadores educativos",
                    "format": "jpg",
                    "url": "https://example.com/images/education-infographic.jpg"
                },
                {
                    "title": "Tutorial Datos Abiertos",
                    "description": "Video explicativo sobre cómo usar el portal de datos abiertos",
                    "format": "video",
                    "url": "https://example.com/videos/open-data-tutorial.mp4"
                },
                {
                    "title": "Reporte Financiero Q2",
                    "description": "Resultados financieros del segundo trimestre del año fiscal",
                    "format": "pdf",
                    "url": "https://example.com/reports/financial-q2.pdf"
                },
                {
                    "title": "Datos de Empleo",
                    "description": "Estadísticas detalladas sobre empleo y desempleo por región",
                    "format": "xls",
                    "url": "https://example.com/reports/employment-data.xls"
                },
                {
                    "title": "Estrategia Digital 2024",
                    "description": "Presentación de la estrategia digital para el próximo año",
                    "format": "ppt",
                    "url": "https://example.com/presentations/digital-strategy-2024.ppt"
                },
                {
                    "title": "Mapa de Pobreza",
                    "description": "Representación gráfica de los índices de pobreza por municipio",
                    "format": "jpg",
                    "url": "https://example.com/images/poverty-map.jpg"
                },
                {
                    "title": "Conferencia Estadística",
                    "description": "Grabación completa de la conferencia anual de estadísticas",
                    "format": "video",
                    "url": "https://example.com/videos/stats-conference.mp4"
                }
            ]
        };

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

        // Initialize the table
        function initTable() {
            filteredData = [...publicationsData.publications];
            renderTable();
            updatePagination();
        }

        // Render the table with current data
        function renderTable() {
            tableBody.innerHTML = '';
            
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
            paginatedData.forEach((publication, index) => {
                setTimeout(() => {
                    const row = document.createElement('tr');
                    row.className = 'fade-in-row';
                    row.style.animationDelay = `${index * 0.05}s`;
                    
                    // Get format icon
                    const formatIcon = getFormatIcon(publication.format);
                    
                    row.innerHTML = `
                        <td class="title-cell">
                            <div>${publication.title}</div>
                        </td>
                        <td class="description-cell">
                            <div class="tooltip">
                                ${publication.description}
                                <span class="tooltiptext">${publication.description}</span>
                            </div>
                        </td>
                        <td>
                            ${formatIcon}
                        </td>
                        <td class="url-cell">
                            <a href="${publication.url}" target="_blank" class="url-link" title="${publication.url}">
                                ${shortenUrl(publication.url)}
                            </a>
                            <button class="copy-btn" onclick="copyToClipboard('${publication.url}')" title="Copiar URL">
                                <i class="fas fa-copy"></i>
                            </button>
                        </td>
                        <td>
                            <a href="${publication.url}" target="_blank" class="action-link">
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
                filteredData = [...publicationsData.publications];
            } else {
                filteredData = publicationsData.publications.filter(publication => 
                    publication.title.toLowerCase().includes(searchTerm) || 
                    publication.description.toLowerCase().includes(searchTerm) ||
                    publication.format.toLowerCase().includes(searchTerm) ||
                    publication.url.toLowerCase().includes(searchTerm)
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

        // Initialize the table when the page loads
        document.addEventListener('DOMContentLoaded', initTable);