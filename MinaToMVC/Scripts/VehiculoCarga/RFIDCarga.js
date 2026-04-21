let empleados = [];
let vehiculosCarga = []

$(document).ready(function () {

    $('#rfid').on('input', function () {
        const rfid = $(this).val().trim();
        if (rfid.length > 0) { // Opcional: solo buscar si hay valor
            buscarRFID(rfid); // Pasar solo el string, no el objeto
        }
    });
  
    var $fechaHora = $('#fechaHora');
    var $fechaHoraHidden = $('#fechaHoraHidden');

    // Sincronizar el hidden con el valor visible al cargar la página
    if ($fechaHora.val()) {
        $fechaHoraHidden.val($fechaHora.val());
    }

    // Actualizar el hidden cuando cambie el campo visible (por si acaso)
    $fechaHora.on('change', function () {
        $fechaHoraHidden.val($(this).val());
    });

    $("#tblRFIDCarga").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: false, title: "Id" },
            {
                data: "idTrabajador",
                title: "Trabajador",
                render: function (data) {
                    const empleado = empleados.find(e => e.id === data);
                    if (empleado) {
                        return `${empleado.nombre || ''} ${empleado.apellidoPaterno || ''} ${empleado.apellidoMaterno || ''}`.trim();
                    }
                    return "No asignado";
                }
            },
            {
                data: "idVehiculoCarga",
                title: "Vehiculo de Carga",
                render: function (data) {
                    const vehiculo = vehiculosCarga.find(e => e.id === data);
                    if (vehiculo) {
                        return `${vehiculo.descripcion}`.trim();
                    }
                    return "No asignado";
                }
            },
            { data: "rfidAsignado", title: "RFID Asignado" },
            {
                data: "fechaHora",
                title: "Fecha y Hora",
                render: function (data) {
                    if (!data) return '';

                    // Si data es una cadena en formato ISO o similar
                    var fecha = new Date(data);

                    if (isNaN(fecha.getTime())) return data; // Si no es fecha válida, retorna el valor original

                    var dia = ('0' + fecha.getDate()).slice(-2);
                    var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
                    var year = fecha.getFullYear();
                    var horas = ('0' + fecha.getHours()).slice(-2);
                    var minutos = ('0' + fecha.getMinutes()).slice(-2);
                    var segundos = ('0' + fecha.getSeconds()).slice(-2);

                    return dia + '/' + mes + '/' + year + ' ' + horas + ':' + minutos + ':' + segundos;
                }
            },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data) {
                    return data == 1 ? "Activo" : "Inactivo";
                },
                visible: false
            },
            {
                data: "devuelto",
                title: "Estatus de RFID",
                render: function (data, type, row) {
                    // data es el valor de devuelto (0 = no devuelto, 1 = devuelto)
                    if (data == 1) {
                        // Si ya está devuelto, mostrar mensaje en rojo
                        return '<span class="badge badge-danger" style="background-color: #dc3545; color: white; padding: 8px 12px; border-radius: 4px;">DEVUELTO</span>';
                    } else {
                        // Si no está devuelto, mostrar el botón
                        return '<input type="button" value="Devolver" class="btn btn-success btn-lg-custom" onclick="DevueltoRFIDCarga(' + row.id + ')"/>';
                    }
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data, type, row) {
                    // Verificar el valor de devuelto desde la fila actual
                    let botones = '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRFIDCarga(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRFIDCarga(' + data + ')"/>';

                    // Si devuelto = 1 (ya está devuelto), mostrar el botón NoDevuelto
                    if (row.devuelto == 1) {
                        botones += ' <input type="button" value="No Devuelto" class="btn btn-success btn-lg-custom" onclick="NoDevueltoRFIDCarga(' + data + ')" />';
                    }

                    return botones;
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

    GetAllRFIDCarga();
});

function GetAllRFIDCarga() {
    GetMVC("/VehiculoCarga/GetAllRFIDCarga", function (r) {
        if (r.IsSuccess) {
            GetAllEmpleados(function () {
                GetAllVehiculosCarga(function () {
                    MapingPropertiesDataTable("tblRFIDCarga", r.Response);
                });
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los RFIDCarga: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function EditarRFIDCarga(id) {
    location.href = "/VehiculoCarga/RFIDCarga/" + id;
}

function EliminarRFIDCarga(id) {
    Swal.fire({
        title: 'Eliminar Registro',
        text: "Se eliminara este registro",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/VehiculoCarga/DeleteRFIDCarga', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success')
                        .then(() => { GetAllRFIDCarga(); }); // Recargar la tabla en lugar de redireccionar
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el registro: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}
function NoDevueltoRFIDCarga(id) {
    Swal.fire({
        title: 'Marcar RFID',
        text: "Marcar como no devuelto este RFID",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, marcar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/VehiculoCarga/NoDevueltoRFIDCarga', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Sin devolver', 'El registro ha sido marcado como no devuelto.', 'success')
                        .then(() => { GetAllRFIDCarga(); }); // Recargar la tabla en lugar de redireccionar
                } else {
                    Swal.fire('Error', 'No se pudo modificar el registro: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}
function DevueltoRFIDCarga(id) {
    Swal.fire({
        title: 'Marcar RFID',
        text: "Marcar como devuelto este RFID",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, marcar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/VehiculoCarga/DevueltoRFIDCarga', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Devuelto', 'El registro ha sido marcado como devuelto.', 'success')
                        .then(() => { GetAllRFIDCarga(); }); // Recargar la tabla en lugar de redireccionar
                } else {
                    Swal.fire('Error', 'No se pudo devolver el registro: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}

function EliminarRFIDCarga(id) {
    Swal.fire({
        title: 'Eliminar registro',
        text: "Se eliminara registro",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id }; // Asumiendo que 0 = Inactivo/Devuelto

            PostMVC('/VehiculoCarga/DeleteRFIDCarga', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El RFID ha sido eliminado.', 'success')
                        .then(() => { GetAllRFIDCarga(); });
                } else {
                    Swal.fire('Error', 'No se pudo actualizar el registro: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}

function SaveOrUpdateRFIDCarga() {
    // Usar el valor del hidden que tiene la fecha formateada correctamente
    var parametro = {
        Id: $("#id").val() || 0,
        IdTrabajador: $("#ddlTrabajador").val(),
        IdVehiculoCarga: $("#ddlVehiculoCarga").val(),
        RFIDAsignado: $("#rfid").val(),
        FechaHora: $("#fechaHoraHidden").val(), // Usar el hidden en lugar del visible
        Devuelto: 1,
        Estatus: 1,
        Activo: 1,
        CreatedBy: $("#createdBy").val(),
        CreatedDt: $("#createdDt").val(),
        UpdatedBy: $("#updatedBy").val(),
        UpdatedDt: $("#updatedDt").val(),
    };

    // Validar campos requeridos
    if (!parametro.IdTrabajador || !parametro.IdVehiculoCarga || !parametro.RFIDAsignado) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            text: 'Por favor complete todos los campos requeridos',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    PostMVC('/VehiculoCarga/SaveOrUpdateRFIDCarga', parametro, function (r) {
        if (r.IsSuccess) {
            Swal.fire({
                title: "Registro guardado!",
                text: "El registro se ha guardado correctamente.",
                icon: "success",
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/VehiculoCarga/RFIDCarga';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar los datos: ' + (r.ErrorMessage || 'Error desconocido'),
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function GetAllEmpleados(callback) {
    GetMVC("/Empleado/GetAllEmpleados", function (r) {
        if (r.IsSuccess) {
            empleados = r.Response;
            if (callback) callback();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los Empleados: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function GetAllVehiculosCarga(callback) {
    GetMVC("/VehiculoCarga/GetAllVehiculoCarga", function (r) {
        if (r.IsSuccess) {
            vehiculosCarga = r.Response;
            if (callback) callback();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los Vehiculos de Carga: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Configurar el evento click del botón guardar sin usar onclick en HTML
$(document).ready(function () {
    $("#btnGuardar").off('click').on('click', function (e) {
        e.preventDefault();
        SaveOrUpdateRFIDCarga();
    });
});

document.getElementById("btnFiltrar").addEventListener("click", function () {

    var fechaInicio = $("#fechaInicio").val();
    var fechaFin = $("#fechaFin").val();

    if (fechaInicio > fechaFin) {
        alert("Por favor, seleccione una fecha valida.");
        return;
    }

    GetRFIDCargaByDates(fechaInicio, fechaFin);
});

function GetRFIDCargaByDates(fechaInicio, fechaFin) {
    PostMVC('/VehiculoCarga/GetRFIDCargaByDates', { fechaInicio: fechaInicio, fechaFin: fechaFin }, function (r, textStatus, jqXHR) {
        if (r.IsSuccess && Array.isArray(r.Response)) {
            const data = r.Response;
            const table = $('#tblRFIDCarga');

            // Destruir DataTable existente si existe
            if ($.fn.DataTable.isDataTable(table)) {
                table.DataTable().clear().destroy();
                table.empty(); // Limpiar la tabla para evitar duplicados
            }

            // Asegurar que la tabla tiene la estructura HTML correcta
            if (table.find('thead').length === 0) {
                table.append('<thead><tr></tr></thead>');
            }
            if (table.find('tbody').length === 0) {
                table.append('<tbody></tbody>');
            }

            table.DataTable({
                data: data,
                processing: true,
                destroy: true,
                paging: true,
                searching: true,
                columns: [
                    { data: "id", visible: false, title: "Id" },
                    {
                        data: "idTrabajador",
                        title: "Trabajador",
                        render: function (data) {
                            const empleado = empleados.find(e => e.id === data);
                            if (empleado) {
                                return `${empleado.nombre || ''} ${empleado.apellidoPaterno || ''} ${empleado.apellidoMaterno || ''}`.trim();
                            }
                            return "No asignado";
                        }
                    },
                    {
                        data: "idVehiculoCarga",
                        title: "Vehiculo de Carga",
                        render: function (data) {
                            const vehiculo = vehiculosCarga.find(e => e.id === data);
                            if (vehiculo) {
                                return `${vehiculo.descripcion}`.trim();
                            }
                            return "No asignado";
                        }
                    },
                    { data: "rfidAsignado", title: "RFID Asignado" },
                    {
                        data: "fechaHora",
                        title: "Fecha y Hora",
                        render: function (data) {
                            if (!data) return '';

                            // Si data es una cadena en formato ISO o similar
                            var fecha = new Date(data);

                            if (isNaN(fecha.getTime())) return data; // Si no es fecha válida, retorna el valor original

                            var dia = ('0' + fecha.getDate()).slice(-2);
                            var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
                            var year = fecha.getFullYear();
                            var horas = ('0' + fecha.getHours()).slice(-2);
                            var minutos = ('0' + fecha.getMinutes()).slice(-2);
                            var segundos = ('0' + fecha.getSeconds()).slice(-2);

                            return dia + '/' + mes + '/' + year + ' ' + horas + ':' + minutos + ':' + segundos;
                        }
                    },
                    {
                        data: "estatus",
                        title: "Estatus",
                        render: function (data) {
                            return data == 1 ? "Activo" : "Inactivo";
                        },
                        visible: false
                    },
                    {
                        data: "devuelto",
                        title: "Estatus de RFID",
                        render: function (data, type, row) {
                            // data es el valor de devuelto (0 = no devuelto, 1 = devuelto)
                            if (data == 1) {
                                // Si ya está devuelto, mostrar mensaje en rojo
                                return '<span class="badge badge-danger" style="background-color: #dc3545; color: white; padding: 8px 12px; border-radius: 4px;">YA DEVUELTO</span>';
                            } else {
                                // Si no está devuelto, mostrar el botón
                                return '<input type="button" value="Devolver" class="btn btn-success btn-lg-custom" onclick="DevueltoRFIDCarga(' + row.id + ')"/>';
                            }
                        }
                    },
                    {
                        data: "id",
                        title: "Acciones",
                        render: function (data, type, row) {
                            // Verificar el valor de devuelto desde la fila actual
                            let botones = '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRFIDCarga(' + data + ')" />' +
                                ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRFIDCarga(' + data + ')"/>';

                            // Si devuelto = 1 (ya está devuelto), mostrar el botón NoDevuelto
                            if (row.devuelto == 1) {
                                botones += ' <input type="button" value="No Devuelto" class="btn btn-success btn-lg-custom" onclick="NoDevueltoRFIDCarga(' + data + ')" />';
                            }

                            return botones;
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
        }
    });
}

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});
document.getElementById("btnGenerarExcel").addEventListener("click", function () {
    generarReporteExcel();
});

function generarReportePDF() {
    try {
        if (!$.fn.DataTable.isDataTable("#tblRFIDCarga")) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla no inicializada',
                text: 'La tabla de Historico RFID no está inicializada o no existe'
            });
            return;
        }

        const table = $("#tblRFIDCarga").DataTable();

        const totalRows = table.rows().count();
        const datosHistoricoRFID = table.rows().data().toArray();

        if (totalRows === 0 || datosHistoricoRFID.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla vacia',
                text: 'No hay registros en la tabla para generar el reporte PDF',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        const fechaInicio = $("#fechaInicio").val();
        const fechaFin = $("#fechaFin").val();
        const username = $("#userName").val();
        const now = new Date();
        const fechaGeneracion = now.toLocaleDateString('es-MX') + ', ' + now.toLocaleTimeString('es-MX');

        // Calcular estadísticas
        const totalRegistros = datosHistoricoRFID.length;
        const activos = datosHistoricoRFID.filter(item => item.estatus == 1).length;
        const inactivos = datosHistoricoRFID.filter(item => item.estatus == 0).length;
        const rfidDevueltos = datosHistoricoRFID.filter(item => item.devuelto == 1).length;
        const rfidPendientes = datosHistoricoRFID.filter(item => item.devuelto == 0).length;

        // Obtener trabajadores únicos
        const trabajadoresUnicos = new Set();
        datosHistoricoRFID.forEach(item => {
            if (item.idTrabajador) {
                const empleado = empleados.find(e => e.id === item.idTrabajador);
                if (empleado) {
                    const nombreCompleto = `${empleado.nombre || ''} ${empleado.apellidoPaterno || ''} ${empleado.apellidoMaterno || ''}`.trim();
                    trabajadoresUnicos.add(nombreCompleto);
                }
            }
        });

        // Obtener vehículos únicos
        const vehiculosUnicos = new Set();
        datosHistoricoRFID.forEach(item => {
            if (item.idVehiculoCarga) {
                const vehiculo = vehiculosCarga.find(e => e.id === item.idVehiculoCarga);
                if (vehiculo) {
                    vehiculosUnicos.add(vehiculo.descripcion.trim());
                }
            }
        });

        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Historico RFID</title>
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
                    .estadisticas-container {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 15px;
                        margin: 20px 0;
                    }
                    .estadistica-card {
                        flex: 1 1 calc(25% - 15px);
                        min-width: 180px;
                        padding: 15px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        background-color: #f8f9fa;
                        text-align: center;
                    }
                    .estadistica-card h3 {
                        margin: 0 0 10px 0;
                        font-size: 14px;
                        color: #2c3e50;
                    }
                    .estadistica-card .numero {
                        font-size: 24px;
                        font-weight: bold;
                        color: #34495e;
                    }
                    .estadistica-card.total { background-color: #e8f4f8; border-left: 4px solid #3498db; }
                    .estadistica-card.activos { background-color: #e8f8e8; border-left: 4px solid #27ae60; }
                    .estadistica-card.inactivos { background-color: #f8e8e8; border-left: 4px solid #e74c3c; }
                    .estadistica-card.devueltos { background-color: #f8f0e8; border-left: 4px solid #e67e22; }
                    .estadistica-card.pendientes { background-color: #f0e8f8; border-left: 4px solid #9b59b6; }
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
                    .badge {
                        padding: 8px 12px;
                        border-radius: 4px;
                        color: white;
                        font-weight: bold;
                        display: inline-block;
                    }
                    .badge-danger { background-color: #dc3545; }
                </style>
            </head>
            <body>
                <h1>Reporte de Historico RFID</h1>
                <div class="header-info">
                    <p><strong>Fecha de Inicio:</strong> ${fechaInicio || 'No especificada'}</p>
                    <p><strong>Fecha de Fin:</strong> ${fechaFin || 'No especificada'}</p>
                    <p><strong>Usuario:</strong> ${username || 'No especificado'}</p>
                    <p><strong>Fecha de Generacion:</strong> ${fechaGeneracion}</p>
                </div>
        `;

        // Crear tabla HTML manualmente
        htmlContent += `
            <div class="tabla-contenedor">
                <h2 class="tabla-titulo">Registros de Historico RFID</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Trabajador</th>
                            <th>Vehiculo de Carga</th>
                            <th>RFID Asignado</th>
                            <th>Fecha y Hora</th>
                            <th>Estatus de RFID</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        // Agregar filas con los datos del DataTable
        datosHistoricoRFID.forEach(row => {
            // Obtener nombre del trabajador
            let nombreTrabajador = "No asignado";
            if (row.idTrabajador) {
                const empleado = empleados.find(e => e.id === row.idTrabajador);
                if (empleado) {
                    nombreTrabajador = `${empleado.nombre || ''} ${empleado.apellidoPaterno || ''} ${empleado.apellidoMaterno || ''}`.trim();
                }
            }

            // Obtener descripción del vehículo
            let descripcionVehiculo = "No asignado";
            if (row.idVehiculoCarga) {
                const vehiculo = vehiculosCarga.find(e => e.id === row.idVehiculoCarga);
                if (vehiculo) {
                    descripcionVehiculo = vehiculo.descripcion.trim();
                }
            }

            // Formatear fecha
            let fechaFormateada = row.fechaHora || '';
            if (row.fechaHora) {
                const fecha = new Date(row.fechaHora);
                if (!isNaN(fecha.getTime())) {
                    const dia = ('0' + fecha.getDate()).slice(-2);
                    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
                    const year = fecha.getFullYear();
                    const horas = ('0' + fecha.getHours()).slice(-2);
                    const minutos = ('0' + fecha.getMinutes()).slice(-2);
                    const segundos = ('0' + fecha.getSeconds()).slice(-2);
                    fechaFormateada = `${dia}/${mes}/${year} ${horas}:${minutos}:${segundos}`;
                }
            }

            // Estatus del registro
            const estatusTexto = row.estatus == 1 ? "Activo" : "Inactivo";

            // Estatus del RFID
            let estatusRFID = '';
            if (row.devuelto == 1) {
                estatusRFID = '<span class="badge badge-danger">DEVUELTO</span>';
            } else {
                estatusRFID = 'PENDIENTE';
            }

            htmlContent += `
                <tr>
                    <td>${row.id || ''}</td>
                    <td>${nombreTrabajador}</td>
                    <td>${descripcionVehiculo}</td>
                    <td>${row.rfidAsignado || ''}</td>
                    <td>${fechaFormateada}</td>
                    <td style="text-align: center;">${estatusRFID}</td>
                </tr>
            `;
        });

        htmlContent += `
                    </tbody>
                </table>
            </div>
        `;

        // Agregar resumen final
        htmlContent += `
            <div class="total">
                Resumen: ${totalRegistros} registros totales | 
                Activos: ${activos} | 
                Inactivos: ${inactivos} | 
                RFID Devueltos: ${rfidDevueltos} | 
                RFID Pendientes: ${rfidPendientes}
            </div>
        `;

        htmlContent += `</body></html>`;

        // Mostrar mensaje de carga
        Swal.fire({
            title: "Generando reporte...",
            html: `
                <div style="text-align: center;">
                    <p>Procesando ${datosHistoricoRFID.length} registros</p>
                    <p>Por favor espere...</p>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();

                // Enviar al controlador después de un breve retraso
                setTimeout(() => {
                    enviarDatosParaPDF(htmlContent, fechaInicio, fechaFin, username, datosHistoricoRFID);
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

function enviarDatosParaPDF(htmlContent, fechaInicio, fechaFin, userName, datosHistoricoRFID) {
    try {
        // Crear formulario para enviar los datos al servidor
        var form = $('<form>', {
            method: 'POST',
            action: '/Pdf/GenerarReporteHistoricoRFID', // Cambia esta ruta según tu controlador
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
            name: 'fechaInicio',
            value: fechaInicio || ''
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'fechaFin',
            value: fechaFin || ''
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'userName',
            value: userName || ''
        }).appendTo(form);

        // Agregar los datos como JSON
        $('<input>').attr({
            type: 'hidden',
            name: 'datosHistoricoRFID',
            value: JSON.stringify(datosHistoricoRFID || [])
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
                text: 'El PDF se esta descargando',
                timer: 3000,
                showConfirmButton: false
            });
        }, 1000);

    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo enviar el formulario para generar el PDF'
        });
    }
}

function generarReporteExcel() {
    try {
        // Verificar si la tabla existe y tiene datos
        if (!$.fn.DataTable.isDataTable("#tblRFIDCarga")) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla no inicializada',
                text: 'La tabla de Histórico RFID no está inicializada o no existe'
            });
            return;
        }

        // Obtener la instancia de DataTable
        const table = $("#tblRFIDCarga").DataTable();

        // Verificar si hay datos
        const totalRows = table.rows().count();
        const datosRFIDCarga = table.rows().data().toArray();

        if (totalRows === 0 || datosRFIDCarga.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Tabla vacía',
                text: 'No hay registros en la tabla para generar el reporte Excel',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        // Obtener información adicional
        const fechaInicio = $("#fechaInicio").val();
        const fechaFin = $("#fechaFin").val();
        const userName = $("#userName").val();

        // Mostrar mensaje de carga
        Swal.fire({
            title: "Generando Excel...",
            html: `
                <div style="text-align: center;">
                    <p>Procesando ${datosRFIDCarga.length} registros</p>
                    <p>Por favor espere...</p>
                </div>
            `,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();

                // Crear tabla HTML para enviar al servidor
                crearTablaHTMLParaExcel(datosRFIDCarga, fechaInicio, fechaFin, userName);
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

function crearTablaHTMLParaExcel(datosRFIDCarga, fechaInicio, fechaFin, userName) {
    try {
        // Crear tabla HTML manualmente con estructura simple
        let tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse;">';

        // Encabezados (sin columna de Estatus)
        tablaHTML += '<thead><tr>';
        tablaHTML += '<th>ID</th>';
        tablaHTML += '<th>TRABAJADOR</th>';
        tablaHTML += '<th>VEHÍCULO DE CARGA</th>';
        tablaHTML += '<th>RFID ASIGNADO</th>';
        tablaHTML += '<th>FECHA Y HORA</th>';
        tablaHTML += '<th>ESTADO RFID</th>';
        tablaHTML += '</tr></thead>';

        // Datos
        tablaHTML += '<tbody>';

        datosRFIDCarga.forEach(row => {
            // Obtener nombre del trabajador
            let nombreTrabajador = "No asignado";
            if (row.idTrabajador) {
                const empleado = empleados.find(e => e.id === row.idTrabajador);
                if (empleado) {
                    nombreTrabajador = `${empleado.nombre || ''} ${empleado.apellidoPaterno || ''} ${empleado.apellidoMaterno || ''}`.trim();
                }
            }

            // Obtener descripción del vehículo
            let descripcionVehiculo = "No asignado";
            if (row.idVehiculoCarga) {
                const vehiculo = vehiculosCarga.find(e => e.id === row.idVehiculoCarga);
                if (vehiculo) {
                    descripcionVehiculo = vehiculo.descripcion.trim();
                }
            }

            // Formatear fecha
            let fechaFormateada = row.fechaHora || '';
            if (row.fechaHora) {
                const fecha = new Date(row.fechaHora);
                if (!isNaN(fecha.getTime())) {
                    const dia = ('0' + fecha.getDate()).slice(-2);
                    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
                    const year = fecha.getFullYear();
                    const horas = ('0' + fecha.getHours()).slice(-2);
                    const minutos = ('0' + fecha.getMinutes()).slice(-2);
                    const segundos = ('0' + fecha.getSeconds()).slice(-2);
                    fechaFormateada = `${dia}/${mes}/${year} ${horas}:${minutos}:${segundos}`;
                }
            }

            // Estatus del RFID
            const estatusRFID = row.devuelto == 1 ? "DEVUELTO" : "PENDIENTE";

            tablaHTML += '<tr>';
            tablaHTML += `<td>${row.id || ''}</td>`;
            tablaHTML += `<td>${nombreTrabajador}</td>`;
            tablaHTML += `<td>${descripcionVehiculo}</td>`;
            tablaHTML += `<td>${row.rfidAsignado || ''}</td>`;
            tablaHTML += `<td>${fechaFormateada}</td>`;
            tablaHTML += `<td>${estatusRFID}</td>`;
            tablaHTML += '</tr>';
        });

        tablaHTML += '</tbody></table>';

        // Enviar al servidor con todos los parámetros
        enviarDatosParaExcel(tablaHTML, fechaInicio, fechaFin, userName, datosRFIDCarga.length);

    } catch (error) {
        Swal.close();
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al preparar datos para Excel: ' + error.message
        });
    }
}

function enviarDatosParaExcel(tablaHTML, fechaInicio, fechaFin, userName, totalRegistros) {
    try {
        // Crear formulario para enviar los datos al servidor
        var form = $('<form>', {
            method: 'POST',
            action: '/Excel/GenerarReporteRFIDExcel' // Cambia esta ruta según tu controlador
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
            name: 'fechaInicio',
            value: fechaInicio || ''
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'fechaFin',
            value: fechaFin || ''
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'userName',
            value: userName || ''
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'totalRegistros',
            value: totalRegistros || 0
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

function buscarRFID(rfid) {
    $.ajax({
        url: '/VehiculoCarga/GetRFIDCargaByRFID',
        type: 'GET',
        data: { rfid: rfid },
        dataType: 'json',
        contentType: "application/json",
        success: function (r) {
            if (r.IsSuccess) {
                var data = r.Response;

                if (data.devuelto != true) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'RFID no devuelto',
                        text: 'Este RFID no ha sido devuelto por lo cual no puede ser utilizado.',
                        confirmButtonText: 'Aceptar'
                    });

                    // Deshabilitar el botón de guardar
                    $('#btnGuardar').prop('disabled', true);
                    return;
                } else {
                    // Si es devuelto, habilitar el botón (por si estaba deshabilitado)
                    $('#btnGuardar').prop('disabled', false);
                }
            } else {
                // manejar error
            }
        }
    });
}