// Variable global para almacenar las categorías
var categoriasInventario = [];
var dataTable; // Variable global para la instancia de DataTable

// Función para formatear como moneda MXN
function formatCurrency(value) {
    if (value === '' || value === null || value === undefined) return '';
    let num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

$(document).ready(function () {
    // Configuración de DataTable
    dataTable = $("#tblPiezasRetiradas").DataTable({
        data: [],
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        columns: [
            { data: 'id', title: 'ID', visible: false},
            { data: 'idReparacion', title: 'Reparacion', visible: false },
            { data: 'nombre', title: 'Nombre' },
            {
                data: 'idCategoriaInventario',
                title: 'Categoria',
                render: function (data, type, row) {
                    var categoria = categoriasInventario.find(c => c.id === data);
                    return categoria ? categoria.nombre : data;
                }
            },
            { data: 'marca', title: 'Marca' },
            { data: 'cantidad', title: 'Cantidad' },
            {
                data: 'fecha',
                title: 'Fecha',
                render: function (data) {
                    if (data) {
                        var fecha = new Date(data);
                        return fecha.toLocaleDateString('es-MX') + ' ' +
                            fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
                    }
                    return '';
                }
            },
            {
                data: "id",
                title: "Acciones",
                orderable: false,
                render: function (data, type, row) {
                    return '<button class="btn btn-info btn-sm btnDetalles" data-id="' + data + '" data-idreparacion="' + row.idReparacion + '" data-tipovehiculo="' + (row.tipoVehiculo || '') + '" data-idvehiculo="' + (row.idVehiculo || '') + '" title="Más Detalles">' +
                        '<i class="fa fa-info-circle"></i> Más Detalles</button>';
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": '<i class="fa fa-list"></i> Mostrar _MENU_ entradas',
            "zeroRecords": '<i class="fa fa-info-circle"></i> No se encontraron resultados',
            "emptyTable": '<i class="fa fa-database"></i> Ningún dato disponible en esta tabla',
            "info": '<i class="fa fa-info-circle"></i> Mostrando _START_ a _END_ de _TOTAL_ entradas',
            "infoEmpty": '<i class="fa fa-info-circle"></i> Mostrando 0 a 0 de 0 entradas',
            "infoFiltered": '<i class="fa fa-filter"></i> (filtrado de un total de _MAX_ entradas)',
            "search": '<i class="fa fa-search"></i> Buscar:',
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i> Primero',
                "last": '<i class="fa fa-fast-forward"></i> Último',
                "next": '<i class="fa fa-forward"></i> Siguiente',
                "previous": '<i class="fa fa-backward"></i> Anterior'
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    // Evento delegado para el botón de detalles
    $(document).on('click', '.btnDetalles', function () {
        var id = $(this).data('id');
        var idReparacion = $(this).data('idreparacion');
        var tipoVehiculo = $(this).data('tipovehiculo');
        var idVehiculo = $(this).data('idvehiculo');
        MasDetalles(id, idReparacion, tipoVehiculo, idVehiculo);
    });

    GetAllCategoriaInventario();

    // Eventos para los botones de exportación
    $('#btnGenerarPDF').on('click', function () {
        generarReporteInventarioPDF();
    });

    $('#btnGenerarExcel').on('click', function () {
        generarReporteInventarioExcel();
    });
});

function GetAllRetirarPiezasNoReutilizables() {
    GetMVC("/Taller/GetAllRetirarPiezasNoReutilizables", function (r) {
        if (r.IsSuccess) {
            // Limpiar y cargar nuevos datos en la tabla existente
            dataTable.clear();
            dataTable.rows.add(r.Response);
            dataTable.draw();
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las Piezas: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function GetAllCategoriaInventario() {
    GetMVC("/Taller/GetAllCategoriaInventario", function (r) {
        if (r.IsSuccess) {
            categoriasInventario = r.Response;
            GetAllRetirarPiezasNoReutilizables();
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las Categorias del Inventario: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function MasDetalles(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").html('<span style="color: black;">Detalles de Pieza</span>');

    var url = `/Taller/PartialViewModalMostrarDetalles?id=${encodeURIComponent(id)}&idReparacion=${encodeURIComponent(idReparacion)}&tipoVehiculo=${encodeURIComponent(tipoVehiculoCodigo)}&idVehiculo=${encodeURIComponent(idVehiculo)}`;

    $("#boddyGeericModal").load(url, function (response, status, xhr) {
        if (status === "error") {
            swal({
                title: "Error",
                text: "Error al cargar los detalles: " + xhr.statusText,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        } else {
            $("#genericModal").modal("show");
        }
    });
}

// ================= FUNCIÓN PARA FORMATEAR FECHA =================
function formatearFecha(fecha) {
    if (!fecha) return '';
    try {
        var fechaDate = new Date(fecha);
        if (isNaN(fechaDate.getTime())) return '';

        var dia = fechaDate.getDate().toString().padStart(2, '0');
        var mes = (fechaDate.getMonth() + 1).toString().padStart(2, '0');
        var anio = fechaDate.getFullYear();
        var horas = fechaDate.getHours().toString().padStart(2, '0');
        var minutos = fechaDate.getMinutes().toString().padStart(2, '0');

        return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
    } catch (e) {
        return '';
    }
}

// ================= FUNCIONES PARA EXPORTAR PDF =================
function generarReporteInventarioPDF() {
    var datos = dataTable.data().toArray();

    if (datos.length === 0) {
        swal({
            title: "Sin datos",
            text: "No hay datos para exportar",
            type: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    swal({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        type: "info",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    // Construir tabla HTML con fecha formateada
    var tablaHTML = construirTablaInventarioHTML(datos);

    var form = $('<form>', {
        method: 'POST',
        action: '/PDF/GenerarReporteInventarioPiezasPDF'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaHTML',
        value: tablaHTML
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'totalRegistros',
        value: datos.length
    }).appendTo(form);

    form.appendTo('body').submit();
    form.remove();

    setTimeout(function () {
        swal.close();
        swal({
            title: "Reporte generado!",
            text: "El PDF se ha creado correctamente",
            type: "success",
            timer: 3000,
            showConfirmButton: false
        });
    }, 2000);
}

function construirTablaInventarioHTML(datos) {
    if (!datos || datos.length === 0) {
        return "<p style='color: #7f8c8d;'>No hay datos disponibles.</p>";
    }

    var html = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    html += '<thead>';
    html += '<tr style="background-color:#34495e;color:white;">';
    html += '<th style="padding:10px;">ID</th>';
    html += '<th style="padding:10px;">Nombre</th>';
    html += '<th style="padding:10px;">Categoria</th>';
    html += '<th style="padding:10px;">Marca</th>';
    html += '<th style="padding:10px;">Cantidad</th>';
    html += '<th style="padding:10px;">Fecha</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    for (var i = 0; i < datos.length; i++) {
        var item = datos[i];

        // Obtener nombre de categoria
        var categoriaNombre = item.idCategoriaInventario;
        var categoria = categoriasInventario.find(c => c.id === item.idCategoriaInventario);
        if (categoria) {
            categoriaNombre = categoria.nombre;
        }

        // Formatear fecha
        var fechaFormateada = formatearFecha(item.fecha);

        html += '<tr>';
        html += '<td style="text-align:center;padding:8px;">' + (item.id || '') + '</td>';
        html += '<td style="padding:8px;">' + (item.nombre || '') + '</td>';
        html += '<td style="padding:8px;">' + categoriaNombre + '</td>';
        html += '<td style="padding:8px;">' + (item.marca || '') + '</td>';
        html += '<td style="text-align:center;padding:8px;">' + (item.cantidad || 0) + '</td>';
        html += '<td style="text-align:center;padding:8px;">' + fechaFormateada + '</td>';
        html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';

    return html;
}

// ================= FUNCIONES PARA EXPORTAR EXCEL =================
function generarReporteInventarioExcel() {
    var datos = dataTable.data().toArray();

    if (datos.length === 0) {
        swal({
            title: "Sin datos",
            text: "No hay datos para exportar",
            type: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    swal({
        title: "Generando Excel...",
        text: "Por favor espere mientras se genera el archivo Excel",
        type: "info",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    // Preparar datos para Excel con fecha formateada
    var datosExcel = [];
    for (var i = 0; i < datos.length; i++) {
        var item = datos[i];

        // Obtener nombre de categoria
        var categoriaNombre = item.idCategoriaInventario;
        var categoria = categoriasInventario.find(c => c.id === item.idCategoriaInventario);
        if (categoria) {
            categoriaNombre = categoria.nombre;
        }

        // Formatear fecha
        var fechaFormateada = formatearFecha(item.fecha);

        datosExcel.push({
            id: item.id || '',
            nombre: item.nombre || '',
            categoria: categoriaNombre,
            marca: item.marca || '',
            cantidad: item.cantidad || 0,
            fecha: fechaFormateada
        });
    }

    var form = $('<form>', {
        method: 'POST',
        action: '/Excel/GenerarReporteInventarioPiezasExcel'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'datos',
        value: JSON.stringify(datosExcel)
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'totalRegistros',
        value: datos.length
    }).appendTo(form);

    form.appendTo('body').submit();
    form.remove();

    setTimeout(function () {
        swal.close();
        swal({
            title: "Excel generado!",
            text: "El archivo Excel se ha creado correctamente",
            type: "success",
            timer: 3000,
            showConfirmButton: false
        });
    }, 2000);
}

// ================= FUNCIÓN DE FILTRADO =================
document.getElementById("btnFiltrar").addEventListener("click", function () {
    var fechaInicio = $("#fechaInicio").val();
    var fechaFin = $("#fechaFin").val();

    // Validación 1: Verificar que ambos campos estén llenos
    if (!fechaInicio || !fechaFin) {
        swal({
            title: "Campos incompletos",
            text: "Por favor, complete ambas fechas",
            type: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Convertir a objetos Date
    var fechaInicioObj = new Date(fechaInicio);
    var fechaFinObj = new Date(fechaFin);

    // Validación 2: Verificar que sean fechas válidas
    if (isNaN(fechaInicioObj.getTime()) || isNaN(fechaFinObj.getTime())) {
        swal({
            title: "Fechas inválidas",
            text: "Una o ambas fechas tienen un formato incorrecto",
            type: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Validación 3: Fecha inicio no puede ser mayor que fecha fin
    if (fechaInicioObj > fechaFinObj) {
        swal({
            title: "Rango de fechas inválido",
            text: "La fecha de inicio no puede ser mayor que la fecha de fin",
            type: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Validación 4: Fecha fin no puede ser futura
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaFinObj > fechaActual) {
        swal({
            title: "Fecha futura no permitida",
            text: "La fecha de fin no puede ser mayor a la fecha actual",
            type: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Validación 5: Rango máximo de días
    const diffTime = Math.abs(fechaFinObj - fechaInicioObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const maxDays = 365;

    if (diffDays > maxDays) {
        swal({
            title: "Rango muy extenso",
            text: `El rango de fechas no puede exceder los ${maxDays} días`,
            type: "error",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    // Si pasa todas las validaciones, ejecutar la función
    InventarioPiezasNoReutilizablesByDates(fechaInicio, fechaFin);
});

function InventarioPiezasNoReutilizablesByDates(fechaInicio, fechaFin) {
    var parametro = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    };

    // Mostrar loading
    swal({
        title: "Filtrando datos...",
        text: "Por favor espere",
        type: "info",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    PostMVC('/Taller/InventarioPiezasNoReutilizablesByDates', parametro, function (r, textStatus, jqXHR) {
        // Cerrar el loading
        swal.close();

        if (r.IsSuccess && Array.isArray(r.Response)) {
            const data = r.Response;

            // Limpiar la tabla existente y cargar los nuevos datos
            dataTable.clear();
            dataTable.rows.add(data);
            dataTable.draw();

            // CORRECCIÓN: Mostrar mensaje de sin resultados con temporizador que no se cierra automáticamente
            if (data.length === 0) {
                swal({
                    title: "Sin resultados",
                    text: "No se encontraron registros en el rango de fechas seleccionado",
                    type: "info",
                    confirmButtonText: "Aceptar"
                });
            }
        } else {
            swal({
                title: "Error",
                text: "Error al filtrar las Piezas: " + (r.ErrorMessage || 'Error desconocido'),
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    }).fail(function (xhr, status, error) {
        swal.close();
        swal({
            title: "Error",
            text: "Error de conexión al servidor: " + error,
            type: "error",
            confirmButtonText: "Aceptar"
        });
    });
}

function InventarioPiezasNoReutilizablesByDates(fechaInicio, fechaFin) {
    var parametro = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    };

    PostMVC('/Taller/InventarioPiezasNoReutilizablesByDates', parametro, function (r, textStatus, jqXHR) {

        // Verificar si la respuesta es válida
        if (r && r.IsSuccess !== undefined) {
            if (r.IsSuccess && Array.isArray(r.Response)) {
                const data = r.Response;

                // Limpiar la tabla existente y cargar los nuevos datos
                dataTable.clear();
                dataTable.rows.add(data);
                dataTable.draw();

                if (data.length === 0) {
                    swal({
                        title: "Sin resultados",
                        text: "No se encontraron registros en el rango de fechas seleccionado",
                        type: "info",
                        confirmButtonText: "Aceptar"
                    });
                }
            } else {
                swal({
                    title: "Error",
                    text: "Error al filtrar las Piezas: " + (r.ErrorMessage || 'Error desconocido'),
                    type: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        } else {
            // Manejar error de conexión o respuesta inválida
            swal({
                title: "Error de conexión",
                text: "No se pudo completar la solicitud. Por favor, intente de nuevo.",
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}