let empleados = [];
let vehiculosCarga = []

$(document).ready(function () {
  
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
                }
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
                render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRFIDCarga(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRFIDCarga(' + data + ')"/>';
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
        text: "¿Estás seguro de eliminar este registro?",
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

function DevueltoRFIDCarga(id) {
    Swal.fire({
        title: 'Marcar como Devuelto',
        text: "¿Confirmas que el RFID ha sido devuelto?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, devuelto',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id, Estatus: 0 }; // Asumiendo que 0 = Inactivo/Devuelto

            PostMVC('/VehiculoCarga/DevueltoRFIDCarga', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Actualizado', 'El RFID ha sido marcado como devuelto.', 'success')
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
            console.log('Empleados cargados:', empleados.length);
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
            console.log('Vehiculos de carga cargados:', vehiculosCarga.length);
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

    if (fechaInicio < fechaFin) {
        alert("Por favor, seleccione una fecha válida.");
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
                        }
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
                        render: function (data) {
                            return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRFIDCarga(' + data + ')" />' +
                                ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRFIDCarga(' + data + ')"/>';
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