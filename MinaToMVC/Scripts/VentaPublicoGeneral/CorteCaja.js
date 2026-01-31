$(document).ready(function () {
    $("#tblDineroCaja").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        // Opciones para responsividad
        responsive: true,  // Habilita el plugin de responsividad
        scrollX: true,     // Habilita scroll horizontal
        scrollCollapse: true, // Permite colapsar el scroll
        autoWidth: false,  // Desactiva el ancho automático para mejor control

        // Configuración adicional para responsividad
        columnDefs: [
            {
                // Oculta columnas en pantallas pequeñas
                targets: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], // Índices de las columnas de billetes/monedas
                responsivePriority: 2, // Prioridad media para ocultar
                visible: false // Se ocultan por defecto en móviles
            },
            {
                // Mantiene visibles columnas importantes
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 20], // Columnas principales
                responsivePriority: 1, // Alta prioridad (se mantienen visibles)
            }
        ],

        // Opcional: Configuración específica para diferentes breakpoints
        initComplete: function () {
            // Asegurar que el contenedor tenga el estilo adecuado
            this.api().table().container().style.width = '100%';
            this.api().table().container().style.overflowX = 'auto';
        },
        columns: [
            { data: "id", "visible": false, title: "id" },
            {
                data: "ventaVale",
                title: "Venta por Vales",
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
                data: "ventaTransferencia",
                title: "Venta por Transferencia",
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
                data: "ventaEfectivo",
                title: "Venta por Efectivo",
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
                data: "totalUtilidad",
                title: "Total Unidad",
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
                data: "montoTotal",
                title: "Monto Total",
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
                data: "ingreso",
                title: "Ingreso",
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
                data: "egreso",
                title: "Egreso",
                render: function (data, type, row) {
                    if (data == null || data === "") return "$0.00";
                    return parseFloat(data).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2
                    });
                }
            },
            { data: "comentarios", title: "Comentario" },
            { data: "b1000", title: "Billetes de 1000" },
            { data: "b500", title: "Billetes de 500" },
            { data: "b200", title: "Billetes de 200" },
            { data: "b100", title: "Billetes de 100" },
            { data: "b50", title: "Billetes de 50" },
            { data: "b20", title: "Billetes de 20" },
            { data: "m10", title: "Monedas de 10" },
            { data: "m5", title: "Monedas de 5" },
            { data: "m2", title: "Monedas de 2" },
            { data: "m1", title: "Monedas de 1" },
            { data: "m050", title: "Monedas de 0.50c" },
            {
                data: "fecha",
                title: "Fecha",
                render: function (data, type, row) {
                    if (!data) return "";
                    let date = new Date(data);
                    let day = String(date.getDate()).padStart(2, '0');
                    let month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
                    let year = date.getFullYear();
                    return `${day}/${month}/${year}`;
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

    GetAllPV_CorteCaja();
});
$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmVentaCrud").validate({
        rules: {
            "Ingreso": {
                required: true
            },
            "Egreso": {
                required: true
            }
            ,
            "Comentario": {
                required: true
            }
            ,
            "Montototal": {
                required: true
            }
            ,
            "B500": {
                required: true
            }
            ,
            "B200": {
                required: true
            }
            ,
            "B100": {
                required: true
            }
            ,
            "B50": {
                required: true
            }
            ,
            "B20": {
                required: true
            }
            ,
            "M10": {
                required: true
            }
            ,
            "M5": {
                required: true
            }
            ,
            "M2": {
                required: true
            }
            ,
            "M1": {
                required: true
            }
            ,
            "M050": {
                required: true
            }
            
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const drop = document.getElementById("usuarioDrop");
    const createdBy = document.getElementById("createdBy");
    const updatedBy = document.getElementById("updatedBy");
    const usuarioName = document.getElementById("usuarioName");
    const fecha = document.getElementById("fecha");

    function syncValues() {
        const selectedName = drop.options[drop.selectedIndex].text;

        createdBy.value = selectedName;
        updatedBy.value = selectedName;
        usuarioName.value = selectedName;
    }

});

function GetAllPV_CorteCaja() {
    GetMVC("/VentaPublicoGeneral/GetAllPV_CorteCaja", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblDineroCaja", r.Response);
        } else {
            alert("Error al cargar las Ventas: " + r.ErrorMessage);
        }
    });
}