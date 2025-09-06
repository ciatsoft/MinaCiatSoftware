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
            "emptyTable": "Ningun dato disponible en esta tabla",
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
            "emptyTable": "Ningun dato disponible en esta tabla",
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
    // Verificar si hay datos
    var tabla = $('#tableVentaPlanta2').DataTable();
    var datos = tabla.data().toArray();

    if (tabla.data().count() === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay datos para exportar',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Swalfire de generando reporte
    Swal.fire({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();

            // Cerrar automáticamente después de 8 segundos
            setTimeout(() => {
                Swal.close();

                // Mostrar mensaje de éxito después de cerrar
                Swal.fire({
                    icon: 'success',
                    title: '¡Reporte generado!',
                    text: 'El PDF se ha creado correctamente',
                    timer: 3000, // Opcional: cerrar después de 3 segundos
                    showConfirmButton: false
                });
            }, 4000); // 4000 ms = 4 segundos
        }
    });

    // Crear tabla HTML manualmente
    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';

    // Encabezados (excluyendo columnas ocultas y de acciones)
    tablaHTML += '<thead><tr>';
    tablaHTML += '<th>Folio</th>';
    tablaHTML += '<th>Planta</th>';
    tablaHTML += '<th>Total Vendido en M3</th>';
    tablaHTML += '</tr></thead>';

    // Datos
    tablaHTML += '<tbody>';
    datos.forEach(function (item) {
        tablaHTML += '<tr>';
        tablaHTML += '<td>' + (item.pV_PlantaId || '') + '</td>';
        tablaHTML += '<td>' + (item.nombreUbicacion || '') + '</td>';
        tablaHTML += '<td>' + (item.totalVendido ?
            new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            }).format(item.totalVendido) : '') + '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    // Crear formulario y enviar
    var form = $('<form>', {
        method: 'POST',
        action: '/Pdf/GenerarReporteVentaPorPlanta'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaHTML',
        value: tablaHTML
    }).appendTo(form);

    form.appendTo('body').submit().remove();
}