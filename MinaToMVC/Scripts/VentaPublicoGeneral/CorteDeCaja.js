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

            // Calcular el total general y mostrarlo en el input
            const totalGeneral = resumenArray.reduce((acc, item) => acc + item.totalPago, 0);

            document.getElementById('ingreso').value = totalGeneral.toLocaleString('es-MX', {
                style: 'currency',
                currency: 'MXN'
            });

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

            // Objeto para almacenar los resultados
            const resultados = {
                totalGeneral: totalGeneral,
                totalMonto: 0
            };

            PostMVC('/VentaPublicoGeneral/SearchPV_DineroCajaByDateAndUser', { userName, fecha }, function (r, textStatus, jqXHR) {
                if ($.fn.DataTable.isDataTable('#tblEn_Caja')) {
                    $('#tblEn_Caja').DataTable().clear().destroy();
                }
                const cajaData = r.Response;

                // Tabla de Dinero en Caja
                $('#tblEn_Caja').DataTable({
                    data: cajaData,
                    columns: [
                        { data: "id", visible: false, title: "id" },
                        { data: "b1000", title: "Billetes de 1000", className: 'titulo-pequeno' },
                        { data: "b500", title: "Billetes de 500", className: 'titulo-pequeno' },
                        { data: "b200", title: "Billetes de 200", className: 'titulo-pequeno' },
                        { data: "b100", title: "Billetes de 100", className: 'titulo-pequeno' },
                        { data: "b50", title: "Billetes de 50", className: 'titulo-pequeno' },
                        { data: "b20", title: "Billetes de 20", className: 'titulo-pequeno' },
                        { data: "m10", title: "Monedas de 10", className: 'titulo-pequeno' },
                        { data: "m5", title: "Monedas de 5", className: 'titulo-pequeno' },
                        { data: "m2", title: "Monedas de 2", className: 'titulo-pequeno' },
                        { data: "m1", title: "Monedas de 1", className: 'titulo-pequeno' },
                        { data: "m050", title: "Monedas de 0.50c", className: 'titulo-pequeno' },
                        {
                            data: "ventaVale",
                            title: "Venta por Vales",
                            className: 'titulo-pequeno',
                            render: function (data) {
                                return data ? parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : "$0.00";
                            }
                        },
                        {
                            data: "ventaTransferencia",
                            title: "Venta por Transferencia",
                            className: 'titulo-pequeno',
                            render: function (data) {
                                return data ? parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : "$0.00";
                            }
                        },
                        {
                            data: "ventaEfectivo",
                            title: "Venta por Efectivo",
                            className: 'titulo-pequeno',
                            render: function (data) {
                                return data ? parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : "$0.00";
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

                PostMVC('/VentaPublicoGeneral/SearchPV_CajaChicaByDateAndUserAndCorteId', { userName, fecha }, function (r, textStatus, jqXHR) {
                    if ($.fn.DataTable.isDataTable('#tblCajaChica')) {
                        $('#tblCajaChica').DataTable().clear().destroy();
                    }

                    const cajaChicaData = r.Response;

                    // Calcular suma de montos
                    resultados.totalMonto = 0;
                    cajaChicaData.forEach(item => {
                        resultados.totalMonto += parseFloat(item.monto);
                    });

                    // Asignar al input con id="caja"
                    $('#caja').val(resultados.totalMonto.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }));

                    // Tabla de Dinero en Caja
                    $('#tblCajaChica').DataTable({
                        data: cajaChicaData,
                        columns: [
                            { data: "id", "visible": false, title: "id" },
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
                                    return `$${parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }).replace('$', '')}`;
                                }
                            },
                            { data: "comentarios", title: "Comentarios" },
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

                    // Calcular la resta y formatear como moneda MXN
                    const restaTotal = resultados.totalGeneral - resultados.totalMonto;
                    const formatoMXN = new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    }).format(restaTotal);

                    // Asignar el valor formateado al input
                    document.getElementById('total').value = formatoMXN;

                    // También puedes mantener el console.log si lo necesitas
                    //console.log("Resultados consolidados:", {
                    //    totalGeneral: resultados.totalGeneral,
                    //    totalMonto: resultados.totalMonto,
                    //    restaTotal: restaTotal
                    //});
                });
            });

        } else {
            alert("Error al obtener registros. Ver consola para más detalles.");
        }
    });
}

function limpiarCalculos() {
    $('#ingreso').val('');
    $('#caja').val();
    $('#total').val();
}

// Evento del botón Generar PDF
document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});

function generarReportePDF() {
    // Verificar que las librerías están cargadas
    if (typeof window.jspdf === 'undefined') {
        alert('Error: La biblioteca jsPDF no está cargada correctamente.');
        return;
    }

    // Obtener jsPDF del objeto global
    const { jsPDF } = window.jspdf;

    // Verificar que hay datos para generar el reporte
    if ($('#tblVentas_Realizadas').DataTable().data().count() === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay datos para generar el reporte. Realice una consulta primero.',
            confirmButtonText: 'Entendido'
        });
        return;
    } else if ($('#tblCajaChica').DataTable().data().count() === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'Ya se realizo el corte de esta fecha.',
            confirmButtonText: 'Entendido'
        });
        return;
    } else if ($('#tblVentas_Aprobadas').DataTable().data().count() === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No existen ventas aprobadas para generar el reporte.',
            confirmButtonText: 'Entendido'
        });
        return;
    } else if ($('#tblEn_Caja').DataTable().data().count() === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'Sin datos en Dinero en Caja.',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Crear un div temporal para el contenido del PDF con estilos mejorados
    const pdfContent = document.createElement('div');
    pdfContent.style.padding = '20px';
    pdfContent.style.width = '1000px'; // Ancho mayor para acomodar tablas
    pdfContent.style.fontSize = '14px'; // Tamaño de fuente base más grande

    // Obtener la fecha del filtro
    const fecha = $("#fechaFiltro").val();
    const userName = $("#userName").val();

    // Obtener fecha y hora actual formateada correctamente
    const now = new Date();
    const fechaGeneracion = now.toLocaleDateString('es-MX') + ', ' + now.toLocaleTimeString('es-MX');

    // Agregar título y fecha con estilos mejorados
    pdfContent.innerHTML = `
        <h1 style="text-align: center; margin-bottom: 20px; font-size: 24px;">Reporte de Utilidades Diarias</h1>
        <div style="margin-bottom: 30px; font-size: 16px;">
            <p><strong>Fecha de Reporte:</strong> ${fecha}</p>
            <p><strong>Usuario:</strong> ${userName}</p>
            <p><strong>Fecha de Generacion:</strong> ${fechaGeneracion}</p>
        </div>
    `;

    // Clonar las tablas y agregarlas al contenido con estilos mejorados
    const tablas = [
        { id: 'tblVentas_Realizadas', title: 'Ventas Realizadas' },
        { id: 'tblVentas_Aprobadas', title: 'Resumen de Ventas Aprobadas' },
        { id: 'tblEn_Caja', title: 'Dinero en Caja' },
        { id: 'tblCajaChica', title: 'Movimientos de Caja Chica' }
    ];

    tablas.forEach(tabla => {
        const tableElement = document.getElementById(tabla.id);
        if (tableElement) {
            // Clonar la tabla y ajustar estilos
            const tableClone = tableElement.cloneNode(true);

            // Aplicar estilos para mejorar la legibilidad
            tableClone.style.width = '100%';
            tableClone.style.marginBottom = '40px';
            tableClone.style.fontSize = '12px';

            // Ajustar estilos de las celdas
            const cells = tableClone.querySelectorAll('td, th');
            cells.forEach(cell => {
                cell.style.padding = '8px';
                cell.style.border = '1px solid #ddd';
            });

            // Ajustar estilos del encabezado
            const headers = tableClone.querySelectorAll('th');
            headers.forEach(header => {
                header.style.backgroundColor = '#f2f2f2';
                header.style.fontWeight = 'bold';
            });

            // Agregar título de sección
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

    // Agregar resumen de utilidades con estilos mejorados
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
        <p style="margin: 10px 0; font-weight: bold; font-size: 18px;"><strong>Total Utilidad:</strong> ${document.getElementById('total').value}</p>
    `;

    pdfContent.appendChild(utilidadesDiv);

    // Agregar el contenido temporal al body
    document.body.appendChild(pdfContent);

    // Opciones mejoradas para html2canvas
    const options = {
        scale: 3, // Aumentar la escala para mejor calidad
        logging: false,
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: pdfContent.scrollWidth,
        windowHeight: pdfContent.scrollHeight
    };

    // Configurar y generar el PDF con ajustes de tamaño
    html2canvas(pdfContent, options).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Calcular dimensiones para ajustar correctamente al PDF
        const imgWidth = 190; // Ancho máximo en mm (dejando márgenes)
        const pageHeight = 277; // Alto de página en mm (A4 menos márgenes)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 10; // Margen superior
        let pageNumber = 1;

        // Agregar primera página
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Agregar páginas adicionales si es necesario
        while (heightLeft >= 0) {
            pdf.addPage();
            position = heightLeft - imgHeight;
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            pageNumber++;
        }

        // Guardar el PDF con nombre descriptivo
        const fileName = `Reporte_Utilidades_${fecha.replace(/\//g, '-')}_${userName}.pdf`;
        pdf.save(fileName);

        // Eliminar el contenido temporal
        document.body.removeChild(pdfContent);
    });

    var usuarioId = $("#userId").val();
    var fechaFiltro = $("#fechaFiltro").val();
    var usuarioName = $("#userName").val();
    var estatus = 1;
    var createdBy = $("#userName").val();
    var createdDt = new Date().toISOString();
    var updatedBy = $("#userName").val();
    var updatedDt = new Date().toISOString();

    InfoReporte(usuarioId ,usuarioName, fechaFiltro, estatus, createdBy, createdDt, updatedBy, updatedDt);
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