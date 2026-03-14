$(document).ready(function () {
   
    // Cargar todos los datos necesarios
    GetAllVehiculoActivos();
    GetAllVehiculoCarga();
    GetAllEmpleados();
    GetAllReparacionVehiculos();
    GetAllRegistersVehiculos();
    GetAllRegistersVehiculoCarga();

    // Evento change para el select de tipo de vehículo
    $('#ddlTiposVehiculos').on('change', function () {
        var tipoSeleccionado = $(this).val();
        llenarSelectVehiculo(tipoSeleccionado);
    });

    $('#frmReparacionVehiculos').on('submit', function (e) {
        e.preventDefault();
        SaveOrUpdateReparacionVehiculos();
    });
    
    // Para edición, asegurar que el vehículo se seleccione correctamente
    if (!esNuevoRegistro && modeloEdicion && modeloEdicion.Id > 0) {
        // Bloquear campos inmediatamente
        $('#ddlTiposVehiculos').prop('disabled', true);
        $('#recibido').prop('disabled', true);
        
        // Esperar a que se carguen TODOS los datos necesarios
        var checkInterval = setInterval(function() {
            if ((vehiculosLocalesTodos && vehiculosLocalesTodos.length > 0) || 
                (vehiculosCargaTodos && vehiculosCargaTodos.length > 0)) {
                clearInterval(checkInterval);
                inicializarFormularioEdicion();
            }
        }, 200);
    }
});

// Variables globales
let vehiculosLocalesTodos = [];      // para la tabla (todos los registros)
let vehiculosLocalesActivos = [];    // para el select (solo activos)
let vehiculosCargaTodos = [];        // para la tabla (todos los registros)
let vehiculosCargaActivos = [];      // para el select (solo activos)
let empleados = [];
let reparaciones = [];

// -------------------- CARGA DE DATOS --------------------

function GetAllRegistersVehiculos() {
    GetMVC("/Taller/GetAllRegistersVehiculos", function (r) {
        if (r.IsSuccess) {
            vehiculosLocalesTodos = r.Response;

            // Si estamos en edición y ya tenemos los activos, inicializar
            if (!esNuevoRegistro && modeloEdicion && vehiculosLocalesActivos.length > 0) {
                inicializarFormularioEdicion();
            }

            verificarYInicializarTabla();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los vehículos viajes locales: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function GetAllRegistersVehiculoCarga() {
    GetMVC("/VehiculoCarga/GetAllRegistersVehiculoCarga", function (r) {
        if (r.IsSuccess) {
            vehiculosCargaTodos = r.Response;

            // Si estamos en edición y ya tenemos los activos, inicializar
            if (!esNuevoRegistro && modeloEdicion && vehiculosCargaActivos.length > 0) {
                inicializarFormularioEdicion();
            }

            verificarYInicializarTabla();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los vehículos de carga: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function GetAllVehiculoActivos() {
    GetMVC("/Taller/GetAllVehiculo", function (r) {
        if (r.IsSuccess) {
            vehiculosLocalesActivos = r.Response;
            // Si estamos en edición y ya tenemos los datos de todos los vehículos, inicializar
            if (!esNuevoRegistro && modeloEdicion && vehiculosLocalesTodos.length > 0) {
                inicializarFormularioEdicion();
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los vehículos viajes locales activos: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function GetAllVehiculoCarga() {
    GetMVC("/VehiculoCarga/GetAllVehiculoCarga", function (r) {
        if (r.IsSuccess) {
            if (r.Response && typeof r.Response === 'string') {
                r.Response = JSON.parse(r.Response);
            }
            vehiculosCargaActivos = r.Response;
            // Si estamos en edición y ya tenemos los datos de todos los vehículos, inicializar
            if (!esNuevoRegistro && modeloEdicion && vehiculosCargaTodos.length > 0) {
                inicializarFormularioEdicion();
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los vehículos de carga: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function GetAllEmpleados() {
    GetMVC("/Empleado/GetAllEmpleados", function (r) {
        if (r.IsSuccess) {
            empleados = r.Response;
            verificarYInicializarTabla();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los empleados: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function GetAllReparacionVehiculos() {
    GetMVC("/Taller/GetAllReparacionVehiculos", function (r) {
        if (r.IsSuccess) {
            reparaciones = r.Response;
            verificarYInicializarTabla();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar datos de ReparacionVehiculos: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// -------------------- INICIALIZACIÓN DE TABLA --------------------

function verificarYInicializarTabla() {
    // Esperamos a que todos los datos para la tabla estén listos
    if (vehiculosLocalesTodos !== null && vehiculosCargaTodos !== null && empleados !== null && reparaciones !== null) {
        inicializarTablaReparaciones();
    }
}

function inicializarTablaReparaciones() {
    if ($.fn.DataTable.isDataTable('#tblAllRegistersReparacionVehiculos')) {
        $('#tblAllRegistersReparacionVehiculos').DataTable().destroy();
    }
    if ($.fn.DataTable.isDataTable('#tblReparacionVehiculos')) {
        $('#tblReparacionVehiculos').DataTable().destroy();
    }

    $("#tblAllRegistersReparacionVehiculos").DataTable({
        data: reparaciones,
        columns: [
            { data: 'id', title: 'ID', visible: false },
            {
                data: 'tipoVehiculo',
                title: 'Tipo de vehiculo',
                render: function (data) {
                    if (data == 1) return '<span>Viajes Locales</span>';
                    if (data == 2) return '<span>Vehiculo de Carga</span>';
                    return '<span>Sin Categoría</span>';
                }
            },
            {
                data: null,
                title: 'Vehiculo',
                render: function (data, type, row) {
                    if (row.tipoVehiculo == 1) {
                        // Buscar en TODOS los vehículos locales (incluye inactivos)
                        const vehiculo = vehiculosLocalesTodos.find(v => v.id == row.idVehiculo);
                        if (vehiculo) {
                            const tipoNombre = vehiculo.tipoVehiculo?.nombre || 'Sin tipo';
                            return `${tipoNombre}, ${vehiculo.color || 'Sin color'} (${vehiculo.placa})`;
                        }
                        return `Vehículo Local ID: ${row.idVehiculo} (no encontrado)`;
                    }
                    else if (row.tipoVehiculo == 2) {
                        // Buscar en TODOS los vehículos de carga (incluye inactivos)
                        const vehiculo = vehiculosCargaTodos.find(v => v.id == row.idVehiculo);
                        return vehiculo ? (vehiculo.descripcion || 'Sin descripción') : `Vehículo Carga ID: ${row.idVehiculo} (no encontrado)`;
                    }
                    return `ID: ${row.idVehiculo}`;
                }
            },
            {
                data: null,
                title: 'Empleado',
                render: function (data, type, row) {
                    const empleado = empleados.find(e => e.id == row.idEmpleado);
                    if (empleado) {
                        return `${empleado.nombre || ''} ${empleado.apellido || ''}`.trim() || 'Nombre no disponible';
                    }
                    return `Empleado ID: ${row.idEmpleado} (no encontrado)`;
                }
            },
            {
                data: 'tipoServicio',
                title: 'Tipo de servicio',
                render: function (data) {
                    if (data == 1) return '<span>Preventivo</span>';
                    if (data == 2) return '<span>Correctivo</span>';
                    return '<span>Sin Categoría</span>';
                }
            },
            { data: 'recibio', title: 'Recibio' },
            {
                data: 'fecha',
                title: 'Fecha y Hora',
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
                data: 'estado',
                title: 'Estado',
                render: function (data) {
                    const estados = {
                        1: { color: '#28a745', texto: 'Activo' },
                        2: { color: '#ffc107', texto: 'En Proceso' },
                        3: { color: '#dc3545', texto: 'Terminado' },
                        4: { color: '#007bff', texto: 'Liberado' }
                    };
                    const e = estados[data] || { color: '#6c757d', texto: 'Desconocido' };
                    return `<span style="display: flex; align-items: center;"><span style="display: inline-block; width: 12px; height: 12px; background-color: ${e.color}; border-radius: 50%; margin-right: 8px;"></span>${e.texto}</span>`;
                }
            },
            {
                data: "id",
                title: "Asignar",
                render: function (data, type, row) {
                    if (row.estado != 4) {
                        return `<input type="button" value="Asignar Piezas" class="btn btn-success btn-lg-custom" onclick="AbrirModalComponente(${data})" />`;
                    } else {
                        return '';
                    }
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data, type, row) {
                    // Si el estado es 3, mostramos el botón Liberar
                    if (row.estado == 3) {
                        return `<input type="button" value="Liberar Vehiculo" class="btn btn-primary" style="background-color: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;" onclick="LiberarVehiculo(${data}, ${row.idVehiculo}, ${row.tipoVehiculo})" />`;
                    }
                    // Si el estado es 4, mostramos solo el texto "Liberado" sin botón
                    else if (row.estado == 4) {
                        return ''; // o un guión
                    }
                    return '';
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

    $("#tblReparacionVehiculos").DataTable({
        data: reparaciones,
        columns: [
            { data: 'id', title: 'ID', visible: false },
            {
                data: 'tipoVehiculo',
                title: 'Tipo de vehiculo',
                render: function (data) {
                    if (data == 1) return '<span>Viajes Locales</span>';
                    if (data == 2) return '<span>Vehiculo de Carga</span>';
                    return '<span>Sin Categoría</span>';
                }
            },
            {
                data: null,
                title: 'Vehiculo',
                render: function (data, type, row) {
                    if (row.tipoVehiculo == 1) {
                        // Buscar en TODOS los vehículos locales (incluye inactivos)
                        const vehiculo = vehiculosLocalesTodos.find(v => v.id == row.idVehiculo);
                        if (vehiculo) {
                            const tipoNombre = vehiculo.tipoVehiculo?.nombre || 'Sin tipo';
                            return `${tipoNombre}, ${vehiculo.color || 'Sin color'} (${vehiculo.placa})`;
                        }
                        return `Vehículo Local ID: ${row.idVehiculo} (no encontrado)`;
                    }
                    else if (row.tipoVehiculo == 2) {
                        // Buscar en TODOS los vehículos de carga (incluye inactivos)
                        const vehiculo = vehiculosCargaTodos.find(v => v.id == row.idVehiculo);
                        return vehiculo ? (vehiculo.descripcion || 'Sin descripción') : `Vehículo Carga ID: ${row.idVehiculo} (no encontrado)`;
                    }
                    return `ID: ${row.idVehiculo}`;
                }
            },
            {
                data: null,
                title: 'Empleado',
                render: function (data, type, row) {
                    const empleado = empleados.find(e => e.id == row.idEmpleado);
                    if (empleado) {
                        return `${empleado.nombre || ''} ${empleado.apellido || ''}`.trim() || 'Nombre no disponible';
                    }
                    return `Empleado ID: ${row.idEmpleado} (no encontrado)`;
                }
            },
            {
                data: 'tipoServicio',
                title: 'Tipo de servicio',
                render: function (data) {
                    if (data == 1) return '<span>Preventivo</span>';
                    if (data == 2) return '<span>Correctivo</span>';
                    return '<span>Sin Categoría</span>';
                }
            },
            { data: 'recibio', title: 'Recibio' },
            {
                data: 'fecha',
                title: 'Fecha y Hora',
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
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRegistro(' + data + ', this)" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRegistro(' + data + ', ' + row.idVehiculo + ', ' + row.tipoVehiculo + ')" />';
                },
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

// -------------------- FUNCIONES PARA EL FORMULARIO --------------------

function llenarSelectVehiculo(tipoVehiculo) {
    var $selectVehiculo = $('#ddlVehiculo');
    $selectVehiculo.empty();

    $selectVehiculo.append('<option value="" disabled selected>Selecciona un Vehiculo</option>');

    var datosVehiculos = [];

    // Determinar qué lista usar según si estamos en edición o no
    if (!esNuevoRegistro) {
        // En MODO EDICIÓN: usar TODOS los vehículos (incluyendo inactivos)
        if (tipoVehiculo == 1) {
            datosVehiculos = vehiculosLocalesTodos || []; // Usar TODOS los vehículos locales
        } else if (tipoVehiculo == 2) {
            datosVehiculos = vehiculosCargaTodos || []; // Usar TODOS los vehículos de carga
        } else {
            return;
        }
    } else {
        // En NUEVO REGISTRO: usar solo ACTIVOS
        if (tipoVehiculo == 1) {
            datosVehiculos = vehiculosLocalesActivos || [];
        } else if (tipoVehiculo == 2) {
            datosVehiculos = vehiculosCargaActivos || [];
        } else {
            return;
        }
    }

    $.each(datosVehiculos, function (index, vehiculo) {
        var optionValue = vehiculo.id;
        var optionText = '';

        if (tipoVehiculo == 1) {
            var tipoNombre = (vehiculo.tipoVehiculo && vehiculo.tipoVehiculo.nombre) ? vehiculo.tipoVehiculo.nombre : 'Sin tipo';
            optionText = tipoNombre + ', ' + (vehiculo.color || 'Sin color') + ' (' + vehiculo.placa + ')';

            // Agregar indicador si el vehículo está inactivo (solo en edición)
            if (!esNuevoRegistro && vehiculo.estatus === 0) {
                optionText += ' [INACTIVO]';
            }
        } else if (tipoVehiculo == 2) {
            optionText = vehiculo.descripcion || 'Sin descripción';

            // Agregar indicador si el vehículo está inactivo (solo en edición)
            if (!esNuevoRegistro && vehiculo.estatus === 0) {
                optionText += ' [INACTIVO]';
            }
        }

        $selectVehiculo.append('<option value="' + optionValue + '">' + optionText + '</option>');
    });
}

function SaveOrUpdateReparacionVehiculos() {
    // Validar que los campos requeridos tengan valor
    if ($("#ddlTiposVehiculos").val() === "" || $("#ddlTiposVehiculos").val() === null) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor seleccione un tipo de vehículo',
            confirmButtonText: 'Aceptar'
        });
        return false;
    }

    if ($("#ddlVehiculo").val() === "" || $("#ddlVehiculo").val() === null) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor seleccione un vehículo',
            confirmButtonText: 'Aceptar'
        });
        return false;
    }

    if ($("#ddlEmpleados").val() === "" || $("#ddlEmpleados").val() === null) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor seleccione un empleado',
            confirmButtonText: 'Aceptar'
        });
        return false;
    }

    if ($("#ddlTipoServicio").val() === "" || $("#ddlTipoServicio").val() === null) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor seleccione un tipo de servicio',
            confirmButtonText: 'Aceptar'
        });
        return false;
    }


    // Preparar el parámetro
    var id = parseInt($("#id").val()) || 0;
    var tipoVehiculo = parseInt($("#ddlTiposVehiculos").val());
    var idVehiculo = parseInt($("#ddlVehiculo").val());
    var idEmpleado = parseInt($("#ddlEmpleados").val());
    var tipoServicio = parseInt($("#ddlTipoServicio").val());

    var parametro = {
        Id: id,
        Fecha: $("#fecha").val(),
        TipoVehiculo: tipoVehiculo,
        IdVehiculo: idVehiculo,
        IdEmpleado: idEmpleado,
        TipoServicio: tipoServicio,
        Recibio: $("#recibido").val(),
        Estado: 1,
        Estatus: 1,
        CreatedBy: $("#createdBy").val(),
        CreatedDt: $("#createdDt").val(),
        UpdatedBy: $("#updatedBy").val(),
        UpdatedDt: $("#updatedDt").val()
    };

    PostMVC('/Taller/SaveOrUpdateReparacionVehiculos', parametro, function (r) {
        Swal.close();

        // Verificar la respuesta
        if (r && r.IsSuccess) {
            Swal.fire({
                title: "Registro guardado!",
                text: "El registro se ha guardado correctamente.",
                icon: "success",
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = "/Taller/ReparacionVehiculos";
            });
        } else {
            Swal.fire({
                title: "Registro guardado!",
                text: "El registro se ha guardado correctamente.",
                icon: "success",
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = "/Taller/ReparacionVehiculos";
            });
        }
    });
}

// Función para editar un registro
function EditarRegistro(id, element) {
    // Obtener la fila completa (el tr) del botón clickeado
    var row = $(element).closest('tr');

    // Obtener los datos de la fila usando DataTable
    var table = $('#tblReparacionVehiculos').DataTable();
    var rowData = table.row(row).data();
    // Redirigir a la página de edición con el ID
    location.href = "/Taller/ReparacionVehiculos/" + id;
}

// Función EliminarRegistro
function EliminarRegistro(id, idVehiculo, tipoVehiculo) {
    Swal.fire({
        title: 'Eliminar Registro',
        text: "Desea eliminar el siguiente registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = {
                Id: id,
                IdVehiculo: idVehiculo,
                TipoVehiculo: tipoVehiculo
            };

            PostMVC('/Taller/DeleteReparacionVehiculosById', parametro, function (r) {
                if (r && r.IsSuccess) {
                    Swal.fire({
                        title: 'Eliminado',
                        text: 'El registro ha sido eliminado.',
                        icon: 'success'
                    }).then(() => {
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        title: 'Eliminado',
                        text: 'El registro ha sido eliminado.',
                        icon: 'success'
                    }).then(() => {
                        window.location.reload();
                    });
                }
            });
        }
    });
}

// Función para liberar vehículo (versión unificada)
function LiberarVehiculo(id, idVehiculo, tipoVehiculo) {
    Swal.fire({
        title: 'Liberar Vehiculo',
        text: "Deseas liberar este vehiculo?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, liberar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar loading
            Swal.fire({
                title: 'Procesando...',
                text: 'Liberando vehiculo',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            $.ajax({
                url: '/Taller/LiberarVehiculo',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    Id: id,
                    IdVehiculo: idVehiculo,
                    TipoVehiculo: tipoVehiculo
                }),
                success: function (response) {
                    Swal.close();

                    if (response && response.IsSuccess) {
                        Swal.fire({
                            title: 'Liberado!',
                            text: 'El vehiculo ha sido liberado correctamente.',
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire({
                            title: 'Liberado!',
                            text: 'El vehiculo ha sido liberado correctamente.',
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            window.location.reload();
                        });
                    }
                },
                error: function (xhr, status, error) {
                    Swal.close();

                    Swal.fire({
                        title: 'Error',
                        text: 'Error de conexión: ' + error,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}
// Intenta preseleccionar el vehículo si estamos en modo edición
function inicializarFormularioEdicion() {
    // Si no es nuevo registro y tenemos modelo
    if (!esNuevoRegistro && modeloEdicion && modeloEdicion.Id > 0) {

        // Bloquear campos que no deben editarse
        $('#ddlTiposVehiculos').prop('disabled', true);
        $('#ddlVehiculo').prop('disabled', true);
        $('#recibido').prop('disabled', true);

        var tipoSeleccionado = modeloEdicion.TipoVehiculo;
        if (tipoSeleccionado) {
            // Establecer el tipo de vehículo
            $('#ddlTiposVehiculos').val(tipoSeleccionado);

            // Llenar el select de vehículos (ahora usará TODOS los vehículos porque es modo edición)
            llenarSelectVehiculo(tipoSeleccionado);

            // Seleccionar los valores después de un breve retraso
            setTimeout(function () {
                $('#ddlVehiculo').val(modeloEdicion.IdVehiculo);
                $('#ddlEmpleados').val(modeloEdicion.IdEmpleado);
                $('#ddlTipoServicio').val(modeloEdicion.TipoServicio);
            }, 500);
        }
    }
}