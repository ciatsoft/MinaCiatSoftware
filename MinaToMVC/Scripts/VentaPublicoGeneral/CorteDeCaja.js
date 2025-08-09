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
            { data: 'corte_Id', title: 'ID Corte', visible: false },
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

    //Inicializar tabla vacia Dinero en Caja
    $('#tblEn_Caja').DataTable({
        data: [],
        columns: [
            { data: "id", "visible": false, title: "id" },
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
            { data: 'corte_Id', title: 'ID Corte', visible: false },
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

    //Inicializar tabla vacia Deducciones
    $('#tblDeducciones').DataTable({
        data: [],
        columns: [
            { data: 'Id', title: 'Id', visible: false},
            { data: 'nombreGasto', title: 'Tipo de Gasto' },
            { data: "descripcion", title: "Descripción de la Deducción" },
            { data: "usuarioName", title: "Encargado" },
            {
                data: "monto",
                title: "Monto",
                render: function (data) {
                    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data);
                }
            },
            {
                data: "fecha",
                title: "Fecha",
                render: function (data) {
                    return new Date(data).toLocaleDateString('es-MX');
                }
            }   
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


    //Iniciar tabla vacia de Prepago
    $('#tblPrepago').DataTable({
        data: [],
        columns: [
            { data: "folioInicio", title: "Folio Inicio" },
            { data: "folioFinal", title: "Folio Final" },
            { data: "nombreMaterial", title: "Material" },
            { data: "cantidadM3", title: "Cantidad de M3" },
            { data: "precioUnidad", title: "Precio Unidad" },
            { data: "importeVenta", title: "Importe Venta", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
            { data: "rfid", title: "RFID", visible: false },
            { data: "idCliente", title: "ID Cliente" ,visible: false},
            { data: "nombreCliente", title: "Nombre Cliente" },
            { data: "cantidadVales", title: "Cantidad Vales" },
            {
                data: "fecha",
                title: "Fecha",
                render: function (data) {
                    return new Date(data).toLocaleString('es-MX');
                }
            }
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
                "sortAscending": ": activar para ordenar columna ascendente",
                "sortDescending": ": activar para ordenar columna descendente"
            }
        }
    });



    //Inicializar tabla vacia Caja Chica
    $('#tblCajaChica').DataTable({
        data: [],
        columns: [
            { data: "id", "visible": false, title: "id" },
            {
                data: 'fecha',
                title: 'Fecha',
                render: function (data) {
                    return new Date(data).toLocaleString('es-MX'); // muestra fecha + hora
                }
            },
            { data: "monto", title: "Monto" },
            { data: "comentarios", title: "Comentarios" },
            { data: 'corte_Id', title: 'ID Corte', visible: false },
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

    limpiarCalculos();

    SearchPV_VentasByDateAndUser(usuarioId, fecha, userName);
});

function SearchPV_VentasByDateAndUser(usuarioId, fecha, userName) {
    PostMVC('/VentaPublicoGeneral/SearchPV_VentasByDateAndUser', { usuarioId, fecha }, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            const data = r.Response;

            if ($.fn.DataTable.isDataTable('#tblVentas_Realizadas')) {
                $('#tblVentas_Realizadas').DataTable().clear().destroy();
            }

            if ($.fn.DataTable.isDataTable('#tblVentas_Aprobadas')) {
                $('#tblVentas_Aprobadas').DataTable().clear().destroy();
            }

            $('#tblVentas_Realizadas').DataTable({
                data: data,
                columns: [
                    { data: 'folio', title: 'Folio' },
                    {
                        data: 'totalPago',
                        title: 'Total Pago',
                        render: function (data) {
                            // Verificar si el totalPago es 0
                            if (parseFloat(data) === 0) {
                                return '<span class="prepago-text">Esta venta se registra como canjeo de vale para prepago</span>';
                            }
                            // Si no es 0, mostrar el valor formateado normalmente
                            return `$${parseFloat(data).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
                        }
                    },
                    {
                        data: "formaDePago",
                        title: "Forma de Pago",
                        render: function (data) {
                            if (data === "E") return "Efectivo";
                            if (data === "T") return "Transferencia";
                            if (data === "P") return "Prepago";
                            return "Vale";
                        }
                    },
                    {
                        data: "estatusVenta",
                        title: "Estado de Venta",
                        render: function (data) {
                            if (data === "E") return "Efectiva";
                            if (data === "C") return "Cancelada";
                            return "Rechazada";
                        }
                    },
                    {
                        data: "fecha",
                        title: "Fecha",
                        render: function (data) {
                            // Opción 1: Formato básico dd/mm/aaaa
                            const date = new Date(data);
                            return date.toLocaleDateString('es-MX');
                        }
                    },
                    {
                        data: 'corte_Id',
                        title: 'ID Corte',
                        render: function (data) {
                            return data > 0 ? data : '';
                        },
                        visible: data.some(item => item.corte_Id > 0)
                    }
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

            const datosFiltrados = data.filter(item => item.estatusVenta === "E");

            const resumenPorPago = datosFiltrados.reduce((acc, item) => {
                let tipoPago = item.formaDePago === "E" ? "Efectivo" : item.formaDePago === "T" ? "Transferencia" : "Vale";
                if (!acc[tipoPago]) {
                    acc[tipoPago] = { formaDePago: tipoPago, totalPago: 0, cantidadRegistros: 0 };
                }
                acc[tipoPago].totalPago += parseFloat(item.totalPago);
                acc[tipoPago].cantidadRegistros++;
                return acc;
            }, {});

            const resumenArray = Object.values(resumenPorPago);
            const totalGeneral = resumenArray.reduce((acc, item) => acc + item.totalPago, 0);

            document.getElementById('ingreso').value = totalGeneral.toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

            $('#tblVentas_Aprobadas').DataTable({
                data: resumenArray,
                columns: [
                    { data: 'formaDePago', title: 'Forma de Pago' },
                    {
                        data: 'totalPago',
                        title: 'Total Acumulado',
                        render: function (data) {
                            return `$${parseFloat(data).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
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

            const resultados = {
                totalGeneral: 0,
                totalMonto: 0,
                totalDeducciones: 0
            };

            const handleAjaxError = (error) => {
                console.error("Error en la llamada AJAX:", error);
                alert("Ocurrió un error al obtener los datos. Por favor revisa la consola para más detalles.");
            };

            PostMVC('/VentaPublicoGeneral/SearchPV_DineroCajaByDateAndUser', { userName, fecha }, function (r, textStatus, jqXHR) {
                if (!r.IsSuccess) {
                    handleAjaxError(r.Message);
                    return;
                }

                if ($.fn.DataTable.isDataTable('#tblEn_Caja')) {
                    $('#tblEn_Caja').DataTable().clear().destroy();
                }

                const cajaData = r.Response;

                $('#tblEn_Caja').DataTable({
                    data: cajaData,
                    columns: [
                        { data: "id", visible: false, title: "id" },
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
                            data: "ventaVale",
                            title: "Venta por Vales",
                            render: function (data) {
                                return data ? parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : "$0.00";
                            }
                        },
                        {
                            data: "ventaTransferencia",
                            title: "Venta por Transferencia",
                            render: function (data) {
                                return data ? parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : "$0.00";
                            }
                        },
                        {
                            data: "ventaEfectivo",
                            title: "Venta por Efectivo",
                            render: function (data) {
                                return data ? parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : "$0.00";
                            }
                        },
                        {
                            data: 'corte_Id',
                            title: 'ID Corte',
                            render: function (data) {
                                return data > 0 ? data : '';
                            },
                            visible: cajaData.some(item => item.corte_Id > 0)
                        }
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

                PostMVC('/VentaPublicoGeneral/SearchDeduccionesByDateAndUserAndCorteId', { userName, fecha }, function (r) {
                    if (r.IsSuccess && Array.isArray(r.Response)) {
                        const data = r.Response;
                        const table = $("#tblDeducciones");

                        resultados.totalMontoDeducciones = 0;
                        data.forEach(item => {
                            resultados.totalMontoDeducciones += parseFloat(item.monto);
                        });

                        $('#deduccion').val(resultados.totalMontoDeducciones.toLocaleString('es-MX', {
                            style: 'currency',
                            currency: 'MXN'
                        }));

                        if ($.fn.DataTable.isDataTable(table)) {
                            table.DataTable().clear().destroy();
                            table.empty();
                        }

                        table.DataTable({
                            data: data,
                            columns: [
                                { data: "id", title: "Id", visible: false },
                                { data: "nombreGasto", title: "Tipo Gasto" },
                                { data: "descripcion", title: "Descripcion de la Deduccion" },
                                { data: "usuarioName", title: "Encargado", visible: false },
                                {
                                    data: "monto",
                                    title: "Monto",
                                    render: function (data) {
                                        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data);
                                    }
                                },
                                {
                                    data: "fecha",
                                    title: "Fecha",
                                    render: function (data) {
                                        return new Date(data).toLocaleDateString('es-MX');
                                    }
                                },
                                {
                                    data: 'corte_Id',
                                    title: 'ID Corte',
                                    render: function (data) {
                                        return data > 0 ? data : '';
                                    },
                                    visible: data.some(item => item.corte_Id > 0)
                                }
                            ],
                            language: {
                                "decimal": ",",
                                "thousands": ".",
                                "processing": "Procesando...",
                                "lengthMenu": "Mostrar _MENU_ entradas",
                                "zeroRecords": "No se encontraron resultados",
                                "emptyTable": "Sin Gastos Registrados",
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

                        PostMVC('/VentaPublicoGeneral/VentasDiariasPrepago', { fecha }, function (r) {
                            if (r.IsSuccess && Array.isArray(r.Response)) {
                                const ventasPrepago = r.Response;

                                resultados.totalPrepago = ventasPrepago.reduce((total, item) => {
                                    return total + parseFloat(item.importeVenta || 0); // Asegura parseo y manejo de undefined
                                }, 0);

                                // Corregido: Cambiar toLocaleDateString por toLocaleString
                                $('#valesPrepago').val(resultados.totalPrepago.toLocaleString('es-MX', {
                                    style: 'currency',
                                    currency: 'MXN'
                                }));

                                calcularTotal();

                                if ($.fn.DataTable.isDataTable('#tblPrepago')) {
                                    $('#tblPrepago').DataTable().clear().destroy();
                                }

                                $('#tblPrepago').DataTable({
                                    data: ventasPrepago,
                                    columns: [
                                        { data: "folioInicio", title: "Folio Inicio" },
                                        { data: "folioFinal", title: "Folio Final" },
                                        { data: "nombreMaterial", title: "Material" },
                                        { data: "cantidadM3", title: "Cantidad de M3" },
                                        {
                                            data: "precioUnidad",
                                            title: "Precio Unidad",
                                            render: $.fn.dataTable.render.number(',', '.', 2, '$')
                                        },
                                        { data: "importeVenta", title: "Importe Venta", render: $.fn.dataTable.render.number(',', '.', 2, '$') },
                                        { data: "rfid", title: "RFID", visible: false },
                                        { data: "idCliente", title: "ID Cliente", visible: false },
                                        { data: "nombreCliente", title: "Nombre Cliente" },
                                        { data: "cantidadVales", title: "Cantidad Vales" },
                                        {
                                            data: "fecha",
                                            title: "Fecha",
                                            render: function (data) {
                                                // Opción 1: Formato básico dd/mm/aaaa
                                                const date = new Date(data);
                                                return date.toLocaleDateString('es-MX');
                                            }
                                        }
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
                                $('#ingreso, #caja, #deduccion, #valesPrepago').on('change', calcularTotal);
                            }
                        })

                        PostMVC('/VentaPublicoGeneral/SearchPV_CajaChicaByDateAndUserAndCorteId', { userName, fecha }, function (r) {
                            if (r.IsSuccess && Array.isArray(r.Response)) {
                                const cajaChicaData = r.Response;

                                resultados.totalMonto = 0;
                                cajaChicaData.forEach(item => {
                                    resultados.totalMonto += parseFloat(item.monto);
                                });

                                $('#caja').val(resultados.totalMonto.toLocaleString('es-MX', {
                                    style: 'currency',
                                    currency: 'MXN'
                                }));

                                calcularTotal();

                                if ($.fn.DataTable.isDataTable('#tblCajaChica')) {
                                    $('#tblCajaChica').DataTable().clear().destroy();
                                }

                                $('#tblCajaChica').DataTable({
                                    data: cajaChicaData,
                                    columns: [
                                        { data: "id", visible: false, title: "Id" },
                                        {
                                            data: 'fecha',
                                            title: 'Fecha',
                                            render: function (data) {
                                                return new Date(data).toLocaleString('es-MX');
                                            }
                                        },
                                        {
                                            data: 'monto',
                                            title: 'Monto',
                                            render: function (data) {
                                                return `$${parseFloat(data).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
                                            }
                                        },
                                        { data: "comentarios", title: "Comentarios" },
                                        {
                                            data: 'corte_Id',
                                            title: 'ID Corte',
                                            render: function (data) {
                                                return data > 0 ? data : '';
                                            },
                                            visible: cajaChicaData.some(item => item.corte_Id > 0)
                                        }
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
                                $('#ingreso, #caja, #deduccion, #valesPrepago').on('change', calcularTotal);
                            }
                        });
                    }
                });
            });
        } else {
            console.error("Error en la primera llamada AJAX:", r.Message);
            alert("Ocurrió un error al obtener los datos de ventas. Por favor revisa la consola para más detalles.");
        }
    });
}

function calcularTotal() {
    // Obtener valores numéricos de los inputs con manejo seguro de valores nulos/undefined
    const ingreso = parseFloat($('#ingreso').val()?.replace(/[^0-9.-]+/g, "") || 0);
    const caja = parseFloat($('#caja').val()?.replace(/[^0-9.-]+/g, "") || 0);
    const deduccion = parseFloat($('#deduccion').val()?.replace(/[^0-9.-]+/g, "") || 0);
    const valePrepago = parseFloat($('#valesPrepago').val()?.replace(/[^0-9.-]+/g, "") || 0);

    // Calcular el total (ingreso + valePrepago) - ( caja + deduccion)
    const total = (ingreso + valePrepago) - (caja + deduccion);

    // Actualizar el campo total
    $('#total').val(total.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }));
}

function limpiarCalculos() {
    $('#ingreso').val('');
    $('#caja').val();
    $('#deduccion').val();
    $('#total').val();
    $('#valesPrepago').val();
}

// Evento del botón Generar PDF
document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});

function generarReportePDF() {
    if (typeof window.jspdf === 'undefined') {
        alert('Error: La biblioteca jsPDF no está cargada correctamente.');
        return;
    }

    const { jsPDF } = window.jspdf;

    // Mostrar animación de carga
    Swal.fire({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Validar si las tablas están vacías (excepto Deducciones)
    const tablasRequeridas = [
        { id: '#tblCajaChica', nombre: 'Caja Chica' },
        { id: '#tblVentas_Realizadas', nombre: 'Ventas Realizadas' },
        { id: '#tblEn_Caja', nombre: 'En Caja' }
    ];

    for (let tabla of tablasRequeridas) {
        if ($(tabla.id).DataTable().data().count() === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin datos',
                text: `La tabla "${tabla.nombre}" está vacía.`,
                confirmButtonText: 'Entendido'
            });
            return;
        }
    }

    // Obtener datos de tablas (incluyendo Deducciones aunque esté vacía)
    const datosVentas = $('#tblVentas_Realizadas').DataTable().rows().data().toArray();
    const datosCajaChica = $('#tblCajaChica').DataTable().rows().data().toArray();
    const datosDeducciones = $('#tblDeducciones').DataTable().rows().data().toArray();
    const datosEnCaja = $('#tblEn_Caja').DataTable().rows().data().toArray();

    // Función para validar si existen Corte_Id
    function tieneCorteId(datos) {
        return datos.some(row => {
            const corteId = row.corte_Id !== undefined ? row.corte_Id :
                row.Corte_Id !== undefined ? row.Corte_Id : null;
            return corteId !== null && !isNaN(corteId) && parseInt(corteId) > 0;
        });
    }

    // Verificar si existe algún Corte_Id
    const existeCorteId = (
        tieneCorteId(datosVentas) ||
        tieneCorteId(datosCajaChica) ||
        tieneCorteId(datosDeducciones) ||
        tieneCorteId(datosEnCaja)
    );

    // Si NO hay Corte_Id, ejecuta InfoReporte()
    if (!existeCorteId && typeof InfoReporte === 'function') {
        var usuarioId = $("#userId").val();
        var fechaFiltro = $("#fechaFiltro").val();
        var usuarioName = $("#userName").val();
        var estatus = 1;
        var createdBy = $("#userName").val();
        var createdDt = new Date().toISOString();
        var updatedBy = $("#userName").val();
        var updatedDt = new Date().toISOString();

        InfoReporte(usuarioId, usuarioName, fechaFiltro, estatus, createdBy, createdDt, updatedBy, updatedDt);
    }

    // Comienza la generación del PDF
    const pdfContent = document.createElement('div');
    pdfContent.style.padding = '20px';
    pdfContent.style.width = '1000px';
    pdfContent.style.fontSize = '14px';

    const fecha = $("#fechaFiltro").val();
    const userName = $("#userName").val();
    const now = new Date();
    const fechaGeneracion = now.toLocaleDateString('es-MX') + ', ' + now.toLocaleTimeString('es-MX');

    pdfContent.innerHTML = `
        <h1 style="text-align: center; margin-bottom: 20px; font-size: 24px;">Reporte de Utilidades Diarias</h1>
        <div style="margin-bottom: 30px; font-size: 16px;">
            <p><strong>Fecha de Reporte:</strong> ${fecha}</p>
            <p><strong>Usuario:</strong> ${userName}</p>
            <p><strong>Fecha de Generacion:</strong> ${fechaGeneracion}</p>
        </div>
    `;

    // Si ya existe un Corte_Id, agregar leyenda
    if (existeCorteId) {
        const leyenda = document.createElement('div');
        leyenda.style.margin = '30px 0';
        leyenda.style.padding = '15px';
        leyenda.style.border = '2px dashed red';
        leyenda.style.color = 'red'; 
        leyenda.style.fontWeight = 'bold';
        leyenda.style.fontSize = '16px';
        leyenda.textContent = 'Este reporte ya ha sido generado anteriormente.';
        pdfContent.appendChild(leyenda);
    }

    const tablasAExportar = [
        { id: 'tblVentas_Realizadas', title: 'Ventas Realizadas' },
        { id: 'tblVentas_Aprobadas', title: 'Resumen de Ventas Aprobadas' },
        { id: 'tblEn_Caja', title: 'Dinero en Caja' },
        { id: 'tblDeducciones', title: 'Deducciones' },
        { id: 'tblCajaChica', title: 'Movimientos de Caja Chica' }
    ];

    tablasAExportar.forEach(tabla => {
        const tableElement = document.getElementById(tabla.id);
        if (tableElement) {
            // Verificar si la tabla tiene datos (excepto para Deducciones)
            const dataTable = $(`#${tabla.id}`).DataTable();
            if (tabla.id !== 'tblDeducciones' && dataTable.data().count() === 0) {
                return; // Saltar esta tabla (excepto Deducciones)
            }

            const tableClone = tableElement.cloneNode(true);
            tableClone.style.width = '100%';
            tableClone.style.marginBottom = '40px';
            tableClone.style.fontSize = '12px';

            const cells = tableClone.querySelectorAll('td, th');
            cells.forEach(cell => {
                cell.style.padding = '8px';
                cell.style.border = '1px solid #ddd';
            });

            const headers = tableClone.querySelectorAll('th');
            headers.forEach(header => {
                header.style.backgroundColor = '#f2f2f2';
                header.style.fontWeight = 'bold';
            });

            const titleElement = document.createElement('h2');
            titleElement.textContent = tabla.title;
            titleElement.style.margin = '20px 0 10px 0';
            titleElement.style.fontSize = '18px';
            titleElement.style.borderBottom = '2px solid #ddd';
            titleElement.style.paddingBottom = '5px';

            pdfContent.appendChild(titleElement);
            pdfContent.appendChild(tableClone);
        }
    });

    const utilidadesDiv = document.createElement('div');
    utilidadesDiv.style.marginTop = '40px';
    utilidadesDiv.style.padding = '20px';
    utilidadesDiv.style.border = '2px solid #ddd';
    utilidadesDiv.style.borderRadius = '8px';
    utilidadesDiv.style.backgroundColor = '#f9f9f9';
    utilidadesDiv.style.fontSize = '16px';

    utilidadesDiv.innerHTML = `
        <h2 style="margin-top: 0; border-bottom: 2px solid #ddd; padding-bottom: 8px; font-size: 20px;">Resumen de Utilidades</h2>
        <p style="margin: 10px 0;"><strong>Ingresos:</strong> ${document.getElementById('ingreso').value}</p>
        <p style="margin: 10px 0;"><strong>Caja:</strong> ${document.getElementById('caja').value}</p>
        <p style="margin: 10px 0;"><strong>Deducciones:</strong> ${document.getElementById('deduccion').value}</p>
        <p style="margin: 10px 0; font-weight: bold; font-size: 18px;"><strong>Total Utilidad:</strong> ${document.getElementById('total').value}</p>
    `;

    pdfContent.appendChild(utilidadesDiv);
    document.body.appendChild(pdfContent);

    html2canvas(pdfContent, {
        scale: 3,
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const imgWidth = 190;
        const pageHeight = 277;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10;

        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            pdf.addPage();
            position = heightLeft - imgHeight;
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        const fileName = `Reporte_Utilidades_${fecha.replace(/\//g, '-')}_${userName}.pdf`;
        pdf.save(fileName);

        document.body.removeChild(pdfContent);

        Swal.fire({
            title: "Reporte Generado!",
            text: "El reporte ha sido generado exitosamente.",
            icon: "success",
            confirmButtonText: 'OK'
        }).then(() => {
            if (existeCorteId) {
                window.location.reload();
            }
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

function InfoReporte(usuarioId, usuarioName, fechaFiltro, estatus, createdBy, createdDt, updatedBy, updatedDt) {
    PostMVC('/VentaPublicoGeneral/SaveOrUpdateReporte_Venta', { usuarioId, usuarioName, fechaFiltro, estatus, createdBy, createdDt, updatedBy, updatedDt }, function (r, textStatus, jqXHR) {
        if (!r.IsSuccess) {
            Swal.fire({
                title: "Reporte Generado!",
                text: "El reporte ha sido generado exitosamente.",
                icon: "success",
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar los datos: ' + r.ErrorMessage,
                confirmButtonText: 'Aceptar'
            });
        }
    });
}