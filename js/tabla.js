// Elementos del DOM
        const tableBody = document.querySelector('#publications-table tbody');
        const stateFilter = document.getElementById('state-filter');
        const municipalityFilter = document.getElementById('municipality-filter');
        const typeFilter = document.getElementById('type-filter');
        
        // Variables para los datos
        let publications = [];
        let statesAndMunicipalities = {};
        
        // Inicializar la aplicación
        function init() {
            fetchData();
            setupEventListeners();
        }
        
        // Configurar los event listeners
        function setupEventListeners() {
            // Filtros
            stateFilter.addEventListener('change', function() {
                updateMunicipalityFilter();
                filterPublications();
            });
            
            municipalityFilter.addEventListener('change', filterPublications);
            typeFilter.addEventListener('change', filterPublications);
        }
        
        // Obtener datos de la API
        async function fetchData() {
            try {
                // Simulando una llamada a API
                // En un caso real, reemplazar con fetch('tu-api.com/publicaciones')
                const response = await mockApiCall();
                
                publications = response.publications;
                statesAndMunicipalities = response.statesAndMunicipalities;
                
                populateStateFilters();
                renderPublications();
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="error">
                            <i class="fas fa-exclamation-triangle"></i> Error al cargar las publicaciones
                        </td>
                    </tr>
                `;
            }
        }
        
        // Función simulada de llamada a API
        function mockApiCall() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        publications: [
                            {
                                id: 1,
                                title: "Informe Anual 2023",
                                description: "Informe completo de actividades realizadas durante el año 2023",
                                fileType: "pdf",
                                state: "Aguascalientes",
                                municipality: "Aguascalientes",
                                url: "https://ejemplo.com/informe2023.pdf"
                            },
                            {
                                id: 2,
                                title: "Plan de Desarrollo Urbano",
                                description: "Documento que describe el plan de desarrollo para los próximos 5 años",
                                fileType: "doc",
                                state: "Baja California",
                                municipality: "Tijuana",
                                url: "https://ejemplo.com/plan-desarrollo.docx"
                            },
                            {
                                id: 3,
                                title: "Fotos del Evento Oficial",
                                description: "Galería de imágenes del evento de inauguración",
                                fileType: "img",
                                state: "Chiapas",
                                municipality: "Tuxtla Gutiérrez",
                                url: "https://ejemplo.com/evento-fotos.zip"
                            },
                            {
                                id: 4,
                                title: "Conferencia de Prensa",
                                description: "Video completo de la conferencia de prensa del alcalde",
                                fileType: "video",
                                state: "Ciudad de México",
                                municipality: "Coyoacán",
                                url: "https://ejemplo.com/conferencia.mp4"
                            },
                            {
                                id: 5,
                                title: "Podcast Mensual",
                                description: "Audio con las noticias más importantes del mes",
                                fileType: "audio",
                                state: "Jalisco",
                                municipality: "Guadalajara",
                                url: "https://ejemplo.com/podcast-mayo.mp3"
                            }
                        ],
                        statesAndMunicipalities: {
                            "Aguascalientes": ["Aguascalientes", "Asientos", "Calvillo", "Cosío", "Jesús María"],
                            "Baja California": ["Ensenada", "Mexicali", "Playas de Rosarito", "Tecate", "Tijuana"],
                            "Chiapas": ["Tuxtla Gutiérrez", "San Cristóbal de las Casas", "Comitán", "Tapachula", "Ocosingo"],
                            "Ciudad de México": ["Álvaro Obregón", "Azcapotzalco", "Benito Juárez", "Coyoacán", "Cuajimalpa"],
                            "Jalisco": ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Puerto Vallarta"]
                        }
                    });
                }, 1000); // Simulando un retraso de red
            });
        }
        
        // Llenar los filtros de estado
        function populateStateFilters() {
            const states = Object.keys(statesAndMunicipalities);
            
            // Para el filtro
            states.forEach(state => {
                const option = document.createElement('option');
                option.value = state;
                option.textContent = state;
                stateFilter.appendChild(option);
            });
        }
        
        // Actualizar el filtro de municipios según el estado seleccionado
        function updateMunicipalityFilter() {
            const selectedState = stateFilter.value;
            municipalityFilter.innerHTML = '<option value="">Todos</option>';
            
            if (selectedState) {
                const municipalities = statesAndMunicipalities[selectedState];
                municipalities.forEach(municipality => {
                    const option = document.createElement('option');
                    option.value = municipality;
                    option.textContent = municipality;
                    municipalityFilter.appendChild(option);
                });
            }
        }
        
        // Filtrar las publicaciones según los criterios seleccionados
        function filterPublications() {
            const state = stateFilter.value;
            const municipality = municipalityFilter.value;
            const fileType = typeFilter.value;
            
            const filteredPublications = publications.filter(pub => {
                return (!state || pub.state === state) &&
                       (!municipality || pub.municipality === municipality) &&
                       (!fileType || pub.fileType === fileType);
            });
            
            renderPublications(filteredPublications);
        }
        
        // Renderizar las publicaciones en la tabla
        function renderPublications(data = publications) {
            tableBody.innerHTML = '';
            
            if (data.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5" style="text-align: center;">No se encontraron publicaciones</td>`;
                tableBody.appendChild(row);
            } else {
                data.forEach(pub => {
                    const row = document.createElement('tr');
                    
                    // Obtener el icono según el tipo de archivo
                    let fileIcon, fileTypeClass;
                    switch(pub.fileType) {
                        case 'pdf':
                            fileIcon = '<i class="fas fa-file-pdf file-icon pdf"></i>';
                            fileTypeClass = 'pdf';
                            break;
                        case 'doc':
                            fileIcon = '<i class="fas fa-file-word file-icon doc"></i>';
                            fileTypeClass = 'doc';
                            break;
                        case 'img':
                            fileIcon = '<i class="fas fa-file-image file-icon img"></i>';
                            fileTypeClass = 'img';
                            break;
                        case 'video':
                            fileIcon = '<i class="fas fa-file-video file-icon video"></i>';
                            fileTypeClass = 'video';
                            break;
                        case 'audio':
                            fileIcon = '<i class="fas fa-file-audio file-icon audio"></i>';
                            fileTypeClass = 'audio';
                            break;
                        default:
                            fileIcon = '<i class="fas fa-file file-icon other"></i>';
                            fileTypeClass = 'other';
                    }
                    
                    row.innerHTML = `
                        <td>${pub.title}</td>
                        <td>${pub.description}</td>
                        <td><span class="${fileTypeClass}">${fileIcon} ${pub.fileType.toUpperCase()}</span></td>
                        <td>
                            <span class="badge badge-state">${pub.state}</span>
                            <span class="badge badge-municipality">${pub.municipality}</span>
                        </td>
                        <td><a href="${pub.url}" target="_blank"><i class="fas fa-external-link-alt"></i> Ver archivo</a></td>
                    `;
                    
                    tableBody.appendChild(row);
                });
            }
        }
        
        // Inicializar la aplicación cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', init);