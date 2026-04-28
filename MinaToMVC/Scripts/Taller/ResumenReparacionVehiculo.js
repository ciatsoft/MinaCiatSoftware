// Variables globales
var vehiculosLocalesTodos = [];
var vehiculosCargaTodos = [];
var categoriasInventario = []; // Nueva variable global para categorías
var estadoReparacion = 0; // Variable global para almacenar el estado

$(document).ready(function () {
    // Obtener el estado desde el campo oculto
    estadoReparacion = parseInt($('#estado').val());

    // Configuración de DataTable
    $("#tblPiezasRetiradas").DataTable({
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
            { data: 'id', title: 'ID', visible: false },
            { data: 'idReparacion', title: 'Reparacion', visible: false },
            { data: 'nombre', title: 'Nombre' },
            { data: 'nombreCategoria', title: 'Categoria' },
            { data: 'marca', title: 'Marca' },
            { data: 'cantidadRetirada', title: 'Cantidad' },
            {
                data: 'reutilizable',
                title: 'Reutilizable',
                render: function (data, type, row) {
                    if (data === true) {
                        return '<div class="estado-indicador" style="display: flex; align-items: center; gap: 8px;">' +
                            '<span class="estado-circulo" style="width: 12px; height: 12px; border-radius: 50%; background-color: #28a745;"></span>' +
                            '<span>Si</span>' +
                            '</div>';
                    } else if (data === false) {
                        return '<div class="estado-indicador" style="display: flex; align-items: center; gap: 8px;">' +
                            '<span class="estado-circulo" style="width: 12px; height: 12px; border-radius: 50%; background-color: #dc3545;"></span>' +
                            '<span>No</span>' +
                            '</div>';
                    } else {
                        return '<div class="estado-indicador" style="display: flex; align-items: center; gap: 8px;">' +
                            '<span class="estado-circulo" style="width: 12px; height: 12px; border-radius: 50%; background-color: #6c757d;"></span>' +
                            '<span>Sin dato</span>' +
                            '</div>';
                    }
                }
            },
            {
                data: "id",
                title: "Acciones",
                orderable: false,
                render: function (data, type, row) {
                    // Si el estado es 3, mostrar solo botón de consultar
                    if (estadoReparacion === 3 || estadoReparacion === 4) {
                        return '<button class="btn btn-info btn-sm" onclick="ConsultarPiezaRetirada(' + data + ',' + row.idReparacion + ',' + row.tipoVehiculo + ',' + row.idVehiculo + ')">' +
                            '<i class="fa fa-info-circle"></i> Consultar</button>';
                    } else {
                        return '<button class="btn btn-info btn-sm" onclick="EditarPiezaRetirada(' + data + ',' + row.idReparacion + ',' + row.tipoVehiculo + ',' + row.idVehiculo + ')">' +
                            '<i class="fa fa-edit"></i> Editar</button> ' +
                            '<button class="btn btn-danger btn-sm" onclick="EliminarPiezaRetirada(' + data + ')">' +
                            '<i class="fa fa-trash"></i> Eliminar</button>';
                    }
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": '<i class="fa fa-list"></i> Mostrar _MENU_ entradas',
            "zeroRecords": '<i class="fa fa-info-circle"></i> No se encontraron resultados',
            "emptyTable": '<i class="fa fa-database"></i> Ningun dato disponible en esta tabla',
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

    $("#tblPiezasAsignadas").DataTable({
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
            { data: 'id', title: 'ID', visible: false },
            {
                data: 'tipoInventario',
                title: 'Tipo de Inventario',
                render: function (data, type, row) {
                    if (data == 1) {
                        return 'Reutilizable';
                    } else if (data == 2) {
                        return 'Nueva Pieza';
                    }
                    else {
                        return 'Sin Tipo';
                    }
                }
            },
            { data: 'nombreCategoria', title: 'Categoria' },
            { data: 'nombreInventario', title: 'Componente Usado' },
            { data: 'cantidadComponente', title: 'Cantidad' },
            { data: 'idReparacion', title: 'Reparacion', visible: false },
            { data: 'idVehiculo', title: 'Vehiculo', visible: false },
            { data: 'tipoVehiculo', title: 'Tipo', visible: false },
            {
                data: "id",
                title: "Acciones",
                orderable: false,
                render: function (data, type, row) {
                    // Si el estado es 3, mostrar solo botón de consultar
                    if (estadoReparacion === 3 || estadoReparacion === 4) {
                        return '<button class="btn btn-info btn-sm" onclick="ConsultarPiezaAsignada(' + row.id + ',' + row.idReparacion + ',' + row.tipoVehiculo + ',' + row.idVehiculo + ')">' +
                            '<i class="fa fa-info-circle"></i> Consultar</button>';
                    } else {
                        return '<button class="btn btn-info btn-sm" onclick="EditarPiezaAsignada(' + row.id + ',' + row.idReparacion + ',' + row.tipoVehiculo + ',' + row.idVehiculo + ')">' +
                            '<i class="fa fa-edit"></i> Editar</button> ' +
                            '<button class="btn btn-danger btn-sm" onclick="EliminarPiezaAsignada(' + row.id + ')">' +
                            '<i class="fa fa-trash"></i> Eliminar</button>';
                    }
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": '<i class="fa fa-list"></i> Mostrar _MENU_ entradas',
            "zeroRecords": '<i class="fa fa-info-circle"></i> No se encontraron resultados',
            "emptyTable": '<i class="fa fa-database"></i> Ningun dato disponible en esta tabla',
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

    MostrarValoresIniciales();

    // Cargar categorías primero, luego los demás datos
    GetAllCategoriaInventario(function () {
        GetAllRegistersVehiculos();
        GetAllRegistersVehiculoCarga();
    });
});

function MostrarValoresIniciales() {
    // Verificar que tenemos los datos de configuración
    if (typeof configuracion !== 'undefined') {

        // Obtener los códigos del modelo
        var tipoVehiculoCodigo = $('#tipoVehiculo').val();
        var tipoServicioCodigo = $('#tipoServicio').val();

        // Procesar Tipo de Vehículo
        if (tipoVehiculoCodigo && configuracion.tipoVehiculos) {
            var descVehiculo = ObtenerDescripcionPorCodigo(tipoVehiculoCodigo, configuracion.tipoVehiculos);
            $('#tipoVehiculoDesc').val(descVehiculo || "No encontrado");
        }

        // Procesar Tipo de Servicio
        if (tipoServicioCodigo && configuracion.tipoServicio) {
            var descServicio = ObtenerDescripcionPorCodigo(tipoServicioCodigo, configuracion.tipoServicio);
            $('#tipoServicioDesc').val(descServicio || "No encontrado");
        }
    } else {
        $('#tipoVehiculoDesc').val("Error: Configuración no disponible");
        $('#tipoServicioDesc').val("Error: Configuración no disponible");
    }
}

function ObtenerDescripcionPorCodigo(codigo, listaConfig) {
    if (!listaConfig || !codigo) return null;

    // El formato en ViewBag.TiposVehiculos es ["1:Viajes Locales", "2:Vehiculo de Carga"]
    for (var i = 0; i < listaConfig.length; i++) {
        var item = listaConfig[i];
        if (item.startsWith(codigo + ":")) {
            var partes = item.split(':');
            if (partes.length > 1) {
                return partes[1]; // Retorna la descripción
            }
        }
    }
    return codigo;
}

function ObtenerNombreCategoria(idCategoria) {
    if (!categoriasInventario || categoriasInventario.length === 0) {
        return idCategoria;
    }

    var categoria = categoriasInventario.find(c => c.id === idCategoria);

    if (categoria) {
        return categoria.nombre;
    } else {
        return idCategoria;
    }
}

function GetAllRegistersVehiculos() {
    GetMVC("/Taller/GetAllRegistersVehiculos", function (r) {
        if (r.IsSuccess) {
            vehiculosLocalesTodos = r.Response;

            MostrarDescripcionVehiculo();
        } else {
            swal({
                title: "Error",
                text: "Error al cargar los vehículos viajes locales: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function GetAllRegistersVehiculoCarga() {
    GetMVC("/VehiculoCarga/GetAllRegistersVehiculoCarga", function (r) {
        if (r.IsSuccess) {
            vehiculosCargaTodos = r.Response;

            MostrarDescripcionVehiculo();
        } else {
            swal({
                title: "Error",
                text: "Error al cargar los vehículos de carga: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function MostrarDescripcionVehiculo() {
    var idVehiculo = $('#vehiculo').val();
    var tipoVehiculoCodigo = $('#tipoVehiculo').val();
    var idReparacion = $('#id').val();

    // Esperar a que las categorías estén cargadas antes de obtener las piezas
    if (categoriasInventario && categoriasInventario.length > 0) {
        GetAllRetirarPiezaVehiculoReparacionByIdVehiculo(tipoVehiculoCodigo, idVehiculo, idReparacion);
        GetAllPiezasAsignadasReparacionByIdVehiculo(tipoVehiculoCodigo, idVehiculo, idReparacion);
    } else {
        // Si las categorías aún no están cargadas, esperar un poco y reintentar
        setTimeout(function () {
            MostrarDescripcionVehiculo();
        }, 500);
        return;
    }

    if (!idVehiculo || idVehiculo === "0" || idVehiculo === "") {
        $('#vehiculoDesc').val("Sin vehiculo");
        return;
    }

    var descripcion = "Vehiculo no encontrado";

    if (tipoVehiculoCodigo === "1") {

        if (vehiculosLocalesTodos && vehiculosLocalesTodos.length > 0) {

            var vehiculo = vehiculosLocalesTodos.find(v => {

                var vId = parseInt(v.id);
                var busquedaId = parseInt(idVehiculo);
                return vId === busquedaId;
            });

            if (vehiculo) {

                if (vehiculo.placa && vehiculo.color) {
                    descripcion = vehiculo.placa + " (" + vehiculo.color + ")";
                } else if (vehiculo.placa) {
                    descripcion = vehiculo.placa;
                } else if (vehiculo.nombre) {
                    descripcion = vehiculo.nombre;
                } else {
                    descripcion = "ID: " + idVehiculo;
                }
            }
        }
    } else if (tipoVehiculoCodigo === "2") {

        if (vehiculosCargaTodos && vehiculosCargaTodos.length > 0) {

            var vehiculo = vehiculosCargaTodos.find(v => {

                var vId = parseInt(v.id);
                var busquedaId = parseInt(idVehiculo);
                return vId === busquedaId;
            });

            if (vehiculo) {

                if (vehiculo.descripcion) {
                    descripcion = vehiculo.descripcion;
                } else if (vehiculo.nombre) {
                    descripcion = vehiculo.nombre;
                } else {
                    descripcion = "ID: " + idVehiculo;
                }
            }
        }
    } else {
        descripcion = "Tipo de vehiculo no válido";
    }
    $('#vehiculoDesc').val(descripcion);
}

function ModalRetirarPiezas(id, tipoVehiculo, idVehiculo) {
    $("#titleGenerciModal").html('<span style="color: black;">Retirar Piezas</span>');

    $("#boddyGeericModal").load(`/Taller/PartialViewModalRetirarPiezas?id=${id}&tipoVehiculo=${tipoVehiculo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}

function ModalAsignarPiezas(id, idReparacion, tipoVehiculo, idVehiculo) {
    $("#titleGenerciModal").html('<span style="color: black;">Asignacion de Piezas</span>');

    $("#boddyGeericModal").load(`/Taller/PartialViewModalAsignarPiezas?id=${id}&idReparacion=${idReparacion}&tipoVehiculo=${tipoVehiculo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}

function GetAllRetirarPiezaVehiculoReparacionByIdVehiculo(tipoVehiculo, idVehiculo, idReparacion) {
    GetMVC(`/Taller/GetAllRetirarPiezaVehiculoReparacionByIdVehiculo?tipoVehiculo=${tipoVehiculo}&idVehiculo=${idVehiculo}&idReparacion=${idReparacion}`, function (r) {
        if (r.IsSuccess) {

            var datosProcesados = r.Response.map(function (pieza) {
                var nombreCategoria = ObtenerNombreCategoria(pieza.idCategoriaInventario);

                return {
                    ...pieza,
                    nombreCategoria: nombreCategoria
                };
            });

            MapingPropertiesDataTable("tblPiezasRetiradas", datosProcesados);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las piezas retiradas: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function GetAllPiezasAsignadasReparacionByIdVehiculo(tipoVehiculo, idVehiculo, idReparacion) {
    GetMVC(`/Taller/GetAllPiezasAsignadasReparacionByIdVehiculo?tipoVehiculo=${tipoVehiculo}&idVehiculo=${idVehiculo}&idReparacion=${idReparacion}`, function (r) {
        if (r.IsSuccess) {

            var datosProcesados = r.Response.map(function (pieza) {
                var nombreCategoria = ObtenerNombreCategoria(pieza.idCategoria);

                return {
                    ...pieza,
                    nombreCategoria: nombreCategoria
                };
            });

            MapingPropertiesDataTable("tblPiezasAsignadas", datosProcesados);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las piezas asignadas: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function GetAllCategoriaInventario(callback) {
    GetMVC("/Taller/GetAllCategoriaInventario", function (r) {
        if (r.IsSuccess) {
            categoriasInventario = r.Response;

            if (callback) callback();
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las Categorias del Inventario: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
            if (callback) callback();
        }
    });
}

function EliminarPiezaRetirada(id) {
    swal({
        title: "Eliminar Registro",
        text: "Se eliminara el siguiente registro",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar"
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            swal({
                title: "Eliminado",
                text: "El registro ha sido eliminado.",
                type: "success",
                confirmButtonText: "Aceptar"
            }, function () {
                window.location.reload();
            });
            window.location.reload();
            PostMVC('/Taller/DeleteRetirarPiezaVehiculoReparacionById', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El registro ha sido eliminado.",
                        type: "success",
                        confirmButtonText: "Aceptar"
                    }, function () {
                        window.location.reload();
                    });
                } else {
                    swal({
                        title: "Error",
                        text: r.ErrorMessage || "Error al eliminar el registro",
                        type: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            });
        }
    });
}

function EditarPiezaRetirada(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").html('<span style="color: black;">Editar Retirar Piezas</span>');

    $("#boddyGeericModal").load(`/Taller/PartialViewEditarRetirarPieza?id=${id}&idReparacion=${idReparacion}&tipoVehiculo=${tipoVehiculoCodigo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}

function ConsultarPiezaRetirada(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").html('<span style="color: black;">Consultar Pieza Retirada</span>');

    $("#boddyGeericModal").load(`/Taller/PartialViewModalConsultarPiezaRetirada?id=${id}&idReparacion=${idReparacion}&tipoVehiculo=${tipoVehiculoCodigo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}

function EditarPiezaAsignada(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").text("Editar Pieza Asignada");

    $("#boddyGeericModal").load(`/Taller/PartialViewModalAsignarPiezas?id=${id}&idReparacion=${idReparacion}&tipoVehiculo=${tipoVehiculoCodigo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}

function ConsultarPiezaAsignada(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").html('<span style="color: black;">Consultar Pieza Asignada');

    $("#boddyGeericModal").load(`/Taller/PartialViewConsultarPiezaAsignada?id=${id}&idReparacion=${idReparacion}&tipoVehiculo=${tipoVehiculoCodigo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}

function EliminarPiezaAsignada(id) {
    swal({
        title: "Eliminar Registro",
        text: "Se eliminara el siguiente registro",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar"
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            swal({
                title: "Eliminado",
                text: "El registro ha sido eliminado.",
                type: "success",
                confirmButtonText: "Aceptar"
            }, function () {
                window.location.reload();
            });
            window.location.reload();
            PostMVC('/Taller/DeleteComponenteVehiculoById', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El registro ha sido eliminado.",
                        type: "success",
                        confirmButtonText: "Aceptar"
                    }, function () {
                        window.location.reload();
                    });
                } else {
                    swal({
                        title: "Error",
                        text: r.ErrorMessage || "Error al eliminar el registro",
                        type: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            });
        }
    });
}

function ActualizarEstado(id, estado) {
    swal({
        title: "Actualizar Estado",
        text: "Se actualizara el estado del siguiente registro",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, actualizar",
        cancelButtonText: "Cancelar"
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id, Estado: estado };
            swal({
                title: "Actualizado",
                text: "El registro ha sido actualizado.",
                type: "success",
                confirmButtonText: "Aceptar"
            }, function () {
                window.location.reload();
            });
            PostMVC('/Taller/ActualizarEstado', parametro, function (r) {
                window.location.reload();
                if (r.IsSuccess) {
                    swal({
                        title: "Actualizado",
                        text: "El registro ha sido actualizado.",
                        type: "success",
                        confirmButtonText: "Aceptar"
                    }, function () {
                        window.location.reload();
                    });
                } else {
                    swal({
                        title: "Error",
                        text: r.ErrorMessage || "Error al actualizar el registro",
                        type: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            });
        }
    });
}

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReporteReparacionPDF();
});

document.getElementById("btnGenerarExcel").addEventListener("click", function () {
    generarReporteExcel();
});

function generarReporteReparacionPDF() {
    // Verificar si hay datos en al menos una tabla
    var tablaRetiradas = $('#tblPiezasRetiradas').DataTable();
    var tablaAsignadas = $('#tblPiezasAsignadas').DataTable();

    var datosRetiradas = tablaRetiradas.data().toArray();
    var datosAsignadas = tablaAsignadas.data().toArray();

    if (datosRetiradas.length === 0 && datosAsignadas.length === 0) {
        swal({
            title: "Sin datos",
            text: "No hay datos para exportar",
            type: "warning",
            confirmButtonText: "Entendido"
        });
        return;
    }

    // Mostrar loading
    swal({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        type: "info",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    // Obtener información de la reparación
    var idReparacion = $('#id').val();
    var tipoVehiculoDesc = $('#tipoVehiculoDesc').val();
    var vehiculoDesc = $('#vehiculoDesc').val();
    var tipoServicioDesc = $('#tipoServicioDesc').val();

    // Obtener estado de la reparación
    var estado = $('#estado').val();
    var estadoDescripcion = "";
    switch (estado) {
        case "1": estadoDescripcion = "Pendiente"; break;
        case "2": estadoDescripcion = "En Proceso"; break;
        case "3": estadoDescripcion = "Terminado"; break;
        default: estadoDescripcion = "Desconocido";
    }

    // Crear tabla HTML para Piezas Retiradas
    var tablaRetiradasHTML = '';
    if (datosRetiradas.length > 0) {
        tablaRetiradasHTML = '<h2 style="color: #2c3e50; margin-top: 20px;">Piezas Retiradas</h2>';
        tablaRetiradasHTML += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:20px;">';
        tablaRetiradasHTML += '<thead><tr style="background-color:#34495e;color:white;">';
        tablaRetiradasHTML += '<th style="padding:10px;">ID</th>';
        tablaRetiradasHTML += '<th style="padding:10px;">Nombre</th>';
        tablaRetiradasHTML += '<th style="padding:10px;">Categoria</th>';
        tablaRetiradasHTML += '<th style="padding:10px;">Marca</th>';
        tablaRetiradasHTML += '<th style="padding:10px;">Cantidad</th>';
        tablaRetiradasHTML += '<th style="padding:10px;">Reutilizable</th>';
        tablaRetiradasHTML += '</tr></thead><tbody>';

        datosRetiradas.forEach(function (item) {
            tablaRetiradasHTML += '<tr>';
            tablaRetiradasHTML += '<td style="padding:8px;">' + (item.id || '') + '</td>';
            tablaRetiradasHTML += '<td style="padding:8px;">' + (item.nombre || '') + '</td>';
            tablaRetiradasHTML += '<td style="padding:8px;">' + (item.nombreCategoria || '') + '</td>';
            tablaRetiradasHTML += '<td style="padding:8px;">' + (item.marca || '') + '</td>';
            tablaRetiradasHTML += '<td style="padding:8px;text-align:center;">' + (item.cantidadRetirada || '') + '</td>';
            tablaRetiradasHTML += '<td style="padding:8px;text-align:center;">' + (item.reutilizable ? 'Si' : 'No') + '</td>';
            tablaRetiradasHTML += '</tr>';
        });
        tablaRetiradasHTML += '</tbody></table>';
    } else {
        tablaRetiradasHTML = '<h2 style="color: #2c3e50; margin-top: 20px;">Piezas Retiradas</h2>';
        tablaRetiradasHTML += '<p style="color: #7f8c8d;">No hay piezas retiradas registradas.</p>';
    }

    // Crear tabla HTML para Piezas Asignadas
    var tablaAsignadasHTML = '';
    if (datosAsignadas.length > 0) {
        tablaAsignadasHTML = '<h2 style="color: #2c3e50; margin-top: 20px;">Piezas Instaladas</h2>';
        tablaAsignadasHTML += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
        tablaAsignadasHTML += '<thead><tr style="background-color:#34495e;color:white;">';
        tablaAsignadasHTML += '<th style="padding:10px;">ID</th>';
        tablaAsignadasHTML += '<th style="padding:10px;">Tipo de Inventario</th>';
        tablaAsignadasHTML += '<th style="padding:10px;">Categoría</th>';
        tablaAsignadasHTML += '<th style="padding:10px;">Componente Usado</th>';
        tablaAsignadasHTML += '<th style="padding:10px;">Cantidad</th>';
        tablaAsignadasHTML += '</tr></thead><tbody>';

        datosAsignadas.forEach(function (item) {
            var tipoInventario = "";
            if (item.tipoInventario == 1) tipoInventario = "Reutilizable";
            else if (item.tipoInventario == 2) tipoInventario = "Nueva Pieza";
            else tipoInventario = "Sin Tipo";

            tablaAsignadasHTML += '<tr>';
            tablaAsignadasHTML += '<td style="padding:8px;">' + (item.id || '') + '</td>';
            tablaAsignadasHTML += '<td style="padding:8px;">' + tipoInventario + '</td>';
            tablaAsignadasHTML += '<td style="padding:8px;">' + (item.nombreCategoria || '') + '</td>';
            tablaAsignadasHTML += '<td style="padding:8px;">' + (item.nombreInventario || '') + '</td>';
            tablaAsignadasHTML += '<td style="padding:8px;text-align:center;">' + (item.cantidadComponente || '') + '</td>';
            tablaAsignadasHTML += '</tr>';
        });
        tablaAsignadasHTML += '</tbody></table>';
    } else {
        tablaAsignadasHTML = '<h2 style="color: #2c3e50; margin-top: 20px;">Piezas Instaladas</h2>';
        tablaAsignadasHTML += '<p style="color: #7f8c8d;">No hay piezas instaladas registradas.</p>';
    }

    // Crear formulario y enviar
    var form = $('<form>', {
        method: 'POST',
        action: '/PDF/GenerarReporteReparacionPDF'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaRetiradasHTML',
        value: tablaRetiradasHTML
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaAsignadasHTML',
        value: tablaAsignadasHTML
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'idReparacion',
        value: idReparacion
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'tipoVehiculo',
        value: tipoVehiculoDesc
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'vehiculo',
        value: vehiculoDesc
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'tipoServicio',
        value: tipoServicioDesc
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'estado',
        value: estadoDescripcion
    }).appendTo(form);

    form.appendTo('body').submit();
    form.remove();

    // Cerrar el loading después de enviar el formulario
    setTimeout(function () {
        swal.close();
        swal({
            title: "Reporte generado!",
            text: "El PDF se ha creado correctamente",
            type: "success",
            timer: 3000,
            showConfirmButton: false
        });
        window.location.reload();
    }, 2000);
}

function generarReporteExcel() {
    // Verificar si hay datos en al menos una tabla
    var tablaRetiradas = $('#tblPiezasRetiradas').DataTable();
    var tablaAsignadas = $('#tblPiezasAsignadas').DataTable();

    var datosRetiradas = tablaRetiradas.data().toArray();
    var datosAsignadas = tablaAsignadas.data().toArray();

    if (datosRetiradas.length === 0 && datosAsignadas.length === 0) {
        swal({
            title: "Sin datos",
            text: "No hay datos para exportar",
            type: "warning",
            confirmButtonText: "Entendido"
        });
        return;
    }

    // Mostrar loading
    swal({
        title: "Generando Excel...",
        text: "Por favor espere mientras se genera el archivo Excel",
        type: "info",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    // Obtener informacion de la reparacion
    var idReparacion = $('#id').val();
    var tipoVehiculoDesc = $('#tipoVehiculoDesc').val();
    var vehiculoDesc = $('#vehiculoDesc').val();
    var tipoServicioDesc = $('#tipoServicioDesc').val();

    // Obtener estado de la reparacion
    var estado = $('#estado').val();
    var estadoDescripcion = "";
    switch (estado) {
        case "1": estadoDescripcion = "Pendiente"; break;
        case "2": estadoDescripcion = "En Proceso"; break;
        case "3": estadoDescripcion = "Terminado"; break;
        default: estadoDescripcion = "Desconocido";
    }

    // Crear array de datos para Piezas Retiradas
    var datosRetiradasArray = [];
    datosRetiradas.forEach(function (item) {
        datosRetiradasArray.push({
            id: item.id || '',
            nombre: item.nombre || '',
            nombreCategoria: item.nombreCategoria || '',
            marca: item.marca || '',
            cantidadRetirada: item.cantidadRetirada || '',
            reutilizable: item.reutilizable ? 'Si' : 'No'
        });
    });

    // Crear array de datos para Piezas Asignadas
    var datosAsignadasArray = [];
    datosAsignadas.forEach(function (item) {
        var tipoInventario = "";
        if (item.tipoInventario == 1) tipoInventario = "Reutilizable";
        else if (item.tipoInventario == 2) tipoInventario = "Nueva Pieza";
        else tipoInventario = "Sin Tipo";

        datosAsignadasArray.push({
            id: item.id || '',
            tipoInventario: tipoInventario,
            nombreCategoria: item.nombreCategoria || '',
            nombreInventario: item.nombreInventario || '',
            cantidadComponente: item.cantidadComponente || ''
        });
    });

    // Crear formulario con datos en JSON - apuntando a ExcelController
    var form = $('<form>', {
        method: 'POST',
        action: '/Excel/GenerarReporteReparacionExcel'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'datosRetiradas',
        value: JSON.stringify(datosRetiradasArray)
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'datosAsignadas',
        value: JSON.stringify(datosAsignadasArray)
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'idReparacion',
        value: idReparacion
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'tipoVehiculo',
        value: tipoVehiculoDesc
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'vehiculo',
        value: vehiculoDesc
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'tipoServicio',
        value: tipoServicioDesc
    }).appendTo(form);

    $('<input>').attr({
        type: 'hidden',
        name: 'estado',
        value: estadoDescripcion
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
        window.location.reload();
    }, 2000);
}