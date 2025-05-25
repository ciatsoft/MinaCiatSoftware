$(document).ready(function () {
    //Inicializar tabla vacia Ventas Aprobadas
    $('#tblVentas_Aprobadas').DataTable({
        data: [],
        columns: [
            { data: 'formaDePago', title: 'Metodo de Pago' },
            { data: 'formaDePago', title: 'Total Acumulado' },
            { data: 'estatusVenta', title: 'Cantidad de Registros' },
        ],
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

    //Inicializar tabla vacia Ventas Totales
    $('#tblVentas_Realizadas').DataTable({
        data: [],
        columns: [
            { data: 'folio', title: 'Folio' },
            {
                data: 'totalPago',
                title: 'Total Pago',
                render: function (data) {
                    return `$${parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }).replace('$', '')}`;
                }
            },
            { data: 'formaDePago', title: 'Metodo de Pago' },
            { data: 'estatusVenta', title: 'Estatus' },
            {
                data: 'fecha',
                title: 'Fecha',
                render: function (data) {
                    return new Date(data).toLocaleString('es-MX'); // muestra fecha + hora
                }
            },
        ],
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

// Evento del botón
document.getElementById("btnFiltrar").addEventListener("click", function () {

    var usuarioId = $("#userId").val();
    var fecha = $("#fechaFiltro").val();
    var userName = $("#userName").val();

    if (!usuarioId || !fecha || !userName) {
        alert("Por favor, seleccione un usuario y una fecha válida.");
        return;
    }

    SearchPV_VentasByDateAndUser(usuarioId, fecha);
});

function SearchPV_VentasByDateAndUser(usuarioId, fecha) {
    PostMVC('/VentaPublicoGeneral/SearchPV_VentasByDateAndUser', { usuarioId, fecha }, function (r, textStatus, jqXHR) {
        console.log("Respuesta objeto r:", r);
        if (r.IsSuccess) {
            const data = r.Response;

            // Destruye DataTable si ya existe (evita duplicados al hacer múltiples filtros)
            if ($.fn.DataTable.isDataTable('#tblVentas_Realizadas')) {
                $('#tblVentas_Realizadas').DataTable().clear().destroy();
            }

            if ($.fn.DataTable.isDataTable('#tblVentas_Aprobadas')) {
                $('#tblVentas_Aprobadas').DataTable().clear().destroy();
            }

            // Mapea los datos al DataTable Ventas GENERALES
            $('#tblVentas_Realizadas').DataTable({
                data: data,
                columns: [
                    { data: 'folio', title: 'Folio' },
                    {
                        data: 'totalPago',
                        title: 'Total Pago',
                        render: function (data) {
                            return `$${parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }).replace('$', '')}`;
                        }
                    },
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
                        data: "estatusVenta",
                        title: "Estado de Venta",
                        render: function (data, type, row) {
                            if (data === "E") {
                                return "Efectiva";
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
                        data: 'fecha',
                        title: 'Fecha',
                        render: function (data) {
                            return new Date(data).toLocaleString('es-MX'); // muestra fecha + hora
                        }
                    },
                ],
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

            // Mapea los datos al DataTable Ventas Aprobadas

            const datosFiltrados = data.filter(item => item.estatusVenta === "E");

            // Agrupar por formaDePago
            const resumenPorPago = datosFiltrados.reduce((acc, item) => {
                let tipoPago = "";
                if (item.formaDePago === "E") tipoPago = "Efectivo";
                else if (item.formaDePago === "T") tipoPago = "Transferencia";
                else tipoPago = "Vale";

                if (!acc[tipoPago]) {
                    acc[tipoPago] = {
                        formaDePago: tipoPago,
                        totalPago: 0,
                        cantidadRegistros: 0
                    };
                }

                acc[tipoPago].totalPago += parseFloat(item.totalPago);
                acc[tipoPago].cantidadRegistros += 1;

                return acc;
            }, {});

            // Convertir el resumen en array para DataTable
            const resumenArray = Object.values(resumenPorPago);

            // Crear una nueva tabla con datos resumidos
            $('#tblVentas_Aprobadas').DataTable({
                data: resumenArray,
                columns: [
                    { data: 'formaDePago', title: 'Forma de Pago' },
                    {
                        data: 'totalPago',
                        title: 'Total Acumulado',
                        render: function (data) {
                            return `$${parseFloat(data).toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            }).replace('$', '')}`;
                        }
                    },
                    { data: 'cantidadRegistros', title: 'Cantidad de Registros' }
                ],
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

        } else {
            alert("Error al obtener registros. Ver consola para más detalles.");
        }
    });
}