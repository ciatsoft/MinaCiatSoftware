$(document).ready(function () {

    $("#tableVentaPlanta").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        order: [[0, 'desc']],
        columns: [
            { data: "pV_PlantaId", title: "Folio" },
            { data: "nombreUbicacion", title: "Planta" },
            {
                data: "totalVendido",
                title: "Total Vendido",
                render: function (data, type, row) {
                    if (data == null || data === "") return "$0.00";
                    return parseFloat(data).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2
                    });
                }
            },
        ]
        ,
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": "Buscar:",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    $("#tableVentaPlanta2").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        order: [[0, 'desc']],
        columns: [
            { data: "pV_PlantaId", title: "Folio" },
            { data: "nombreUbicacion", title: "Planta" },
            {
                data: "totalVendido",
                title: "Total Vendido",
                render: function (data, type, row) {
                    if (data == null || data === "") return "$0.00";
                    return parseFloat(data).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2
                    });
                }
            },
        ]
        ,
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": "Buscar:",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });
});

// Evento del botón Filtrado
document.getElementById("btnFiltrar").addEventListener("click", function () {

    var fecha = $("#fechaFiltro").val();

    if (!fecha) {
        alert("Por favor, seleccione una fecha válida.");
        return;
    }

    TotalPlantaByFecha(fecha);
});

function TotalPlantaByFecha(fecha) {
    PostMVC('/VentaPublicoGeneral/TotalPlantaByFecha', { fecha }, function (r, textStatus, jqXHR) {
        if (r.IsSuccess && Array.isArray(r.Response)) {
            const data = r.Response;
            const table = $('#tableVentaPlanta');

            // Destruir DataTable existente si existe
            if ($.fn.DataTable.isDataTable(table)) {
                table.DataTable().clear().destroy();
                table.empty(); // Limpiar la tabla para evitar duplicados
            }

            // Asegurar que la tabla tiene la estructura HTML correcta
            if (table.find('thead').length === 0) {
                table.append('<thead><tr></tr></thead>');
            }
            if (table.find('tbody').length === 0) {
                table.append('<tbody></tbody>');
            }

            // Configuración de DataTable
            table.DataTable({
                processing: true,
                paging: true,
                searching: true,
                data: data,
                columns: [
                    { data: "pV_PlantaId", title: "Folio" },
                    { data: "nombreUbicacion", title: "Planta" },
                    { data: "totalVendido", title: "Total Vendido en M3" },
                ],
                language: {
                    decimal: ",",
                    thousands: ".",
                    processing: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>',
                    lengthMenu: "Mostrar _MENU_ registros",
                    zeroRecords: "No se encontraron resultados",
                    emptyTable: "No hay datos disponibles",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "Mostrando 0 registros",
                    infoFiltered: "(filtrado de _MAX_ registros totales)",
                    search: "Buscar:",
                    loadingRecords: "Cargando...",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente <i class='fas fa-chevron-right'></i>",
                        previous: "<i class='fas fa-chevron-left'></i> Anterior"
                    }
                },
                responsive: true,
                dom: '<"top"lf>rt<"bottom"ip><"clear">',
                initComplete: function () {
                    // Añadir clases CSS a los elementos de la tabla
                    $('.dataTables_filter input').addClass('form-control');
                    $('.dataTables_length select').addClass('form-select');
                }
            });
        } else {
            console.warn("No se recibieron datos válidos o la respuesta no fue exitosa:", r);
            // Mostrar mensaje al usuario
            $('#tablePuntoVenta').html('<div class="alert alert-warning">No se encontraron registros para los criterios seleccionados</div>');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
        $('#tablePuntoVenta').html('<div class="alert alert-danger">Error al cargar los datos</div>');
    });
}

function TotalPlantaByFecha2(fecha2, fecha3) {
    // Limpiar mensajes previos
    $('#tableVentaPlanta2').html('');

    $.ajax({
        url: '/VentaPublicoGeneral/TotalPlantaByFecha2',
        type: 'POST',
        data: { fecha2: fecha2, fecha3: fecha3 },
        dataType: 'json',
        success: function (r) {

            if (r && r.IsSuccess && Array.isArray(r.Response)) {

                var table2 = $("#tableVentaPlanta2");

                // Destruir DataTable existente si existe
                if ($.fn.DataTable.isDataTable(table2)) {
                    table2.DataTable().destroy();
                    table2.empty();
                }

                // Crear estructura básica de la tabla
                table2.html(`
                    <thead>
                        <tr>
                            <th>Folio</th>
                            <th>Planta</th>
                            <th>Total Vendido en M3</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                `);

                // Inicializar DataTable con los datos
                var dataTable = table2.DataTable({
                    data: r.Response,
                    columns: [
                        { data: "pV_PlantaId" },
                        { data: "nombreUbicacion" },
                        {
                            data: "totalVendido",
                            render: function (data, type, row) {
                                return type === 'display' ? parseFloat(data).toFixed(2) : data;
                            }
                        }
                    ],
                    language: {
                        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-MX.json'
                    },
                    responsive: true,
                    dom: '<"top"lf>rt<"bottom"ip><"clear">',
                    initComplete: function () {
                        $('.dataTables_filter input').addClass('form-control');
                        $('.dataTables_length select').addClass('form-select');
                    }
                });
            } else {
                console.error("Formato de respuesta inesperado:", r);
                $('#tableVentaPlanta2').html(`
                    <div class="alert alert-warning">
                        Los datos recibidos no tienen el formato esperado. 
                        Por favor, contacte al administrador.
                    </div>
                `);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud:", status, error);
            $('#tableVentaPlanta2').html(`
                <div class="alert alert-danger">
                    Error al cargar los datos: ${error}
                </div>
            `);
        }
    });
}

// Evento del botón Filtrado2
document.getElementById("btnFiltrar2").addEventListener("click", function () {
    var fecha2 = $("#fechaFiltro2").val();
    var fecha3 = $("#fechaFiltro3").val();

    if (!fecha2 || !fecha3) {
        alert("Por favor, seleccione ambas fechas.");
        return;
    }

    if (new Date(fecha2) > new Date(fecha3)) {
        alert("La fecha inicial no puede ser mayor que la fecha final.");
        return;
    }

    TotalPlantaByFecha2(fecha2, fecha3);
});

// Evento del botón Generar PDF
document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});

function generarReportePDF() {
    // Verificar si las librerías están cargadas
    if (typeof window.jspdf === 'undefined' || typeof html2canvas === 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Las bibliotecas necesarias no están cargadas correctamente',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    const { jsPDF } = window.jspdf;

    // Verificar si hay datos
    const tabla = $('#tableVentaPlanta2').DataTable();
    if (tabla.data().count() === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay datos para exportar',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    Swal.fire({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Crear elemento temporal para el reporte con un ancho más adecuado para vertical
    const pdfContent = document.createElement('div');
    Object.assign(pdfContent.style, {
        padding: '20px',
        width: '800px', // Reducido para mejor ajuste en vertical
        backgroundColor: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    });

    // Obtener fechas y datos
    const fechaInicio = $("#fechaFiltro2").val();
    const fechaFin = $("#fechaFiltro3").val();
    const now = new Date();
    const fechaGeneracion = now.toLocaleDateString('es-MX') + ' ' + now.toLocaleTimeString('es-MX');

    // Crear encabezado del reporte
    pdfContent.innerHTML = `
        <h1 style="text-align: center; margin-bottom: 20px; font-size: 22px; color: #333;">Reporte de Ventas por Planta</h1>
        <div style="margin-bottom: 20px; font-size: 14px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <p style="margin: 5px 0;"><strong>Fecha de reporte:</strong> ${fechaInicio} a ${fechaFin}</p>
            <p style="margin: 5px 0;"><strong>Generado el:</strong> ${fechaGeneracion}</p>
        </div>
    `;

    // Clonar la tabla y aplicar estilos
    const tableElement = document.getElementById('tableVentaPlanta2').cloneNode(true);
    Object.assign(tableElement.style, {
        width: '100%',
        marginBottom: '30px',
        fontSize: '10px', // Tamaño de fuente más pequeño para vertical
        borderCollapse: 'collapse'
    });

    // Aplicar estilos a las celdas
    const cells = tableElement.querySelectorAll('td, th');
    cells.forEach(cell => {
        Object.assign(cell.style, {
            padding: '6px',
            border: '1px solid #ddd',
            fontSize: '10px' // Tamaño consistente para todas las celdas
        });
    });

    // Aplicar estilos a los encabezados
    const headers = tableElement.querySelectorAll('th');
    headers.forEach(header => {
        Object.assign(header.style, {
            backgroundColor: '#f2f2f2',
            fontWeight: 'bold',
            fontSize: '11px' // Un poco más grande para headers
        });
    });

    // Añadir título de la tabla
    const titleElement = document.createElement('h2');
    titleElement.textContent = 'Ventas por Planta';
    Object.assign(titleElement.style, {
        margin: '15px 0 8px 0',
        fontSize: '16px',
        borderBottom: '2px solid #ddd',
        paddingBottom: '4px'
    });

    pdfContent.appendChild(titleElement);
    pdfContent.appendChild(tableElement);
    document.body.appendChild(pdfContent);

    // Generar el PDF
    html2canvas(pdfContent, {
        scale: 2,
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait', // Cambiado a vertical
            unit: 'mm',
            format: 'letter' // Tamaño carta
        });

        // Ajustar dimensiones para tamaño carta vertical
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth - 20; // Margen izquierdo y derecho
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10; // Margen superior

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Agregar páginas adicionales si es necesario
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        // Guardar el PDF
        const fileName = `Reporte_Ventas_Planta_${fechaInicio}_a_${fechaFin}.pdf`;
        pdf.save(fileName);

        // Limpiar y mostrar confirmación
        document.body.removeChild(pdfContent);
        Swal.fire({
            title: "Reporte Generado!",
            text: "El reporte ha sido generado exitosamente.",
            icon: "success",
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.reload();
        });
    }).catch(error => {
        console.error('Error al generar PDF:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al generar el PDF',
            confirmButtonText: 'Entendido'
        });
        document.body.removeChild(pdfContent);
    });
}