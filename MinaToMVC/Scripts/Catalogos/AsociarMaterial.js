$("#tablePuntoVenta").dataTable({
    processing: true,
    destroy: true,
    paging: true,
    searching: true,
    columns: [
        { data: "id", "visible": false, title: "id" },
        { data: "folio", title: "Folio" },
        { data: "nombreUbicacion", title: "Planta" },
        { data: "nombreTipoMaterial", title: "Material" },
        {
            data: "formaDePago",
            title: "Forma de Pago",
            render: function (data, type, row) {
                if (data === "E") {
                    return "Efectivo";
                }
                else if (data == "T") {
                    return "Transferencia";
                } else {
                    return "Vale";
                }
                return data;
            }
        },
        {
            data: "cantidadRecibida",
            title: "Cantidad Recibida",
            render: function (data, type, row) {
                if (data == null || data === "") return "$0.00";
                return parseFloat(data).toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 2
                });
            }
        },
        {
            data: "totalPago",
            title: "Total Pago",
            render: function (data, type, row) {
                if (data == null || data === "") return "$0.00";
                return parseFloat(data).toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 2
                });
            }
        },
        { data: "transporte", title: "Transporte" },
        { data: "placa", title: "Placa" },
        { data: "cantidad", title: "Cantidad" },
        {
            data: "precioUnidad",
            title: "Precio por Unidad",
            render: function (data, type, row) {
                if (data == null || data === "") return "$0.00";
                return parseFloat(data).toLocaleString('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                    minimumFractionDigits: 2
                });
            }
        },
        { data: "nombreUnidadMedida", title: "Unidad Medida" },
        { data: "userName", title: "Usuario" },
        {
            data: "fecha",
            title: "Fecha",
            render: function (data, type, row) {
                if (!data) return "";
                let date = new Date(data);
                let day = String(date.getDate()).padStart(2, '0');
                let month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
                let year = date.getFullYear();
                return ${ day } /${month}/${ year };
            }
        },
        {
            data: "estatus",
            title: "Estatus",
            render: function (data, type, row) {
                return data == 1 ? "Activo" : "Inactivo";
            }
        },
        {
            data: "estatusVenta",
            title: "Pago",
            render: function (data, type, row) {
                if (data === "E") {
                    return "Efectivo";
                }
                else if (data == "C") {
                    return "Cancelada";
                } else {
                    return "Rechazada";
                }
                return data;
            }
        },
        {
            data: "id", render: function (data) {
                return '<input type="button" value="Cancelar Venta" class="btn btn-custom-cancel" onclick="ActualizarVenta(' + data + ', \'C\')" />' +
                    '<br /><br />' +
                    '<input type="button" value="Rechazar Venta" class="btn btn-custom-clean" onclick="ActualizarVenta(' + data + ', \'R\')" />';
            }
        }
    ]
    ,
    language: {
        "decimal": ",",
        "thousands": ".",
        "processing": "Procesando...",
        "lengthMenu": "Mostrar MENU entradas",
        "zeroRecords": "No se encontraron resultados",
        "emptyTable": "Ningún dato disponible en esta tabla",
        "info": "Mostrando START a END de TOTAL entradas",
        "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
        "infoFiltered": "(filtrado de un total de MAX entradas)",
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

GetAllPV_Ventas();

    function GetAllPV_Ventas() {
        GetMVC("/VentaPublicoGeneral/GetAllPV_Ventas", function (r) {
            if (r.IsSuccess) {
                MapingPropertiesDataTable("tablePuntoVenta", r.Response);
            } else {
                alert("Error al cargar las Ventas: " + r.ErrorMessage);
            }
        });
    }
