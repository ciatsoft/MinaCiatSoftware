// Variable global para almacenar las categorías
var categoriasInventario = [];

$(document).ready(function () {
    // Configuración de DataTable
    $("#tblPiezasRetiradas").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
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
                render: function (data, type, row) {
                    return '<input type="button" value="Mas Detalles" class="btn btn-custom-clean" onclick="MasDetalles(\'' + data + '\', \'' + row.idReparacion + '\', \'' + row.tipoVehiculo + '\', \'' + row.idVehiculo + '\')" />';
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

    GetAllCategoriaInventario();

    // Eventos para los botones de exportacion
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
            MapingPropertiesDataTable("tblPiezasRetiradas", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las Piezas: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
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
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las Categorias del Inventario: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function MasDetalles(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").text("Detalles de Pieza");

    var url = `/Taller/PartialViewModalMostrarDetalles?id=${encodeURIComponent(id)}&idReparacion=${encodeURIComponent(idReparacion)}&tipoVehiculo=${encodeURIComponent(tipoVehiculoCodigo)}&idVehiculo=${encodeURIComponent(idVehiculo)}`;

    $("#boddyGeericModal").load(url, function (response, status, xhr) {
        if (status === "error") {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los detalles: ' + xhr.statusText,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            $("#genericModal").modal("show");
        }
    });
}

// ================= FUNCION PARA FORMATEAR FECHA =================
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
    var tabla = $('#tblPiezasRetiradas').DataTable();
    var datos = tabla.data().toArray();

    if (datos.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay datos para exportar',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    Swal.fire({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
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
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'Reporte generado!',
            text: 'El PDF se ha creado correctamente',
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
    html += '<th>ID</th>';
    html += '<th>Nombre</th>';
    html += '<th>Categoria</th>';
    html += '<th>Marca</th>';
    html += '<th>Cantidad</th>';
    html += '<th>Fecha</th>';
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

        html += '骨';
        html += '<td style="text-align:center;">' + (item.id || '') + '</td>';
        html += '<td>' + (item.nombre || '') + '</td>';
        html += '<td>' + categoriaNombre + '</td>';
        html += '<td>' + (item.marca || '') + '</td>';
        html += '<td style="text-align:center;">' + (item.cantidad || 0) + '</td>';
        html += '<td style="text-align:center;">' + fechaFormateada + '</td>';
        html += '</tr>';
    }

    html += '</tbody>';
    html += '</table>';

    return html;
}

// ================= FUNCIONES PARA EXPORTAR EXCEL =================
function generarReporteInventarioExcel() {
    var tabla = $('#tblPiezasRetiradas').DataTable();
    var datos = tabla.data().toArray();

    if (datos.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay datos para exportar',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    Swal.fire({
        title: "Generando Excel...",
        text: "Por favor espere mientras se genera el archivo Excel",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
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
        Swal.close();
        Swal.fire({
            icon: 'success',
            title: 'Excel generado!',
            text: 'El archivo Excel se ha creado correctamente',
            timer: 3000,
            showConfirmButton: false
        });
    }, 2000);
}