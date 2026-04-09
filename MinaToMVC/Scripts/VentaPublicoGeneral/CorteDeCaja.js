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

    //Inicializar tabla vacia Dinero en Caja
    $('#tblEn_Caja').DataTable({
        data: [],
        scrollX: true,  // Agrega scroll horizontal
        responsive: true,  // Hace la tabla responsiva
        autoWidth: false,  // Mejor control del ancho de columnas
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

    //Inicializar tabla vacia Deducciones
    $('#tblDeducciones').DataTable({
        data: [],
        columns: [
            { data: 'Id', title: 'Id', visible: false},
            { data: 'nombreGasto', title: 'Tipo de Gasto' },
            { data: "descripcion", title: "Descripcion de la Deduccion" },
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
            },
            { data: 'corte_Id', title: 'ID Corte', visible: false },
        ],
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
                    scrollX: true,  // Agrega scroll horizontal
                    responsive: true,  // Hace la tabla responsiva
                    autoWidth: false,  // Mejor control del ancho de columnas
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

                                // Evaluar si existe al menos un corte_Id > 0
                                const mostrarCorteId = ventasPrepago.some(item => item.corte_Id > 0);

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
                                        {
                                            data: "importeVenta",
                                            title: "Importe Venta",
                                            render: $.fn.dataTable.render.number(',', '.', 2, '$')
                                        },
                                        { data: "rfid", title: "RFID", visible: false },
                                        { data: "idCliente", title: "ID Cliente", visible: false },
                                        { data: "nombreCliente", title: "Nombre Cliente" },
                                        { data: "cantidadVales", title: "Cantidad Vales" },
                                        {
                                            data: "fecha",
                                            title: "Fecha",
                                            render: function (data) {
                                                const date = new Date(data);
                                                return date.toLocaleDateString('es-MX');
                                            }
                                        },
                                        {
                                            data: "corte_Id",
                                            title: "ID Corte",
                                            render: function (data) {
                                                return data > 0 ? data : '';
                                            },
                                            visible: mostrarCorteId
                                        }
                                    ],
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
                                $('#ingreso, #caja, #deduccion, #valesPrepago').on('change', calcularTotal);
                            }
                        });

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

document.getElementById("btnGenerarExcel").addEventListener("click", function () {
    generarReporteExcelUtilidades();
});

function generarReportePDF() {

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
                text: `La tabla "${tabla.nombre}" esta vacia.`,
                confirmButtonText: 'Entendido'
            });
            return;
        }
    }

    // Obtener datos de tablas
    const datosVentas = $('#tblVentas_Realizadas').DataTable().rows().data().toArray();
    const datosCajaChica = $('#tblCajaChica').DataTable().rows().data().toArray();
    const datosDeducciones = $('#tblDeducciones').DataTable().rows().data().toArray();
    const datosEnCaja = $('#tblEn_Caja').DataTable().rows().data().toArray();
    const datosPrepagos = $('#tblPrepago').DataTable().rows().data().toArray();

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
        tieneCorteId(datosEnCaja) ||
        tieneCorteId(datosPrepagos)
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

    // Construir el contenido HTML para el PDF
    const fecha = $("#fechaFiltro").val();
    const userName = $("#userName").val();
    const now = new Date();
    const fechaGeneracion = now.toLocaleDateString('es-MX') + ', ' + now.toLocaleTimeString('es-MX');

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte de Utilidades Diarias</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 20px; 
                    font-size: 14px; 
                }
                h1 { 
                    text-align: center; 
                    margin-bottom: 20px; 
                    font-size: 24px; 
                    color: #2c3e50;
                }
                .header-info { 
                    margin-bottom: 30px; 
                    font-size: 16px; 
                    border-bottom: 2px solid #ddd; 
                    padding-bottom: 15px;
                }
                .leyenda-existente { 
                    margin: 30px 0; 
                    padding: 15px; 
                    border: 2px dashed red; 
                    color: red; 
                    font-weight: bold; 
                    font-size: 16px; 
                }
                .tabla-contenedor { 
                    margin-bottom: 40px; 
                }
                .tabla-titulo { 
                    margin: 20px 0 10px 0; 
                    font-size: 18px; 
                    border-bottom: 2px solid #ddd; 
                    padding-bottom: 5px; 
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin-bottom: 20px;
                    font-size: 12px;
                }
                th, td { 
                    padding: 8px; 
                    border: 1px solid #ddd; 
                    text-align: left;
                }
                th { 
                    background-color: #34495e; 
                    color: white; 
                    font-weight: bold; 
                    text-align: center;
                }
                tr:nth-child(even) { 
                    background-color: #f9f9f9; 
                }
                .resumen-utilidades { 
                    margin-top: 40px; 
                    padding: 20px; 
                    border: 2px solid #ddd; 
                    border-radius: 8px; 
                    background-color: #f9f9f9; 
                    font-size: 16px; 
                }
                .resumen-titulo { 
                    margin-top: 0; 
                    border-bottom: 2px solid #ddd; 
                    padding-bottom: 8px; 
                    font-size: 20px; 
                }
            </style>
        </head>
        <body>
            <h1>Reporte de Utilidades Diarias</h1>
            <div class="header-info">
                <p><strong>Fecha de Reporte:</strong> ${fecha}</p>
                <p><strong>Usuario:</strong> ${userName}</p>
                <p><strong>Fecha de Generacion:</strong> ${fechaGeneracion}</p>
            </div>
    `;

    // Si ya existe un Corte_Id, agregar leyenda
    if (existeCorteId) {
        htmlContent += `<div class="leyenda-existente">Este reporte ya ha sido generado anteriormente.</div>`;
    }

    // Generar HTML para cada tabla
    const tablasAExportar = [
        { id: 'tblVentas_Realizadas', title: 'Ventas Realizadas' },
        { id: 'tblVentas_Aprobadas', title: 'Resumen de Ventas Aprobadas' },
        { id: 'tblEn_Caja', title: 'Dinero en Caja' },
        { id: 'tblDeducciones', title: 'Deducciones' },
        { id: 'tblPrepago', title: 'Prepagos Realizados' },
        { id: 'tblCajaChica', title: 'Movimientos de Caja Chica' }
    ];

    tablasAExportar.forEach(tabla => {
        const tableElement = document.getElementById(tabla.id);
        if (tableElement) {
            // Verificar si la tabla tiene datos (excepto para Deducciones)
            const dataTable = $(`#${tabla.id}`).DataTable();
            if (tabla.id !== 'tblDeducciones' && dataTable.data().count() === 0 &&
                tabla.id !== 'tblPrepago' && dataTable.data().count() === 0) {
                return; // Saltar esta tabla
            }

            htmlContent += `
                <div class="tabla-contenedor">
                    <h2 class="tabla-titulo">${tabla.title}</h2>
                    ${tableElement.outerHTML}
                </div>
            `;
        }
    });

    // Agregar resumen de utilidades
    htmlContent += `
        <div class="resumen-utilidades">
            <h2 class="resumen-titulo">Resumen de Utilidades</h2>
            <p style="margin: 10px 0;"><strong>Ingresos:</strong> ${document.getElementById('ingreso').value}</p>
            <p style="margin: 10px 0;"><strong>Caja:</strong> ${document.getElementById('caja').value}</p>
            <p style="margin: 10px 0;"><strong>Deducciones:</strong> ${document.getElementById('deduccion').value}</p>
            <p style="margin: 10px 0;"><strong>Prepagos:</strong> ${document.getElementById('valesPrepago').value}</p>
            <p style="margin: 10px 0; font-weight: bold; font-size: 18px;"><strong>Total Utilidad:</strong> ${document.getElementById('total').value}</p>
        </div>
    `;

    htmlContent += `</body></html>`;

    // Enviar el HTML al servidor para generar el PDF
    enviarHTMLParaPDF(htmlContent, fecha, userName, existeCorteId);

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
}

function enviarHTMLParaPDF(htmlContent, fecha, userName, existeCorteId) {
    // Crear formulario para enviar los datos al servidor
    var form = $('<form>', {
        method: 'POST',
        action: '/Pdf/GenerarReporteUtilidades'
    });

    // Agregar el HTML como campo oculto
    $('<input>').attr({
        type: 'hidden',
        name: 'htmlContent',
        value: htmlContent
    }).appendTo(form);

    // Agregar información adicional
    $('<input>').attr({
        type: 'hidden',
        name: 'fecha',
        value: fecha
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'userName',
        value: userName
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'existeCorteId',
        value: existeCorteId
    }).appendTo(form);

    // Agregar el formulario al cuerpo y enviarlo
    form.appendTo('body').submit().remove();
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

function generarReporteExcelUtilidades() {
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
                text: `La tabla "${tabla.nombre}" esta vacia.`,
                confirmButtonText: 'Entendido'
            });
            return;
        }
    }

    // Obtener datos de tablas
    const datosVentas = $('#tblVentas_Realizadas').DataTable().rows().data().toArray();
    const datosCajaChica = $('#tblCajaChica').DataTable().rows().data().toArray();
    const datosDeducciones = $('#tblDeducciones').DataTable().rows().data().toArray();
    const datosEnCaja = $('#tblEn_Caja').DataTable().rows().data().toArray();
    const datosPrepagos = $('#tblPrepago').DataTable().rows().data().toArray();

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
        tieneCorteId(datosEnCaja) ||
        tieneCorteId(datosPrepagos)
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

    // Construir el contenido HTML para el Excel
    const fecha = $("#fechaFiltro").val();
    const userName = $("#userName").val();
    const now = new Date();
    const fechaGeneracion = now.toLocaleDateString('es-MX') + ', ' + now.toLocaleTimeString('es-MX');

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Reporte de Utilidades Diarias</title>
        </head>
        <body>
            <h1>Reporte de Utilidades Diarias</h1>
            <div class="header-info">
                <p><strong>Fecha de Reporte:</strong> ${fecha}</p>
                <p><strong>Usuario:</strong> ${userName}</p>
                <p><strong>Fecha de Generacion:</strong> ${fechaGeneracion}</p>
            </div>
    `;

    // Si ya existe un Corte_Id, agregar leyenda
    if (existeCorteId) {
        htmlContent += `<div class="leyenda-existente">Este reporte ya ha sido generado anteriormente.</div>`;
    }

    // Generar HTML para cada tabla
    const tablasAExportar = [
        { id: 'tblVentas_Realizadas', title: 'Ventas Realizadas' },
        { id: 'tblVentas_Aprobadas', title: 'Resumen de Ventas Aprobadas' },
        { id: 'tblEn_Caja', title: 'Dinero en Caja' },
        { id: 'tblDeducciones', title: 'Deducciones' },
        { id: 'tblPrepago', title: 'Prepagos Realizados' },
        { id: 'tblCajaChica', title: 'Movimientos de Caja Chica' }
    ];

    tablasAExportar.forEach(tabla => {
        const tableElement = document.getElementById(tabla.id);
        if (tableElement) {
            // Verificar si la tabla tiene datos (excepto para Deducciones)
            const dataTable = $(`#${tabla.id}`).DataTable();
            if (tabla.id !== 'tblDeducciones' && dataTable.data().count() === 0 &&
                tabla.id !== 'tblPrepago' && dataTable.data().count() === 0) {
                return; // Saltar esta tabla
            }

            htmlContent += `
                <div class="tabla-contenedor">
                    <h2 class="tabla-titulo">${tabla.title}</h2>
                    ${tableElement.outerHTML}
                </div>
            `;
        }
    });

    // Agregar resumen de utilidades
    htmlContent += `
        <div class="resumen-utilidades">
            <h2 class="resumen-titulo">Resumen de Utilidades</h2>
            <p style="margin: 10px 0;"><strong>Ingresos:</strong> ${document.getElementById('ingreso').value}</p>
            <p style="margin: 10px 0;"><strong>Caja:</strong> ${document.getElementById('caja').value}</p>
            <p style="margin: 10px 0;"><strong>Deducciones:</strong> ${document.getElementById('deduccion').value}</p>
            <p style="margin: 10px 0;"><strong>Prepagos:</strong> ${document.getElementById('valesPrepago').value}</p>
            <p style="margin: 10px 0; font-weight: bold; font-size: 18px;"><strong>Total Utilidad:</strong> ${document.getElementById('total').value}</p>
        </div>
    `;

    htmlContent += `</body></html>`;

    // Swalfire de generando reporte
    Swal.fire({
        title: "Generando Excel...",
        text: "Por favor espere mientras se genera el archivo Excel",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();

            // Cerrar automáticamente después de 2 segundos
            setTimeout(() => {
                Swal.close();

                // Mostrar mensaje de éxito después de cerrar
                Swal.fire({
                    icon: 'success',
                    title: 'Excel generado!',
                    text: 'El archivo Excel se ha creado correctamente',
                    timer: 3000,
                    showConfirmButton: false
                });
            }, 2000);
        }
    });

    // Enviar el HTML al servidor para generar el Excel
    enviarHTMLParaExcel(htmlContent, fecha, userName, existeCorteId);
}

function enviarHTMLParaExcel(htmlContent, fecha, userName, existeCorteId) {
    // Crear formulario para enviar los datos al servidor
    var form = $('<form>', {
        method: 'POST',
        action: '/Excel/GenerarReporteUtilidades'
    });

    // Agregar el HTML como campo oculto
    $('<input>').attr({
        type: 'hidden',
        name: 'htmlContent',
        value: htmlContent
    }).appendTo(form);

    // Agregar información adicional
    $('<input>').attr({
        type: 'hidden',
        name: 'fecha',
        value: fecha
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'userName',
        value: userName
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'existeCorteId',
        value: existeCorteId
    }).appendTo(form);

    // Agregar el formulario al cuerpo y enviarlo
    form.appendTo('body').submit().remove();
}