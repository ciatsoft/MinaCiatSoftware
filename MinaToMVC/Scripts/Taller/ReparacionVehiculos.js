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
        order: [[0, 'desc']],
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
                        return `<input type="button" value="Asignar Piezas" class="btn btn-success btn-lg-custom" onclick="resumenVehiculo(${data})" />`;
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
        order: [[0, 'desc']],
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

function resumenVehiculo(id) {
    location.href = "/Taller/ResumenReparacionVehiculo/" + id;
}

document.getElementById("btnFiltrar").addEventListener("click", function () {
    var fechaInicio = $("#fechaInicio").val();
    var fechaFin = $("#fechaFin").val();

    console.log(fechaInicio);
    console.log(fechaFin);

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
    ReparacionVehiculosByDates(fechaInicio, fechaFin);
});

function ReparacionVehiculosByDates(fechaInicio, fechaFin) {
    var parametro = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin
    };

    PostMVC('/Taller/ReparacionVehiculosByDates', parametro, function (r, textStatus, jqXHR) {
        if (r.IsSuccess && Array.isArray(r.Response)) {
            const data = r.Response;

            // ==================== TABLA 1: tblReparacionVehiculos ====================
            const table1 = $('#tblReparacionVehiculos');

            // Destruir DataTable existente si existe
            if ($.fn.DataTable.isDataTable(table1)) {
                table1.DataTable().clear().destroy();
                table1.empty();
            }

            // Asegurar que la tabla tiene la estructura HTML correcta
            if (table1.find('thead').length === 0) {
                table1.append('<thead></thead>');
            }
            if (table1.find('tbody').length === 0) {
                table1.append('<tbody></tbody>');
            }

            // Configurar DataTable para la tabla 1
            table1.DataTable({
                data: data,
                order: [[0, 'desc']],
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
                                const vehiculo = vehiculosLocalesTodos.find(v => v.id == row.idVehiculo);
                                if (vehiculo) {
                                    const tipoNombre = vehiculo.tipoVehiculo?.nombre || 'Sin tipo';
                                    return `${tipoNombre}, ${vehiculo.color || 'Sin color'} (${vehiculo.placa})`;
                                }
                                return `Vehículo Local ID: ${row.idVehiculo} (no encontrado)`;
                            }
                            else if (row.tipoVehiculo == 2) {
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
                    "zeroRecords": "No se encontraron resultados en el rango de fechas seleccionado",
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

            // ==================== TABLA 2: tblAllRegistersReparacionVehiculos ====================
            const table2 = $('#tblAllRegistersReparacionVehiculos');

            // Destruir DataTable existente si existe
            if ($.fn.DataTable.isDataTable(table2)) {
                table2.DataTable().clear().destroy();
                table2.empty();
            }

            // Asegurar que la tabla tiene la estructura HTML correcta
            if (table2.find('thead').length === 0) {
                table2.append('<thead></thead>');
            }
            if (table2.find('tbody').length === 0) {
                table2.append('<tbody></tbody>');
            }

            // Configurar DataTable para la tabla 2
            table2.DataTable({
                data: data,
                order: [[0, 'desc']],
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
                                const vehiculo = vehiculosLocalesTodos.find(v => v.id == row.idVehiculo);
                                if (vehiculo) {
                                    const tipoNombre = vehiculo.tipoVehiculo?.nombre || 'Sin tipo';
                                    return `${tipoNombre}, ${vehiculo.color || 'Sin color'} (${vehiculo.placa})`;
                                }
                                return `Vehículo Local ID: ${row.idVehiculo} (no encontrado)`;
                            }
                            else if (row.tipoVehiculo == 2) {
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
                                return `<input type="button" value="Asignar Piezas" class="btn btn-success btn-lg-custom" onclick="resumenVehiculo(${data})" />`;
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        data: "id",
                        title: "Acciones",
                        render: function (data, type, row) {
                            if (row.estado == 3) {
                                return `<input type="button" value="Liberar Vehiculo" class="btn btn-primary" style="background-color: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;" onclick="LiberarVehiculo(${data}, ${row.idVehiculo}, ${row.tipoVehiculo})" />`;
                            }
                            else if (row.estado == 4) {
                                return '';
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
                    "zeroRecords": "No se encontraron resultados en el rango de fechas seleccionado",
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

        } else {
            console.warn("No se recibieron datos válidos o la respuesta no fue exitosa:", r);

            // Limpiar ambas tablas si no hay datos
            const table1 = $('#tblReparacionVehiculos');
            const table2 = $('#tblAllRegistersReparacionVehiculos');

            if ($.fn.DataTable.isDataTable(table1)) {
                table1.DataTable().clear().destroy();
                table1.empty();
            }

            if ($.fn.DataTable.isDataTable(table2)) {
                table2.DataTable().clear().destroy();
                table2.empty();
            }

        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al cargar los datos filtrados',
            confirmButtonColor: '#3085d6'
        });
    });
}

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReporteReparacionVehiculosPDF();
});

function generarReporteReparacionVehiculosPDF() {
    // Obtener las tablas
    var tablaReparaciones = $('#tblReparacionVehiculos').DataTable();
    var tablaEstatus = $('#tblAllRegistersReparacionVehiculos').DataTable();

    var datosReparaciones = tablaReparaciones.data().toArray();
    var datosEstatus = tablaEstatus.data().toArray();

    if (datosReparaciones.length === 0 && datosEstatus.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay datos para exportar en el rango de fechas seleccionado',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Obtener las fechas del filtro
    var fechaInicio = $("#fechaInicio").val();
    var fechaFin = $("#fechaFin").val();

    // Mostrar loading
    Swal.fire({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Crear tabla HTML para el Listado General de Reparaciones (tabla1)
    var tablaReparacionesHTML = '';
    if (datosReparaciones.length > 0) {
        tablaReparacionesHTML = '<h2 style="color: #2c3e50; margin-top: 20px;">Listado General de Reparaciones</h2>';
        tablaReparacionesHTML += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:20px;">';
        tablaReparacionesHTML += '<thead>';
        tablaReparacionesHTML += '<tr>';
        tablaReparacionesHTML += '<th>ID</th>';
        tablaReparacionesHTML += '<th>Tipo de Vehiculo</th>';
        tablaReparacionesHTML += '<th>Vehiculo</th>';
        tablaReparacionesHTML += '<th>Empleado</th>';
        tablaReparacionesHTML += '<th>Tipo de Servicio</th>';
        tablaReparacionesHTML += '<th>Recibio</th>';
        tablaReparacionesHTML += '<th>Fecha y Hora</th>';
        tablaReparacionesHTML += '</tr>';
        tablaReparacionesHTML += '</thead>';
        tablaReparacionesHTML += '<tbody>';

        datosReparaciones.forEach(function (item) {
            var tipoVehiculo = item.tipoVehiculo == 1 ? 'Viajes Locales' : 'Vehiculo de Carga';
            var tipoServicio = item.tipoServicio == 1 ? 'Preventivo' : 'Correctivo';
            var fecha = '';
            if (item.fecha) {
                var fechaDate = new Date(item.fecha);
                fecha = fechaDate.toLocaleDateString('es-MX') + ' ' +
                    fechaDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            }

            // Obtener nombre del vehiculo
            var vehiculoTexto = '';
            if (item.tipoVehiculo == 1) {
                var vehiculo = vehiculosLocalesTodos.find(v => v.id == item.idVehiculo);
                if (vehiculo) {
                    var tipoNombre = vehiculo.tipoVehiculo?.nombre || 'Sin tipo';
                    vehiculoTexto = tipoNombre + ', ' + (vehiculo.color || 'Sin color') + ' (' + (vehiculo.placa || '') + ')';
                } else {
                    vehiculoTexto = 'Vehiculo ID: ' + item.idVehiculo;
                }
            } else if (item.tipoVehiculo == 2) {
                var vehiculo = vehiculosCargaTodos.find(v => v.id == item.idVehiculo);
                if (vehiculo) {
                    vehiculoTexto = vehiculo.descripcion || 'Sin descripcion';
                } else {
                    vehiculoTexto = 'Vehiculo ID: ' + item.idVehiculo;
                }
            }

            // Obtener nombre del empleado
            var empleadoTexto = '';
            var empleado = empleados.find(e => e.id == item.idEmpleado);
            if (empleado) {
                empleadoTexto = (empleado.nombre || '') + ' ' + (empleado.apellido || '');
                empleadoTexto = empleadoTexto.trim() || 'Nombre no disponible';
            } else {
                empleadoTexto = 'Empleado ID: ' + item.idEmpleado;
            }

            tablaReparacionesHTML += '<tr>';
            tablaReparacionesHTML += '<td>' + (item.id || '') + '</td>';
            tablaReparacionesHTML += '<td>' + tipoVehiculo + '</td>';
            tablaReparacionesHTML += '<td>' + vehiculoTexto + '</td>';
            tablaReparacionesHTML += '<td>' + empleadoTexto + '</td>';
            tablaReparacionesHTML += '<td>' + tipoServicio + '</td>';
            tablaReparacionesHTML += '<td>' + (item.recibio || '') + '</td>';
            tablaReparacionesHTML += '<td>' + fecha + '</td>';
            tablaReparacionesHTML += '</tr>';
        });
        tablaReparacionesHTML += '</tbody>';
        tablaReparacionesHTML += '</table>';
    } else {
        tablaReparacionesHTML = '<h2 style="color: #2c3e50; margin-top: 20px;">Listado General de Reparaciones</h2>';
        tablaReparacionesHTML += '<p style="color: #7f8c8d;">No hay registros en el rango de fechas seleccionado.</p>';
    }

    // Crear tabla HTML para Estatus y Asignacion de Refacciones (tabla2)
    var tablaEstatusHTML = '';
    if (datosEstatus.length > 0) {
        tablaEstatusHTML = '<h2 style="color: #2c3e50; margin-top: 20px;">Estatus y Asignacion de Refacciones</h2>';
        tablaEstatusHTML += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
        tablaEstatusHTML += '<thead>';
        tablaEstatusHTML += '<tr>';
        tablaEstatusHTML += '<th>ID</th>';
        tablaEstatusHTML += '<th>Tipo de Vehiculo</th>';
        tablaEstatusHTML += '<th>Vehiculo</th>';
        tablaEstatusHTML += '<th>Empleado</th>';
        tablaEstatusHTML += '<th>Tipo de Servicio</th>';
        tablaEstatusHTML += '<th>Recibio</th>';
        tablaEstatusHTML += '<th>Fecha y Hora</th>';
        tablaEstatusHTML += '<th>Estado</th>';
        tablaEstatusHTML += '</tr>';
        tablaEstatusHTML += '</thead>';
        tablaEstatusHTML += '<tbody>';

        datosEstatus.forEach(function (item) {
            var tipoVehiculo = item.tipoVehiculo == 1 ? 'Viajes Locales' : 'Vehiculo de Carga';
            var tipoServicio = item.tipoServicio == 1 ? 'Preventivo' : 'Correctivo';
            var fecha = '';
            if (item.fecha) {
                var fechaDate = new Date(item.fecha);
                fecha = fechaDate.toLocaleDateString('es-MX') + ' ' +
                    fechaDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
            }

            // Obtener nombre del vehiculo
            var vehiculoTexto = '';
            if (item.tipoVehiculo == 1) {
                var vehiculo = vehiculosLocalesTodos.find(v => v.id == item.idVehiculo);
                if (vehiculo) {
                    var tipoNombre = vehiculo.tipoVehiculo?.nombre || 'Sin tipo';
                    vehiculoTexto = tipoNombre + ', ' + (vehiculo.color || 'Sin color') + ' (' + (vehiculo.placa || '') + ')';
                } else {
                    vehiculoTexto = 'Vehiculo ID: ' + item.idVehiculo;
                }
            } else if (item.tipoVehiculo == 2) {
                var vehiculo = vehiculosCargaTodos.find(v => v.id == item.idVehiculo);
                if (vehiculo) {
                    vehiculoTexto = vehiculo.descripcion || 'Sin descripcion';
                } else {
                    vehiculoTexto = 'Vehiculo ID: ' + item.idVehiculo;
                }
            }

            // Obtener nombre del empleado
            var empleadoTexto = '';
            var empleado = empleados.find(e => e.id == item.idEmpleado);
            if (empleado) {
                empleadoTexto = (empleado.nombre || '') + ' ' + (empleado.apellido || '');
                empleadoTexto = empleadoTexto.trim() || 'Nombre no disponible';
            } else {
                empleadoTexto = 'Empleado ID: ' + item.idEmpleado;
            }

            var estadoTexto = '';
            switch (item.estado) {
                case 1: estadoTexto = 'Activo'; break;
                case 2: estadoTexto = 'En Proceso'; break;
                case 3: estadoTexto = 'Terminado'; break;
                case 4: estadoTexto = 'Liberado'; break;
                default: estadoTexto = 'Desconocido';
            }

            tablaEstatusHTML += '<tr>';
            tablaEstatusHTML += '<td>' + (item.id || '') + '</td>';
            tablaEstatusHTML += '<td>' + tipoVehiculo + '</td>';
            tablaEstatusHTML += '<td>' + vehiculoTexto + '</td>';
            tablaEstatusHTML += '<td>' + empleadoTexto + '</td>';
            tablaEstatusHTML += '<td>' + tipoServicio + '</td>';
            tablaEstatusHTML += '<td>' + (item.recibio || '') + '</td>';
            tablaEstatusHTML += '<td>' + fecha + '</td>';
            tablaEstatusHTML += '<td>' + estadoTexto + '</td>';
            tablaEstatusHTML += '</tr>';
        });
        tablaEstatusHTML += '</tbody>';
        tablaEstatusHTML += '</table>';
    } else {
        tablaEstatusHTML = '<h2 style="color: #2c3e50; margin-top: 20px;">Estatus y Asignacion de Refacciones</h2>';
        tablaEstatusHTML += '<p style="color: #7f8c8d;">No hay registros en el rango de fechas seleccionado.</p>';
    }

    // Crear formulario y enviar
    var form = $('<form>', {
        method: 'POST',
        action: '/PDF/GenerarReporteReparacionVehiculosPDF'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'fechaInicio',
        value: fechaInicio
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'fechaFin',
        value: fechaFin
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaReparacionesHTML',
        value: tablaReparacionesHTML
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaEstatusHTML',
        value: tablaEstatusHTML
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'totalRegistros',
        value: datosReparaciones.length
    }).appendTo(form);

    form.appendTo('body').submit();
    form.remove();

    // Cerrar el loading despues de enviar el formulario
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
document.getElementById("btnGenerarExcel").addEventListener("click", function () {
    generarReporteReparacionVehiculosExcel();
});

function generarReporteReparacionVehiculosExcel() {
    // Obtener las tablas
    var tablaReparaciones = $('#tblReparacionVehiculos').DataTable();
    var tablaEstatus = $('#tblAllRegistersReparacionVehiculos').DataTable();

    var datosReparaciones = tablaReparaciones.data().toArray();
    var datosEstatus = tablaEstatus.data().toArray();

    if (datosReparaciones.length === 0 && datosEstatus.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin datos',
            text: 'No hay datos para exportar en el rango de fechas seleccionado',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Obtener las fechas del filtro
    var fechaInicio = $("#fechaInicio").val();
    var fechaFin = $("#fechaFin").val();

    // Mostrar loading
    Swal.fire({
        title: "Generando Excel...",
        text: "Por favor espere mientras se genera el archivo Excel",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Calcular estadisticas
    var estadisticas = calcularEstadisticas(datosReparaciones, datosEstatus);

    // Crear array de datos para el Listado General de Reparaciones (tabla1)
    var datosReparacionesArray = [];
    datosReparaciones.forEach(function (item) {
        var tipoVehiculo = item.tipoVehiculo == 1 ? 'Viajes Locales' : 'Vehiculo de Carga';
        var tipoServicio = item.tipoServicio == 1 ? 'Preventivo' : 'Correctivo';

        var vehiculoTexto = obtenerNombreVehiculo(item.tipoVehiculo, item.idVehiculo);
        var empleadoTexto = obtenerNombreEmpleado(item.idEmpleado);

        var fecha = '';
        if (item.fecha) {
            var fechaDate = new Date(item.fecha);
            fecha = fechaDate.toLocaleDateString('es-MX') + ' ' +
                fechaDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        }

        datosReparacionesArray.push({
            id: item.id || '',
            tipoVehiculo: tipoVehiculo,
            vehiculo: vehiculoTexto,
            empleado: empleadoTexto,
            tipoServicio: tipoServicio,
            recibio: item.recibio || '',
            fecha: fecha
        });
    });

    // Crear array de datos para Estatus y Asignacion de Refacciones (tabla2)
    var datosEstatusArray = [];
    datosEstatus.forEach(function (item) {
        var tipoVehiculo = item.tipoVehiculo == 1 ? 'Viajes Locales' : 'Vehiculo de Carga';
        var tipoServicio = item.tipoServicio == 1 ? 'Preventivo' : 'Correctivo';

        var vehiculoTexto = obtenerNombreVehiculo(item.tipoVehiculo, item.idVehiculo);
        var empleadoTexto = obtenerNombreEmpleado(item.idEmpleado);

        var fecha = '';
        if (item.fecha) {
            var fechaDate = new Date(item.fecha);
            fecha = fechaDate.toLocaleDateString('es-MX') + ' ' +
                fechaDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
        }

        var estadoTexto = '';
        switch (item.estado) {
            case 1: estadoTexto = 'Activo'; break;
            case 2: estadoTexto = 'En Proceso'; break;
            case 3: estadoTexto = 'Terminado'; break;
            case 4: estadoTexto = 'Liberado'; break;
            default: estadoTexto = 'Desconocido';
        }

        datosEstatusArray.push({
            id: item.id || '',
            tipoVehiculo: tipoVehiculo,
            vehiculo: vehiculoTexto,
            empleado: empleadoTexto,
            tipoServicio: tipoServicio,
            recibio: item.recibio || '',
            fecha: fecha,
            estado: estadoTexto
        });
    });

    // Crear formulario y enviar
    var form = $('<form>', {
        method: 'POST',
        action: '/Excel/GenerarReporteReparacionVehiculosExcel'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'fechaInicio',
        value: fechaInicio
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'fechaFin',
        value: fechaFin
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'datosReparaciones',
        value: JSON.stringify(datosReparacionesArray)
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'datosEstatus',
        value: JSON.stringify(datosEstatusArray)
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'totalRegistros',
        value: datosReparacionesArray.length
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'estadisticas',
        value: JSON.stringify(estadisticas)
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

function calcularEstadisticas(datosReparaciones, datosEstatus) {
    var estadisticas = {
        totalRegistros: datosReparaciones.length,
        porTipoVehiculo: {
            viajesLocales: 0,
            vehiculoCarga: 0
        },
        porTipoServicio: {
            preventivo: 0,
            correctivo: 0
        },
        porEstado: {
            activo: 0,
            enProceso: 0,
            terminado: 0,
            liberado: 0
        },
        distribucionMensual: {},
        topEmpleados: [],
        topVehiculos: []
    };

    // Contar por tipo de vehiculo
    datosReparaciones.forEach(function (item) {
        if (item.tipoVehiculo == 1) {
            estadisticas.porTipoVehiculo.viajesLocales++;
        } else if (item.tipoVehiculo == 2) {
            estadisticas.porTipoVehiculo.vehiculoCarga++;
        }

        // Contar por tipo de servicio
        if (item.tipoServicio == 1) {
            estadisticas.porTipoServicio.preventivo++;
        } else if (item.tipoServicio == 2) {
            estadisticas.porTipoServicio.correctivo++;
        }

        // Distribucion mensual
        if (item.fecha) {
            var fechaDate = new Date(item.fecha);
            var mesAnio = fechaDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
            estadisticas.distribucionMensual[mesAnio] = (estadisticas.distribucionMensual[mesAnio] || 0) + 1;
        }
    });

    // Contar por estado
    datosEstatus.forEach(function (item) {
        switch (item.estado) {
            case 1: estadisticas.porEstado.activo++; break;
            case 2: estadisticas.porEstado.enProceso++; break;
            case 3: estadisticas.porEstado.terminado++; break;
            case 4: estadisticas.porEstado.liberado++; break;
        }
    });

    // Top empleados (los que mas reparaciones han realizado)
    var empleadosCount = {};
    datosReparaciones.forEach(function (item) {
        var empleadoNombre = obtenerNombreEmpleado(item.idEmpleado);
        empleadosCount[empleadoNombre] = (empleadosCount[empleadoNombre] || 0) + 1;
    });

    estadisticas.topEmpleados = Object.entries(empleadosCount)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

    // Top vehiculos (los mas reparados)
    var vehiculosCount = {};
    datosReparaciones.forEach(function (item) {
        var vehiculoNombre = obtenerNombreVehiculo(item.tipoVehiculo, item.idVehiculo);
        vehiculosCount[vehiculoNombre] = (vehiculosCount[vehiculoNombre] || 0) + 1;
    });

    estadisticas.topVehiculos = Object.entries(vehiculosCount)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

    return estadisticas;
}

function obtenerNombreVehiculo(tipoVehiculo, idVehiculo) {
    if (tipoVehiculo == 1) {
        var vehiculo = vehiculosLocalesTodos.find(v => v.id == idVehiculo);
        if (vehiculo) {
            var tipoNombre = vehiculo.tipoVehiculo?.nombre || 'Sin tipo';
            return tipoNombre + ', ' + (vehiculo.color || 'Sin color') + ' (' + (vehiculo.placa || '') + ')';
        }
        return 'Vehiculo ID: ' + idVehiculo;
    } else if (tipoVehiculo == 2) {
        var vehiculo = vehiculosCargaTodos.find(v => v.id == idVehiculo);
        if (vehiculo) {
            return vehiculo.descripcion || 'Sin descripcion';
        }
        return 'Vehiculo ID: ' + idVehiculo;
    }
    return 'No especificado';
}

function obtenerNombreEmpleado(idEmpleado) {
    var empleado = empleados.find(e => e.id == idEmpleado);
    if (empleado) {
        var nombreCompleto = (empleado.nombre || '') + ' ' + (empleado.apellido || '');
        return nombreCompleto.trim() || 'Nombre no disponible';
    }
    return 'Empleado ID: ' + idEmpleado;
}