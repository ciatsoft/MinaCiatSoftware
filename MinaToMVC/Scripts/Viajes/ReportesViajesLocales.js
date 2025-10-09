$(document).ready(function () {
    // Inicialización de la tabla de viajes locales con formato
    $("#tblVentasGenerales").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "folio", "visible": false, title: "Folio" },
            { data: "ubicacionOrigen.nombreUbicacion", title: "Origen" },
            { data: "transportista.nombre", title: "Transportista" },
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },
            { data: "vehiculo.placa", title: "Vehiculo" },
            { data: "cliente.nombre", title: "Cliente" },
            { data: "unidadMedida.nombre", title: "Unidad de Medida" },
            {
                data: "fechaViaje",
                title: "Fecha de transporte",
                render: function (data, type, row) {
                    if (data) {
                        var date = new Date(data);
                        var day = ("0" + date.getDate()).slice(-2);
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    }
                    return "";
                }
            },
            { data: "observaciones", title: "Observaciones" }
        ],
        order: [0, 'desc'],
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

    // Inicialización de la tabla de viajes locales con formato
    $("#tblVentasGeneralesFiltradas").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "folio", "visible": false, title: "Folio" },
            { data: "ubicacionOrigen.nombreUbicacion", title: "Origen" },
            { data: "transportista.nombre", title: "Transportista" },
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },
            { data: "vehiculo.placa", title: "Vehiculo" },
            { data: "cliente.nombre", title: "Cliente" },
            { data: "unidadMedida.nombre", title: "Unidad de Medida" },
            {
                data: "fechaViaje",
                title: "Fecha de transporte",
                render: function (data, type, row) {
                    if (data) {
                        var date = new Date(data);
                        var day = ("0" + date.getDate()).slice(-2);
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    }
                    return "";
                }
            },
            { data: "observaciones", title: "Observaciones" }
        ],
        order: [0, 'desc'],
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

    GetAllViajeLocal();
});

function GetAllViajeLocal() {
    GetMVC("/Viajes/GetAllViajeLocal", function (r) {
        if (r.IsSuccess) {
            console.log("Estructura de los datos:", r.Response); // Verificar el contenido exacto de la respuesta
            MapingPropertiesDataTable("tblVentasGenerales", r.Response);
        } else {
            alert("Error al cargar los viajes: " + r.ErrorMessage);
        }
    });
}