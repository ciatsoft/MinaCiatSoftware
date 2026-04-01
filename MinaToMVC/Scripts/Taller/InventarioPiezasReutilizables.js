// Variable global para almacenar las categorías y la instancia de DataTable
var categoriasInventario = [];
var dataTableReutilizables; // Variable global para la instancia de DataTable de piezas reutilizables

$(document).ready(function () {
    // Configuración de DataTable
    dataTableReutilizables = $("#tblPiezasRetiradas").DataTable({
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
                    // CORREGIDO: Agregar comillas simples para los parámetros string
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

    // Cargar primero las categorías y luego las piezas
    GetAllCategoriaInventario();

    // Eventos para los botones de exportacion
    $('#btnGenerarPDF').on('click', function () {
        generarReporteInventarioReutilizablesPDF();
    });

    $('#btnGenerarExcel').on('click', function () {
        generarReporteInventarioReutilizablesExcel();
    });
});

function GetAllRetirarPiezasReutilizables() {
    GetMVC("/Taller/GetAllRetirarPiezasReutilizables", function (r) {
        if (r.IsSuccess) {
            // CORREGIDO: Usar la instancia global en lugar de MapingPropertiesDataTable
            dataTableReutilizables.clear();
            dataTableReutilizables.rows.add(r.Response);
            dataTableReutilizables.draw();
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
            GetAllRetirarPiezasReutilizables();
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

    // CORREGIDO: Agregar encodeURIComponent para seguridad y manejo correcto de URLs
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
function generarReporteInventarioReutilizablesPDF() {
    // CORREGIDO: Usar la instancia global
    var datos = dataTableReutilizables.data().toArray();

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
    var tablaHTML = construirTablaInventarioReutilizablesHTML(datos);

    var form = $('<form>', {
        method: 'POST',
        action: '/PDF/GenerarReporteInventarioReutilizablesPDF'
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

function construirTablaInventarioReutilizablesHTML(datos) {
    if (!datos || datos.length === 0) {
        return "<p style='color: #7f8c8d;'>No hay datos disponibles.</p>";
    }

    var html = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    html += '<thead>';
    html += '<tr>';
    html += '<th>ID</th>';
    html += '<th>Nombre</th>';
    html += '<th>Categoria</th>';
    html += '<th>Marca</th>';
    html += '<th>Cantidad</th>';
    html += '<th>Fecha</th>';
    html += '\)';
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
        html += '<td style="text-align:center;">' + (item.id || '') + '\(';
        html += '<td>' + (item.nombre || '') + '\(';
        html += '<td>' + categoriaNombre + '\(';
        html += '<td>' + (item.marca || '') + '\(';
        html += '<td style="text-align:center;">' + (item.cantidad || 0) + '\(';
        html += '<td style="text-align:center;">' + fechaFormateada + '\(';
        html += '\)';
    }

    html += '</tbody>';
    html += ' caregory';

    return html;
}

// ================= FUNCIONES PARA EXPORTAR EXCEL =================
function generarReporteInventarioReutilizablesExcel() {
    // CORREGIDO: Usar la instancia global
    var datos = dataTableReutilizables.data().toArray();

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
        action: '/Excel/GenerarReporteInventarioReutilizablesExcel'
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

// ================= FUNCIÓN DE FILTRADO =================
document.getElementById("btnFiltrar").addEventListener("click", function () {
    var fechaInicio = $("#fechaInicio").val();
    var fechaFin = $("#fechaFin").val();

    // Validación 1: Verificar que ambos campos estén llenos
    if (!fechaInicio || !fechaFin) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor, complete ambas fechas',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    // Convertir a objetos Date
    var fechaInicioObj = new Date(fechaInicio);
    var fechaFinObj = new Date(fechaFin);

    // Validación 2: Verificar que sean fechas válidas
    if (isNaN(fechaInicioObj.getTime()) || isNaN(fechaFinObj.getTime())) {
        Swal.fire({
            icon: 'error',
            title: 'Fechas invalidas',
            text: 'Una o ambas fechas tienen un formato incorrecto',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    // Validación 3: Fecha inicio no puede ser mayor que fecha fin
    if (fechaInicioObj > fechaFinObj) {
        Swal.fire({
            icon: 'error',
            title: 'Rango de fechas invalido',
            text: 'La fecha de inicio no puede ser mayor que la fecha de fin',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    // Validación 4: Fecha fin no puede ser futura
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    if (fechaFinObj > fechaActual) {
        Swal.fire({
            icon: 'error',
            title: 'Fecha futura no permitida',
            text: 'La fecha de fin no puede ser mayor a la fecha actual',
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    // Validación 5: Rango máximo de días (ajusta el valor según necesites)
    const diffTime = Math.abs(fechaFinObj - fechaInicioObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const maxDays = 365; // Cambia este valor según tu necesidad

    if (diffDays > maxDays) {
        Swal.fire({
            icon: 'error',
            title: 'Rango muy extenso',
            text: `El rango de fechas no puede exceder los ${maxDays} días`,
            confirmButtonColor: '#3085d6'
        });
        return;
    }

    // Si pasa todas las validaciones, ejecutar la función
    InventarioPiezasReutilizablesByDates(fechaInicio, fechaFin);
});

function InventarioPiezasReutilizablesByDates(fechaInicio, fechaFin) {
    var parametro = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    };

    // Mostrar loading
    Swal.fire({
        title: 'Filtrando datos...',
        text: 'Por favor espere',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    PostMVC('/Taller/InventarioPiezasReutilizablesByDates', parametro, function (r, textStatus, jqXHR) {
        Swal.close();

        if (r.IsSuccess && Array.isArray(r.Response)) {
            const data = r.Response;

            // CORREGIDO: Usar la instancia global para limpiar y cargar los nuevos datos
            dataTableReutilizables.clear();
            dataTableReutilizables.rows.add(data);
            dataTableReutilizables.draw();

        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al filtrar las Piezas: ' + (r.ErrorMessage || 'Error desconocido'),
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    }).fail(function (xhr, status, error) {
        Swal.close();
        Swal.fire({
            title: 'Error',
            text: 'Error de conexión al servidor: ' + error,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    });
}