$(document).ready(function () {
    $("#tableDeducciones").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        order: [[0, 'desc']],
        searching: true,
        columns: [
            { data: "id", visible: true, title: "Id" },
            { data: "nombreGasto", title: "Tipo Gasto" },
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
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return `
                    <input type="button" value="Cancelar" class="btn btn-custom-cancel" onclick="EliminarDeduccion(${data})" />
                     <input type="button" value="Imprimir" class="btn btn-custom-cancel" style="background-color: yellow; border:
                     none; color:black;  padding: 7px 10px; border-radius: 5px; cursor: pointer;" onclick="ImprimirDeduccion(${data})" />
                     <input type="button" value="Editar" class="btn btn-custom-clean" style="width: 80px;" onclick="AbrirModalDeduccion(${data})" />
                `;
                }
            }
        ],
        language: {
            decimal: ",",
            thousands: ".",
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ entradas",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningun dato disponible en esta tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de un total de _MAX_ entradas)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            aria: {
                sortAscending: ": activar para ordenar ascendente",
                sortDescending: ": activar para ordenar descendente"
            }
        }
    });
    $("#tableDeduccionesTipo").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        order: [[3, 'desc']], // Ordenar por monto (columna 3) descendente por defecto
        searching: true,
        columns: [
            {
                data: "id",
                visible: true,
                title: "Id",
                width: "50px"
            },
            {
                data: "nombreGasto",
                title: "Tipo Gasto",
                width: "150px",
            },
            {
                data: "cantidad",
                title: "Cantidad",
                width: "80px",
                render: function (data) {
                    return `<span>${data}</span>`;
                }
            },
            {
                data: "monto",
                title: "Monto Total",
                width: "120px",
                className: "font-weight-bold",
                render: function (data) {
                    return new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    }).format(data);
                }
            },
            {
                data: "fecha",
                title: "Ultima Fecha",
                width: "100px",
                render: function (data) {
                    if (!data) return '-';
                    return new Date(data).toLocaleDateString('es-MX');
                }
            }
        ],
        footerCallback: function (row, data, start, end, display) {
            var api = this.api();

            // Calcular el total de montos (columna 3)
            var totalMonto = api
                .column(3, { page: 'current' })
                .data()
                .reduce(function (a, b) {
                    // Remover formato de moneda y convertir a número
                    var cleanA = typeof a === 'string' ?
                        parseFloat(a.replace(/[^\d.-]/g, '')) :
                        parseFloat(a) || 0;
                    var cleanB = typeof b === 'string' ?
                        parseFloat(b.replace(/[^\d.-]/g, '')) :
                        parseFloat(b) || 0;
                    return cleanA + cleanB;
                }, 0);

            // Calcular el total de cantidad (columna 2)
            var totalCantidad = api
                .column(2, { page: 'current' })
                .data()
                .reduce(function (a, b) {
                    // Extraer solo el número del badge
                    var numA = typeof a === 'string' ?
                        parseInt(a.replace(/[^\d]/g, '')) :
                        parseInt(a) || 0;
                    var numB = typeof b === 'string' ?
                        parseInt(b.replace(/[^\d]/g, '')) :
                        parseInt(b) || 0;
                    return numA + numB;
                }, 0);

            // Actualizar el footer para el total de montos
            $(api.column(3).footer()).html(
                '<strong class="text-success">' +
                new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN'
                }).format(totalMonto) + '</strong>'
            );

            // Actualizar el footer para el total de cantidad
            $(api.column(2).footer()).html(
                '<strong class="text-primary">' + totalCantidad + '</strong>'
            );
        },
        language: {
            decimal: ",",
            thousands: ".",
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ entradas",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningun dato disponible en esta tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de un total de _MAX_ entradas)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            aria: {
                sortAscending: ": activar para ordenar ascendente",
                sortDescending: ": activar para ordenar descendente"
            }
        },
        initComplete: function () {
            // Inicializar footer
            var api = this.api();
            $(api.column(2).footer()).html('<strong>Total:</strong>');
            $(api.column(3).footer()).html('<strong>Total:</strong>');
        }
    });

    GetAllDeducciones();
    GetAllDeduccionesTipo();
});

document.getElementById("btnDeducciones").addEventListener("click", function () {
    var usuarioIdDeducciones = $("#userIdDeducciones").val();
    var fechaDeducciones = $("#fechaDeducciones").val();
    var userNameDeducciones = $("#userNameDeducciones").val();

    if (!usuarioIdDeducciones || !fechaDeducciones || !userNameDeducciones) {
        alert("Por favor, seleccione un usuario y una fecha válida.");
        return;
    }
    SearchDeduccionesFecha(fechaDeducciones);
});

// Escucha del botón
document.getElementById("btnDeduccionesTipo").addEventListener("click", function () {
    var userIdDeduccionesTipo = $("#userIdDeduccionesTipo").val();
    var fechaDeduccionesTipo = $("#fechaDeduccionesTipo").val();
    var userNameDeduccionesTipo = $("#userNameDeduccionesTipo").val();

    if (!userIdDeduccionesTipo || !fechaDeduccionesTipo || !userNameDeduccionesTipo) {
        alert("Por favor, seleccione un usuario y una fecha válida.");
        return;
    }

    SearchDeduccionesTipoFecha(fechaDeduccionesTipo);
});
// Función principal
function SearchDeduccionesFecha(fechaDeducciones) {
    PostMVC('/VentaPublicoGeneral/SearchDeduccionesByDate', { fechaDeducciones }, function (r) {
        if (r.IsSuccess && Array.isArray(r.Response)) {
            const data = r.Response;
            const table = $("#tableDeducciones");

            // Destruir tabla existente
            if ($.fn.DataTable.isDataTable(table)) {
                table.DataTable().clear().destroy();
                table.empty();
            }

            // Asegurar estructura básica
            if (table.find('thead').length === 0) {
                table.append('<thead><tr></tr></thead>');
            }
            if (table.find('tbody').length === 0) {
                table.append('<tbody></tbody>');
            }

            // Crear DataTable
            table.DataTable({
                data: data,
                processing: true,
                paging: true,
                searching: true,
                columns: [
                    { data: "id", title: "Id" },
                    { data: "nombreGasto", title: "Tipo Gasto" },
                    { data: "descripcion", title: "Descripcion de la Deduccion" },
                    { data: "usuarioName", title: "Encargado" },
                    {
                        data: "monto",
                        title: "Monto",
                        render: function (data) {
                            return new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            }).format(data);
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
                        data: "id",
                        title: "Acciones",
                        render: function (data) {
                            return `
                                <input type="button" value="Cancelar" class="btn btn-custom-cancel" onclick="EliminarDeduccion(${data})" />
                                <input type="button" value="Imprimir" class="btn btn-custom-cancel" style="background-color: yellow; border:
                                none; color:black;  padding: 7px 10px; border-radius: 5px; cursor: pointer;" onclick="ImprimirDeduccion(${data})" />
                                    `;
                        }
                    }
                ],
                language: {
                    decimal: ",",
                    thousands: ".",
                    processing: "Procesando...",
                    lengthMenu: "Mostrar _MENU_ entradas",
                    zeroRecords: "No se encontraron resultados",
                    emptyTable: "Ningun dato disponible en esta tabla",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    infoEmpty: "Mostrando 0 a 0 de 0 entradas",
                    infoFiltered: "(filtrado de un total de _MAX_ entradas)",
                    search: "Buscar:",
                    loadingRecords: "Cargando...",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente",
                        previous: "Anterior"
                    },
                    aria: {
                        sortAscending: ": activar para ordenar ascendente",
                        sortDescending: ": activar para ordenar descendente"
                    }
                }
            });

        } else {
            console.warn("No se recibieron datos válidos o la respuesta no fue exitosa:", r);
            $('#tableDeducciones').html('<div class="alert alert-warning">No se encontraron registros para los criterios seleccionados</div>');
        }
    });
}
function SearchDeduccionesTipoFecha(fechaDeduccionesTipo) {
    PostMVC('/VentaPublicoGeneral/SearchDeduccionesByDate',
        { fechaDeducciones: fechaDeduccionesTipo },
        function (r) {

            if (!r.IsSuccess || !Array.isArray(r.Response)) {
                // Si no hay datos, limpiar la tabla
                if ($.fn.DataTable.isDataTable("#tableDeduccionesTipo")) {
                    $("#tableDeduccionesTipo").DataTable().clear().draw();
                } else {
                    $('#tableDeduccionesTipo').html(
                        '<div class="alert alert-warning">No se encontraron registros</div>'
                    );
                }
                return;
            }

            const datosAgrupados = procesarDatosPorTipoGasto(r.Response);
            const table = $("#tableDeduccionesTipo");

            console.log("Datos agrupados para tabla:", datosAgrupados);

            // Verificar si la tabla ya está inicializada
            if ($.fn.DataTable.isDataTable(table)) {
                // Si ya existe, solo actualizar los datos
                var dataTable = table.DataTable();
                dataTable.clear();
                dataTable.rows.add(datosAgrupados);
                dataTable.draw();
            } else {
                // Si no existe, crear la tabla
                table.DataTable({
                    data: datosAgrupados,
                    processing: true,
                    paging: true,
                    searching: true,
                    order: [[3, 'desc']],
                    columns: [
                        {
                            data: "id",
                            title: "Id",
                            width: "50px",
                            visible: true
                        },
                        {
                            data: "nombreGasto",
                            title: "Tipo Gasto",
                            width: "150px"
                        },
                        {
                            data: "cantidad",
                            title: "Cantidad",
                            width: "80px",
                            render: function (data) {
                                return `<span>${data}</span>`;
                            }
                        },
                        {
                            data: "monto",
                            title: "Monto Total",
                            width: "120px",
                            className: "font-weight-bold",
                            render: function (data) {
                                return new Intl.NumberFormat('es-MX', {
                                    style: 'currency',
                                    currency: 'MXN'
                                }).format(data);
                            }
                        },
                        {
                            data: "fecha",
                            title: "Última Fecha",
                            width: "100px",
                            render: function (data) {
                                if (!data) return '-';
                                return new Date(data).toLocaleDateString('es-MX');
                            }
                        }
                    ],
                    footerCallback: function (row, data, start, end, display) {
                        var api = this.api();

                        // Calcular el total de montos (columna 3)
                        var totalMonto = api
                            .column(3, { page: 'current' })
                            .data()
                            .reduce(function (a, b) {
                                return parseFloat(a) + parseFloat(b);
                            }, 0);

                        // Calcular el total de cantidad (columna 2)
                        var totalCantidad = api
                            .column(2, { page: 'current' })
                            .data()
                            .reduce(function (a, b) {
                                return parseFloat(a) + parseFloat(b);
                            }, 0);

                        // Actualizar el footer
                        $(api.column(2).footer()).html(
                            '<strong class="text-primary">' + totalCantidad + '</strong>'
                        );

                        $(api.column(3).footer()).html(
                            '<strong class="text-success">' +
                            new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            }).format(totalMonto) + '</strong>'
                        );
                    },
                    language: {
                        decimal: ",",
                        thousands: ".",
                        processing: "Procesando...",
                        lengthMenu: "Mostrar _MENU_ entradas",
                        zeroRecords: "No se encontraron resultados",
                        emptyTable: "Ningun dato disponible en esta tabla",
                        info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                        infoEmpty: "Mostrando 0 a 0 de 0 entradas",
                        infoFiltered: "(filtrado de un total de _MAX_ entradas)",
                        search: "Buscar:",
                        loadingRecords: "Cargando...",
                        paginate: {
                            first: "Primero",
                            last: "Último",
                            next: "Siguiente",
                            previous: "Anterior"
                        },
                        aria: {
                            sortAscending: ": activar para ordenar ascendente",
                            sortDescending: ": activar para ordenar descendente"
                        }
                    },
                    initComplete: function () {
                        // Inicializar footer si está vacío
                        var api = this.api();
                        if (!$(api.column(2).footer()).html()) {
                            $(api.column(2).footer()).html('<strong>Total:</strong>');
                        }
                        if (!$(api.column(3).footer()).html()) {
                            $(api.column(3).footer()).html('<strong>Total:</strong>');
                        }
                    }
                });
            }
        });
}

function GetAllDeducciones() {
    GetMVC("/VentaPublicoGeneral/GetAllDeducciones", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableDeducciones", r.Response);
        } else {
            alert("Error al cargar los gastos: " + r.ErrorMessage);
        }
    });
}
function GetAllDeduccionesTipo() {
    GetMVC("/VentaPublicoGeneral/GetAllDeducciones", function (r) {
        if (r.IsSuccess) {
            // Procesar los datos para agrupar por tipo de gasto
            const datosAgrupados = procesarDatosPorTipoGasto(r.Response);
            MapingPropertiesDataTable("tableDeduccionesTipo", datosAgrupados);
        } else {
            alert("Error al cargar los gastos: " + r.ErrorMessage);
        }
    });
}

function procesarDatosPorTipoGasto(datos) {
    // Crear un objeto para agrupar por nombreGasto
    const agrupados = {};

    datos.forEach(item => {
        const tipoGasto = item.nombreGasto || 'Sin tipo';

        if (!agrupados[tipoGasto]) {
            // Primera vez que encontramos este tipo de gasto
            agrupados[tipoGasto] = {
                id: Object.keys(agrupados).length + 1, // ID secuencial
                nombreGasto: tipoGasto,
                cantidad: 0,
                monto: 0,
                fecha: item.fecha // Guardamos la fecha para la última
            };
        }

        // Acumular el monto
        agrupados[tipoGasto].monto += parseFloat(item.monto || 0);
        // Incrementar contador de cantidad
        agrupados[tipoGasto].cantidad += 1;

        // Actualizar la fecha si es más reciente
        const nuevaFecha = new Date(item.fecha);
        const fechaActual = new Date(agrupados[tipoGasto].fecha || 0);
        if (nuevaFecha > fechaActual) {
            agrupados[tipoGasto].fecha = item.fecha;
        }
    });

    // Convertir el objeto a array y ordenar por monto descendente
    return Object.values(agrupados)
        .sort((a, b) => b.monto - a.monto)
        .map((item, index) => ({
            ...item,
            id: index + 1 // Reasignar IDs en orden
        }));
}
function AbrirModalDeduccion(id = 0) {
    const titulo = id !== 0 ? "Editar Deducción" : "Nueva Deducción";
    $("#titleGenerciModal").text(titulo);
    $("#boddyGeericModal").html('<p class="text-center">Cargando...</p>');

    // Carga la vista parcial desde el backend
    $("#boddyGeericModal").load(`/VentaPublicoGeneral/PartialDeducciones?id=${id}`, function () {
        $("#genericModal").modal("show");
    });
}
function EliminarDeduccion(id) {
    PostMVC('/VentaPublicoGeneral/DeleteDeducciones', { id: id }, function (r, textStatus, jqXHR) {
        location.reload();
    });
}
// Función para capitalizar el tipo de gasto
function formatearTipoGasto(nombreGasto) {
    if (!nombreGasto || typeof nombreGasto !== 'string' || nombreGasto.trim() === '') {
        return "Tipo de gasto no especificado";
    }

    return nombreGasto
        .toLowerCase()
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
}

async function ImprimirDeduccion(id) {
    const table = $("#tableDeducciones").DataTable();
    const data = table.rows().data().toArray().find(d => d.id === id);

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

    // Formatear datos
    const empresa = "PLANTA PROCESADORA DE MATERIALES PETREOS SAN MIGUEL, S.A. DE C.V.";
    const ubicacion = "Calimaya, Estado de Mexico";
    const folio = String(data.id).padStart(6, '0');
    const monto = Number(data.monto).toFixed(2);
    const tipoGasto = formatearTipoGasto(data.nombreGasto);
    const concepto = data.descripcion || "Sin concepto";
    const fecha = new Date(data.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-MX', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    // Crear contenido HTML manteniendo la estructura exacta de tu diseño
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Recibo de Deducción ${folio}</title>
            <style>
                @page {
                    margin: 0;
                    size: letter portrait;
                }
                body {
                    font-family: 'Times New Roman', Times, serif;
                    margin: 0;
                    padding: 20mm;
                    font-size: 12pt;
                    position: relative;
                    width: 216mm;
                    height: 279mm;
                }
                .border-rectangle {
                    position: absolute;
                    top: 20mm;
                    left: 17.5mm;
                    width: 235mm;
                    height: 130mm;
                    border: 0.35mm solid #000000;
                    box-sizing: border-box;
                }
                .header {
                    text-align: center;
                    margin-top: 10mm;
                    margin-bottom: 15mm;
                }
                .header h1 {
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 25pt;
                    font-weight: bold;
                    margin: 0;
                }
                .folio {
                    position: absolute;
                    top: 30mm;
                    left: 20mm;
                    font-size: 16pt;
                    font-family: 'Times New Roman', Times, serif;
                    font-style: normal;
                }
                .monto {
                    position: absolute;
                    top: 30mm;
                    right: 20mm;
                    font-size: 12pt;
                    font-family: 'Times New Roman', Times, serif;
                    font-style: normal;
                    text-align: right;
                }
                .content-line {
                    position: absolute;
                    left: 20mm;
                    font-family: 'Times New Roman', Times, serif;
                }
                .label-bold {
                    font-weight: bold;
                }
                .firma-line {
                    position: absolute;
                    height: 0.5mm;
                    background-color: #000000;
                }
                .firma-text {
                    position: absolute;
                    font-family: 'Times New Roman', Times, serif;
                    font-style: italic;
                    font-size: 10pt;
                    text-align: center;
                }
                .fecha-text {
                    position: absolute;
                    font-family: 'Times New Roman', Times, serif;
                    font-style: italic;
                    font-size: 12pt;
                }
            </style>
        </head>
        <body>
            <!-- Rectángulo de borde -->
            <div class="border-rectangle"></div>

            <!-- Encabezado -->
            <div class="header">
                <h1>RECIBO DE DINERO</h1>
            </div>

            <!-- Folio y Monto -->
            <div class="folio">Recibo No. ${folio}</div>

            <!-- Contenido -->
            <div class="content-line" style="top: 60mm;">
                <span class="label-bold">Recibi de:</span> ${empresa}
            </div>

            <div class="content-line" style="top: 70mm;">
                <span class="label-bold">La cantidad de:</span> $${parseFloat(monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} M.N.
            </div>

            <div class="content-line" style="top: 80mm;">
                <span class="label-bold">Tipo de gasto:</span> ${tipoGasto}
            </div>

            <div class="content-line" style="top: 90mm;">
                <span class="label-bold">Por concepto de:</span> ${concepto}
            </div>

            <!-- Fecha -->
            <div class="fecha-text" style="top: 100mm; left: 20mm;">
                ${ubicacion} a: ${fechaFormateada}
            </div>

            <!-- Líneas de firma -->
            <div class="firma-line" style="top: 125mm; left: 50mm; width: 50mm;"></div>
            <div class="firma-line" style="top: 125mm; left: 170mm; width: 50mm;"></div>

            <!-- Textos de firma -->
            <div class="firma-text" style="top: 130mm; left: 70mm;">Nombre</div>
            <div class="firma-text" style="top: 130mm; left: 180mm;">Firma de quien recibe</div>
        </body>
        </html>
    `;

    // Enviar al servidor para generar PDF
    try {
        const formData = new FormData();
        formData.append('htmlContent', htmlContent);
        formData.append('fileName', `ReciboDeduccion_${folio}.pdf`);

        const response = await fetch('/Pdf/GenerarReciboDeduccion', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ReciboDeduccion_${folio}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } else {
            throw new Error('Error en la generación del PDF');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al generar el recibo',
            confirmButtonText: 'Entendido'
        });
    }
}
// Función auxiliar para formatear tipo de gasto
function formatearTipoGasto(tipo) {
    // Mantén tu lógica actual de formateo
    return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
}

// Evento del botón Generar PDF
document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});

document.getElementById("btnGenerarExcel").addEventListener("click", function () {
    generarReporteExcel();
});

document.getElementById("btnGenerarPDFTipoGasto").addEventListener("click", function () {
    generarReportePDFTipoGasto();
});

document.getElementById("btnGenerarExcelTipoGasto").addEventListener("click", function () {
    generarReporteExcelTipoGasto();
});

function generarReportePDFTipoGasto() {
    try {
        const table = $("#tableDeduccionesTipo");

        // Verificar si la tabla DataTable está inicializada
        if (!$.fn.DataTable.isDataTable(table)) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla no inicializada',
                text: 'La tabla de deducciones no está inicializada o no existe'
            });
            return;
        }

        const dataTable = table.DataTable();

        // Obtener todos los datos de la tabla
        const datosDeduccionesTipo = dataTable.rows().data().toArray();
        const totalRows = datosDeduccionesTipo.length;

        if (totalRows === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla vacía',
                text: 'No hay registros en la tabla para generar el reporte PDF',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const fecha = $("#fechaDeduccionesTipo").val();
        const userName = $("#userNameDeduccionesTipo").val();
        const now = new Date();
        const fechaGeneracion = now.toLocaleDateString('es-MX') + ', ' + now.toLocaleTimeString('es-MX');

        // Calcular totales
        let totalCantidad = 0;
        let totalMonto = 0;

        datosDeduccionesTipo.forEach(item => {
            totalCantidad += item.cantidad || 0;
            totalMonto += item.monto || 0;
        });

        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Deducciones por Tipo</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 20px; 
                        font-size: 12px; 
                    }
                    h1 { 
                        text-align: center; 
                        margin-bottom: 20px; 
                        font-size: 22px; 
                        color: #2c3e50;
                    }
                    .header-info { 
                        margin-bottom: 20px; 
                        font-size: 14px; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 10px;
                    }
                    .header-info p { 
                        margin: 5px 0; 
                    }
                    .tabla-contenedor { 
                        margin-bottom: 30px; 
                    }
                    .tabla-titulo { 
                        margin: 15px 0 8px 0; 
                        font-size: 16px; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 3px; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 15px;
                        font-size: 11px;
                    }
                    th, td { 
                        padding: 6px 8px; 
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
                    .total-fila { 
                        font-weight: bold; 
                        background-color: #f1f1f1 !important;
                    }
                    .total-fila td { 
                        text-align: right; 
                        padding-right: 15px;
                    }
                    .resumen { 
                        margin-top: 20px; 
                        padding: 15px; 
                        border: 2px solid #ddd; 
                        border-radius: 5px; 
                        background-color: #f8f9fa; 
                        font-size: 13px;
                    }
                    .resumen-item { 
                        margin: 5px 0; 
                        display: flex; 
                        justify-content: space-between;
                    }
                    .resumen-valor { 
                        font-weight: bold; 
                        color: #2c3e50;
                    }
                    .logo-container {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .logo {
                        max-width: 150px;
                        height: auto;
                    }
                </style>
            </head>
            <body>
                <div class="logo-container">
                    <!-- Aquí puedes agregar un logo si lo necesitas -->
                    <!-- <img src="ruta/del/logo.png" class="logo" alt="Logo"> -->
                </div>
                <h1>Reporte de Deducciones por Tipo</h1>
                <div class="header-info">
                    <p><strong>Fecha de Reporte:</strong> ${fecha || 'No especificada'}</p>
                    <p><strong>Usuario:</strong> ${userName || 'No especificado'}</p>
                    <p><strong>Fecha de Generacion:</strong> ${fechaGeneracion}</p>
                </div>
        `;

        // Crear tabla HTML
        htmlContent += `
            <div class="tabla-contenedor">
                <h2 class="tabla-titulo">Deducciones Agrupadas por Tipo</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo Gasto</th>
                            <th>Cantidad</th>
                            <th>Monto Total</th>
                            <th>Ultima Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Agregar filas de datos
        datosDeduccionesTipo.forEach(item => {
            const montoFormateado = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            }).format(item.monto || 0);

            const fechaFormateada = item.fecha ?
                new Date(item.fecha).toLocaleDateString('es-MX') : '-';

            htmlContent += `
                <tr>
                    <td style="text-align: center;">${item.id || '-'}</td>
                    <td>${item.nombreGasto || 'Sin nombre'}</td>
                    <td style="text-align: center;">${item.cantidad || 0}</td>
                    <td style="text-align: right;">${montoFormateado}</td>
                    <td style="text-align: center;">${fechaFormateada}</td>
                </tr>
            `;
        });

        // Agregar fila de totales
        htmlContent += `
                    </tbody>
                    <tfoot>
                        <tr class="total-fila">
                            <td colspan="2"><strong>TOTALES</strong></td>
                            <td style="text-align: center;"><strong>${totalCantidad}</strong></td>
                            <td style="text-align: right;">
                                <strong>${new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(totalMonto)}</strong>
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        // Agregar resumen
        htmlContent += `
            <div class="resumen">
                <div class="resumen-item">
                    <span>Total de Tipos de Gastos:</span>
                    <span class="resumen-valor">${totalRows}</span>
                </div>
                <div class="resumen-item">
                    <span>Total de Transacciones:</span>
                    <span class="resumen-valor">${totalCantidad}</span>
                </div>
                <div class="resumen-item">
                    <span>Monto Total General:</span>
                    <span class="resumen-valor">${new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(totalMonto)}</span>
                </div>
                <div class="resumen-item">
                    <span>Fecha del Reporte:</span>
                    <span class="resumen-valor">${fecha || 'No especificada'}</span>
                </div>
            </div>
        `;

        // Cerrar HTML
        htmlContent += `
            </body>
            </html>
        `;

        // Mostrar mensaje de carga
        Swal.fire({
            title: "Generando reporte...",
            html: `
                <div style="text-align: center;">
                    <p>Procesando ${totalRows} tipos de gastos</p>
                    <p>Por favor espere...</p>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();

                // Enviar al controlador
                setTimeout(() => {
                    enviarDatosParaPDFTipoGasto(htmlContent, fecha, userName, datosDeduccionesTipo);
                }, 500);
            }
        });

    } catch (error) {
        console.error("Error en generarReportePDFTipoGasto:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al generar el reporte: ' + error.message
        });
    }
}
// Función para generar reporte PDF
function generarReportePDF() {
    try {
        // Verificar si la tabla existe y tiene datos
        if (!$.fn.DataTable.isDataTable("#tableDeducciones")) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla no inicializada',
                text: 'La tabla de deducciones no está inicializada o no existe'
            });
            return;
        }

        // Obtener la instancia de DataTable
        const table = $("#tableDeducciones").DataTable();

        // VERIFICAR SI LA TABLA TIENE DATOS - CORRECCIÓN CLAVE
        // Método 1: Contar filas totales
        const totalRows = table.rows().count();

        // Método 2: Obtener datos y verificar longitud
        const datosDeducciones = table.rows().data().toArray();

        // Si no hay datos, mostrar advertencia y salir
        if (totalRows === 0 || datosDeducciones.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla vacia',
                text: 'No hay registros en la tabla para generar el reporte PDF',
                confirmButtonText: 'Entendido'
            });
            return; // IMPORTANTE: Salir de la función
        }

        // Obtener valores REALES de tu interfaz
        const fecha = $("#fechaDeducciones").val();
        const userName = $("#userNameDeducciones").val();
        const now = new Date();
        const fechaGeneracion = now.toLocaleDateString('es-MX') + ', ' + now.toLocaleTimeString('es-MX');

        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Deducciones</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        padding: 20px; 
                        font-size: 12px; 
                    }
                    h1 { 
                        text-align: center; 
                        margin-bottom: 20px; 
                        font-size: 22px; 
                        color: #2c3e50;
                    }
                    .header-info { 
                        margin-bottom: 20px; 
                        font-size: 14px; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 10px;
                    }
                    .header-info p { 
                        margin: 5px 0; 
                    }
                    .tabla-contenedor { 
                        margin-bottom: 30px; 
                    }
                    .tabla-titulo { 
                        margin: 15px 0 8px 0; 
                        font-size: 16px; 
                        border-bottom: 1px solid #ddd; 
                        padding-bottom: 3px; 
                    }
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-bottom: 15px;
                        font-size: 10px;
                    }
                    th, td { 
                        padding: 6px; 
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
                    .total { 
                        margin-top: 15px; 
                        padding: 10px; 
                        border: 1px solid #ddd; 
                        border-radius: 5px; 
                        background-color: #f5f5f5; 
                        font-size: 14px; 
                        font-weight: bold;
                        text-align: right;
                    }
                    .sin-datos { 
                        text-align: center; 
                        padding: 20px; 
                        font-style: italic; 
                        color: #666;
                        border: 1px dashed #ddd;
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <h1>Reporte de Deducciones Completas</h1>
                <div class="header-info">
                    <p><strong>Fecha de Reporte:</strong> ${fecha || 'No especificada'}</p>
                    <p><strong>Usuario:</strong> ${userName || 'No especificado'}</p>
                    <p><strong>Fecha de Generacion:</strong> ${fechaGeneracion}</p>
                </div>
        `;

        // Calcular total
        let totalDeducciones = 0;

        // Crear tabla HTML manualmente
        htmlContent += `
            <div class="tabla-contenedor">
                <h2 class="tabla-titulo">Deducciones Registradas</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo Gasto</th>
                            <th>Descripción</th>
                            <th>Encargado</th>
                            <th>Monto</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Agregar filas con los datos de tu DataTable
        datosDeducciones.forEach(row => {
            // Accede a las propiedades según tu estructura de DataTable
            const id = row.id || '';
            const nombreGasto = row.nombreGasto || '';
            const descripcion = row.descripcion || '';
            const usuarioName = row.usuarioName || '';
            const monto = parseFloat(row.monto || 0);
            const fechaRow = row.fecha ? new Date(row.fecha).toLocaleDateString('es-MX') : '';

            totalDeducciones += monto;

            htmlContent += `
                <tr>
                    <td>${id}</td>
                    <td>${nombreGasto}</td>
                    <td>${descripcion}</td>
                    <td>${usuarioName}</td>
                    <td style="text-align: right;">$${monto.toFixed(2)}</td>
                    <td>${fechaRow}</td>
                </tr>
            `;
        });

        htmlContent += `
                    </tbody>
                </table>
            </div>
        `;

        // Agregar total
        if (totalDeducciones > 0) {
            htmlContent += `
                <div class="total">
                    Total de Deducciones: $${totalDeducciones.toFixed(2)}
                </div>
            `;
        }

        htmlContent += `</body></html>`;

        // Mostrar mensaje de carga
        Swal.fire({
            title: "Generando reporte...",
            html: `
                <div style="text-align: center;">
                    <p>Procesando ${datosDeducciones.length} registros</p>
                    <p>Por favor espere...</p>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();

                // Enviar al controlador después de un breve retraso
                setTimeout(() => {
                    enviarDatosParaPDF(htmlContent, fecha, userName, datosDeducciones);
                }, 500);
            }
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al generar el reporte: ' + error.message
        });
    }
}

// Función modificada para enviar al controlador
function enviarDatosParaPDF(htmlContent, fecha, userName, datosDeducciones) {
    try {
        // Crear formulario para enviar los datos al servidor
        var form = $('<form>', {
            method: 'POST',
            action: '/Pdf/GenerarReporteGastosGenerales',
            target: '_blank' // Para abrir en nueva pestaña
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
            value: fecha || ''
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'userName',
            value: userName || ''
        }).appendTo(form);

        // Agregar los datos de las deducciones como JSON
        $('<input>').attr({
            type: 'hidden',
            name: 'datosDeducciones',
            value: JSON.stringify(datosDeducciones || [])
        }).appendTo(form);

        // Agregar token anti-falsificación si lo usas
        var token = $('input[name="__RequestVerificationToken"]').val();
        if (token) {
            $('<input>').attr({
                type: 'hidden',
                name: '__RequestVerificationToken',
                value: token
            }).appendTo(form);
        }

        // Agregar el formulario al cuerpo y enviarlo
        form.appendTo('body').submit().remove();

        // Cerrar el mensaje de carga después de enviar
        setTimeout(() => {
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Reporte generado',
                text: 'El PDF se está descargando',
                timer: 3000,
                showConfirmButton: false
            });
        }, 1000);

    } catch (error) {
        Swal.close(); // Cerrar mensaje de carga si hay error
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el formulario para generar el PDF'
        });
    }
}

function enviarDatosParaPDFTipoGasto(htmlContent, fecha, userName, datosDeduccionesTipo) {
    try {
        // Crear formulario para enviar los datos al servidor
        var form = $('<form>', {
            method: 'POST',
            action: '/Pdf/GenerarReporteGastosTipo',
            target: '_blank'
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
            value: fecha || ''
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'userName',
            value: userName || ''
        }).appendTo(form);

        // Agregar los datos como JSON
        $('<input>').attr({
            type: 'hidden',
            name: 'datosDeduccionesTipo',
            value: JSON.stringify(datosDeduccionesTipo || [])
        }).appendTo(form);

        // Agregar token anti-falsificación si está disponible
        var token = $('input[name="__RequestVerificationToken"]').val();
        if (token) {
            $('<input>').attr({
                type: 'hidden',
                name: '__RequestVerificationToken',
                value: token
            }).appendTo(form);
        }

        // Agregar el formulario al cuerpo y enviarlo
        form.appendTo('body').submit().remove();

        // Cerrar el mensaje de carga después de enviar
        setTimeout(() => {
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Reporte generado',
                text: 'El PDF se está descargando',
                timer: 3000,
                showConfirmButton: false
            });
        }, 1000);

    } catch (error) {
        console.error("Error en enviarDatosParaPDFTipoGasto:", error);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el formulario para generar el PDF: ' + error.message
        });
    }
}

function generarReporteExcel() {
    try {
        // Verificar si la tabla existe y tiene datos
        if (!$.fn.DataTable.isDataTable("#tableDeducciones")) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla no inicializada',
                text: 'La tabla de deducciones no está inicializada o no existe'
            });
            return;
        }

        // Obtener la instancia de DataTable
        const table = $("#tableDeducciones").DataTable();

        // Verificar si hay datos
        const totalRows = table.rows().count();
        const datosDeducciones = table.rows().data().toArray();

        if (totalRows === 0 || datosDeducciones.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla vacia',
                text: 'No hay registros en la tabla para generar el reporte Excel',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Obtener información adicional
        const fecha = $("#fechaDeducciones").val();
        const userName = $("#userNameDeducciones").val();

        // Mostrar mensaje de carga
        Swal.fire({
            title: "Generando Excel...",
            html: `
                <div style="text-align: center;">
                    <p>Procesando ${datosDeducciones.length} registros</p>
                    <p>Por favor espere...</p>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();

                // Crear tabla HTML para enviar al servidor
                crearTablaHTMLParaExcel(datosDeducciones, fecha, userName);
            }
        });

    } catch (error) {
        console.error("Error al generar Excel:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al generar el reporte Excel: ' + error.message
        });
    }
}

function crearTablaHTMLParaExcel(datosDeducciones, fecha, userName) {
    try {
        // Crear tabla HTML manualmente con estructura simple
        let tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">';

        // Encabezados
        tablaHTML += '<thead><tr>';
        tablaHTML += '<th>ID</th>';
        tablaHTML += '<th>Tipo Gasto</th>';
        tablaHTML += '<th>Descripción</th>';
        tablaHTML += '<th>Encargado</th>';
        tablaHTML += '<th>Monto</th>';
        tablaHTML += '<th>Fecha</th>';
        tablaHTML += '</tr></thead>';

        // Datos
        tablaHTML += '<tbody>';

        datosDeducciones.forEach(row => {
            const id = row.id || '';
            const nombreGasto = row.nombreGasto || '';
            const descripcion = row.descripcion || '';
            const usuarioName = row.usuarioName || '';
            const monto = parseFloat(row.monto || 0).toFixed(2);
            const fechaRow = row.fecha ? new Date(row.fecha).toLocaleDateString('es-MX') : '';

            tablaHTML += '<tr>';
            tablaHTML += `<td>${id}</td>`;
            tablaHTML += `<td>${nombreGasto}</td>`;
            tablaHTML += `<td>${descripcion}</td>`;
            tablaHTML += `<td>${usuarioName}</td>`;
            tablaHTML += `<td>$${monto}</td>`;
            tablaHTML += `<td>${fechaRow}</td>`;
            tablaHTML += '</tr>';
        });

        tablaHTML += '</tbody></table>';

        // Enviar al servidor
        enviarDatosParaExcel(tablaHTML);

    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al preparar datos para Excel: ' + error.message
        });
    }
}

function enviarDatosParaExcel(tablaHTML) {
    try {
        // Crear formulario para enviar los datos al servidor
        var form = $('<form>', {
            method: 'POST',
            action: '/Excel/GenerarReporteDeduccionesExcel'
        });

        // Agregar el HTML como campo oculto
        $('<input>').attr({
            type: 'hidden',
            name: 'tablaHTML',
            value: tablaHTML
        }).appendTo(form);

        // Agregar token anti-falsificación si lo usas
        var token = $('input[name="__RequestVerificationToken"]').val();
        if (token) {
            $('<input>').attr({
                type: 'hidden',
                name: '__RequestVerificationToken',
                value: token
            }).appendTo(form);
        }

        // Agregar el formulario al cuerpo y enviarlo
        form.appendTo('body').submit().remove();

        // Cerrar el mensaje de carga después de un tiempo
        setTimeout(() => {
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Reporte generado',
                text: 'El archivo Excel se esta descargando',
                timer: 3000,
                showConfirmButton: false
            });
        }, 2000);

    } catch (error) {
        console.error("Error al enviar datos:", error);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el formulario para generar el Excel'
        });
    }
}
function generarReporteExcelTipoGasto() {
    try {
        const table = $("#tableDeduccionesTipo");

        // Verificar si la tabla DataTable está inicializada
        if (!$.fn.DataTable.isDataTable(table)) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla no inicializada',
                text: 'La tabla de deducciones por tipo no está inicializada o no existe'
            });
            return;
        }

        const dataTable = table.DataTable();

        // Obtener todos los datos de la tabla
        const datosDeduccionesTipo = dataTable.rows().data().toArray();
        const totalRows = datosDeduccionesTipo.length;

        if (totalRows === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla vacía',
                text: 'No hay registros en la tabla para generar el reporte Excel',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const fecha = $("#fechaDeduccionesTipo").val();
        const userName = $("#userNameDeduccionesTipo").val();

        // Mostrar mensaje de carga
        Swal.fire({
            title: "Generando Excel...",
            html: `
                <div style="text-align: center;">
                    <p>Procesando ${totalRows} tipos de gastos</p>
                    <p>Por favor espere...</p>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();

                // Crear tabla HTML para enviar al servidor
                crearTablaHTMLParaExcelTipoGasto(datosDeduccionesTipo, fecha, userName, totalRows);
            }
        });

    } catch (error) {
        console.error("Error al generar Excel:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al generar el reporte Excel: ' + error.message
        });
    }
}

function crearTablaHTMLParaExcelTipoGasto(datosDeduccionesTipo, fecha, userName, totalRows) {
    try {
        // Calcular totales
        let totalCantidad = 0;
        let totalMonto = 0;

        datosDeduccionesTipo.forEach(item => {
            totalCantidad += item.cantidad || 0;
            totalMonto += item.monto || 0;
        });

        // Crear tabla HTML manualmente con estructura simple
        let tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;width:100%;">';

        // Encabezados principales
        tablaHTML += '<thead>';
        tablaHTML += '<tr>';
        tablaHTML += '<th colspan="5" style="background-color:#34495e;color:white;font-size:14px;padding:10px;">REPORTE DE DEDUCCIONES POR TIPO DE GASTO</th>';
        tablaHTML += '</tr>';
        tablaHTML += '</thead>';

        // Información del reporte en filas independientes
        tablaHTML += '<tbody>';
        tablaHTML += '<tr>';
        tablaHTML += '<td colspan="5" style="background-color:#f8f9fa;padding:6px;border:1px solid #ddd;">';
        tablaHTML += '<strong>Fecha del Reporte:</strong> ' + (fecha || 'No especificada');
        tablaHTML += '</td>';
        tablaHTML += '</tr>';

        tablaHTML += '<tr>';
        tablaHTML += '<td colspan="5" style="background-color:#f8f9fa;padding:6px;border:1px solid #ddd;">';
        tablaHTML += '<strong>Usuario:</strong> ' + (userName || 'No especificado');
        tablaHTML += '</td>';
        tablaHTML += '</tr>';

        tablaHTML += '<tr>';
        tablaHTML += '<td colspan="5" style="background-color:#f8f9fa;padding:6px;border:1px solid #ddd;">';
        tablaHTML += '<strong>Fecha de Generación:</strong> ' + new Date().toLocaleDateString('es-MX') + ' ' + new Date().toLocaleTimeString('es-MX');
        tablaHTML += '</td>';
        tablaHTML += '</tr>';

        // Espacio entre información y tabla
        tablaHTML += '<tr>';
        tablaHTML += '<td colspan="5" style="height:15px;"></td>';
        tablaHTML += '</tr>';

        // Encabezados de columna
        tablaHTML += '<tr style="background-color:#2c3e50;color:white;">';
        tablaHTML += '<th style="padding:8px;text-align:center;">ID</th>';
        tablaHTML += '<th style="padding:8px;text-align:center;">TIPO GASTO</th>';
        tablaHTML += '<th style="padding:8px;text-align:center;">CANTIDAD</th>';
        tablaHTML += '<th style="padding:8px;text-align:center;">MONTO TOTAL</th>';
        tablaHTML += '<th style="padding:8px;text-align:center;">ÚLTIMA FECHA</th>';
        tablaHTML += '</tr>';

        // Datos
        datosDeduccionesTipo.forEach(row => {
            const id = row.id || '-';
            const nombreGasto = row.nombreGasto || 'Sin nombre';
            const cantidad = row.cantidad || 0;
            const monto = row.monto || 0;
            const fechaRow = row.fecha ? new Date(row.fecha).toLocaleDateString('es-MX') : '-';

            const montoFormateado = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            }).format(monto);

            tablaHTML += '<tr>';
            tablaHTML += `<td style="text-align:center;padding:6px;">${id}</td>`;
            tablaHTML += `<td style="padding:6px;">${nombreGasto}</td>`;
            tablaHTML += `<td style="text-align:center;padding:6px;">${cantidad}</td>`;
            tablaHTML += `<td style="text-align:right;padding:6px;">${montoFormateado}</td>`;
            tablaHTML += `<td style="text-align:center;padding:6px;">${fechaRow}</td>`;
            tablaHTML += '</tr>';
        });

        // Fila de totales
        tablaHTML += '<tr style="background-color:#e8f4f8;font-weight:bold;">';
        tablaHTML += '<td colspan="2" style="text-align:right;padding:8px;">TOTALES:</td>';
        tablaHTML += `<td style="text-align:center;padding:8px;">${totalCantidad}</td>`;
        tablaHTML += `<td style="text-align:right;padding:8px;">${new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(totalMonto)}</td>`;
        tablaHTML += '<td style="padding:8px;"></td>';
        tablaHTML += '</tr>';

        tablaHTML += '</tbody></table>';

        // Agregar resumen adicional con espacio
        tablaHTML += '<br><br>';
        tablaHTML += '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;width:100%;margin-top:20px;">';
        tablaHTML += '<thead>';
        tablaHTML += '<tr>';
        tablaHTML += '<th colspan="2" style="background-color:#34495e;color:white;font-size:14px;padding:10px;text-align:center;">RESUMEN ESTADÍSTICO</th>';
        tablaHTML += '</tr>';
        tablaHTML += '</thead>';
        tablaHTML += '<tbody>';

        // Total de Tipos de Gastos (con número en negritas)
        tablaHTML += '<tr>';
        tablaHTML += '<td style="padding:6px;border:1px solid #ddd;"><strong>Total de Tipos de Gastos:</strong></td>';
        tablaHTML += `<td style="padding:6px;border:1px solid #ddd;text-align:right;"><strong>${totalRows}</strong></td>`;
        tablaHTML += '</tr>';

        // Total de Transacciones (con número en negritas)
        tablaHTML += '<tr>';
        tablaHTML += '<td style="padding:6px;border:1px solid #ddd;"><strong>Total de Transacciones:</strong></td>';
        tablaHTML += `<td style="padding:6px;border:1px solid #ddd;text-align:right;"><strong>${totalCantidad}</strong></td>`;
        tablaHTML += '</tr>';

        // Monto Total General (con número en negritas)
        tablaHTML += '<tr>';
        tablaHTML += '<td style="padding:6px;border:1px solid #ddd;"><strong>Monto Total General:</strong></td>';
        tablaHTML += `<td style="padding:6px;border:1px solid #ddd;text-align:right;"><strong>${new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(totalMonto)}</strong></td>`;
        tablaHTML += '</tr>';

        if (totalRows > 0) {
            const promedioPorTipo = totalMonto / totalRows;
            const promedioPorTransaccion = totalCantidad > 0 ? totalMonto / totalCantidad : 0;

            // Promedio por Tipo (con número en negritas)
            tablaHTML += '<tr>';
            tablaHTML += '<td style="padding:6px;border:1px solid #ddd;"><strong>Promedio por Tipo:</strong></td>';
            tablaHTML += `<td style="padding:6px;border:1px solid #ddd;text-align:right;"><strong>${new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            }).format(promedioPorTipo)}</strong></td>`;
            tablaHTML += '</tr>';

            // Promedio por Transacción (con número en negritas)
            tablaHTML += '<tr>';
            tablaHTML += '<td style="padding:6px;border:1px solid #ddd;"><strong>Promedio por Transacción:</strong></td>';
            tablaHTML += `<td style="padding:6px;border:1px solid #ddd;text-align:right;"><strong>${new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            }).format(promedioPorTransaccion)}</strong></td>`;
            tablaHTML += '</tr>';
        }

        tablaHTML += '</tbody></table>';

        // Enviar al servidor
        enviarDatosParaExcelTipoGasto(tablaHTML, fecha, userName);

    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al preparar datos para Excel: ' + error.message
        });
    }
}

function enviarDatosParaExcelTipoGasto(tablaHTML, fecha, userName) {
    try {
        // Crear formulario para enviar los datos al servidor
        var form = $('<form>', {
            method: 'POST',
            action: '/Excel/GenerarReporteDeduccionesTipoExcel'
        });

        // Agregar el HTML como campo oculto
        $('<input>').attr({
            type: 'hidden',
            name: 'tablaHTML',
            value: tablaHTML
        }).appendTo(form);

        // Agregar información adicional
        $('<input>').attr({
            type: 'hidden',
            name: 'fecha',
            value: fecha || ''
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'userName',
            value: userName || ''
        }).appendTo(form);

        // Agregar token anti-falsificación si está disponible
        var token = $('input[name="__RequestVerificationToken"]').val();
        if (token) {
            $('<input>').attr({
                type: 'hidden',
                name: '__RequestVerificationToken',
                value: token
            }).appendTo(form);
        }

        // Agregar el formulario al cuerpo y enviarlo
        form.appendTo('body').submit().remove();

        // Cerrar el mensaje de carga después de un tiempo
        setTimeout(() => {
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Reporte generado',
                text: 'El archivo Excel se está descargando',
                timer: 3000,
                showConfirmButton: false
            });
        }, 2000);

    } catch (error) {
        console.error("Error al enviar datos:", error);
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el formulario para generar el Excel'
        });
    }
}