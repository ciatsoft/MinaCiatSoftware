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