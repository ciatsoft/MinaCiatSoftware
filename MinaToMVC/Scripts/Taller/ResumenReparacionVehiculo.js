// Variables globales
var vehiculosLocalesTodos = [];
var vehiculosCargaTodos = [];
var categoriasInventario = []; // Nueva variable global para categorías

$(document).ready(function () {

    // Configuración de DataTable
    $("#tblPiezasRetiradas").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'idReparacion', title: 'Reparacion', visible: false },
            { data: 'nombre', title: 'Nombre' },
            { data: 'nombreCategoria', title: 'Categoria' },
            { data: 'marca', title: 'Marca' },
            { data: 'cantidad', title: 'Cantidad' },
            {
                data: 'reutilizable',
                title: 'Reutilizable',
                render: function (data, type, row) {
                    if (data === true) {
                        return '<div style="display: flex; align-items: center; gap: 8px;">' +
                            '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: green;"></div>' +
                            '<span>Si</span>' +
                            '</div>';
                    } else if (data === false) {
                        return '<div style="display: flex; align-items: center; gap: 8px;">' +
                            '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: red;"></div>' +
                            '<span>No</span>' +
                            '</div>';
                    } else {
                        return '<div style="display: flex; align-items: center; gap: 8px;">' +
                            '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: gray;"></div>' +
                            '<span>Sin dato</span>' +
                            '</div>';
                    }
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data, type, row) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarPiezaRetirada(' + data + ',' + row.idReparacion + ',' + row.tipoVehiculo + ',' + row.idVehiculo + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarPiezaRetirada(' + data + ')"/>';
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

    $("#tblPiezasAsignadas").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
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
                render: function (data, type, row) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarPiezaAsignada(' + row.id + ',' + row.idReparacion + ',' + row.tipoVehiculo + ',' + row.idVehiculo + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarPiezaAsignada(' + data + ')"/>';
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

            MostrarDescripcionVehiculo();
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
        $('#vehiculoDesc').val("Sin vehículo");
        return;
    }

    var descripcion = "Vehículo no encontrado";

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
        descripcion = "Tipo de vehículo no válido";
    }
    $('#vehiculoDesc').val(descripcion);
}

function ModalRetirarPiezas(id, tipoVehiculo, idVehiculo) {
    $("#titleGenerciModal").text("Retirar Piezas");

    $("#boddyGeericModal").load(`/Taller/PartialViewModalRetirarPiezas?id=${id}&tipoVehiculo=${tipoVehiculo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}

function ModalAsignarPiezas(id, idReparacion, tipoVehiculo, idVehiculo) {
    console.log(id, tipoVehiculo, idVehiculo);
    $("#titleGenerciModal").text("Asignacion de Piezas");

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
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las piezas retiradas: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
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
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las piezas retiradas: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
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
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las Categorias del Inventario: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            if (callback) callback();
        }
    });
}

function EliminarPiezaRetirada(id) {
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
            var parametro = { Id: id };

            PostMVC('/Taller/DeleteRetirarPiezaVehiculoReparacionById', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                } else {
                    Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                }
            });
        }
    });
}

function EditarPiezaRetirada(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").text("Editar Retirar Piezas");

    $("#boddyGeericModal").load(`/Taller/PartialViewEditarRetirarPieza?id=${id}&idReparacion=${idReparacion}&tipoVehiculo=${tipoVehiculoCodigo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}
function EditarPiezaAsignada(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").text("Editar Retirar Piezas");

    $("#boddyGeericModal").load(`/Taller/PartialViewModalAsignarPiezas?id=${id}&idReparacion=${idReparacion}&tipoVehiculo=${tipoVehiculoCodigo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}