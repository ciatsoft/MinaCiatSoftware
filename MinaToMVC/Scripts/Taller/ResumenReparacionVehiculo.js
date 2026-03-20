// Variables globales
var vehiculosLocalesTodos = [];
var vehiculosCargaTodos = [];

$(document).ready(function () {
    MostrarValoresIniciales();

    GetAllRegistersVehiculos();
    GetAllRegistersVehiculoCarga();
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

    // Si no encuentra, retorna el código
    return codigo;
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

    if (!idVehiculo || idVehiculo === "0" || idVehiculo === "") {
        $('#vehiculoDesc').val("Sin vehículo");
        return;
    }

    var descripcion = "Vehículo no encontrado";

    if (tipoVehiculoCodigo === "1") { // Viajes Locales

        if (vehiculosLocalesTodos && vehiculosLocalesTodos.length > 0) {
            // Buscar el vehículo por ID - comparando como número
            // Nota: En los logs veo que la propiedad es 'id' (minúscula) no 'Id' (mayúscula)
            var vehiculo = vehiculosLocalesTodos.find(v => {
                // Convertir ambos a número para comparar
                var vId = parseInt(v.id);
                var busquedaId = parseInt(idVehiculo);
                return vId === busquedaId;
            });

            if (vehiculo) {
                // Para viajes locales: mostrar "Placa (Color)"
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
    } else if (tipoVehiculoCodigo === "2") { // Vehiculo de Carga

        if (vehiculosCargaTodos && vehiculosCargaTodos.length > 0) {
            // Buscar el vehículo por ID - comparando como número
            // Nota: En los logs veo que la propiedad es 'id' (minúscula)
            var vehiculo = vehiculosCargaTodos.find(v => {
                // Convertir ambos a número para comparar
                var vId = parseInt(v.id);
                var busquedaId = parseInt(idVehiculo);
                return vId === busquedaId;
            });

            if (vehiculo) {
                // Para vehículos de carga: mostrar la descripción
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
    console.log(id);
    console.log(tipoVehiculo);
    console.log(idVehiculo);
    $("#titleGenerciModal").text("Retirar Piezas");

    // Carga la vista parcial desde el backend con los 3 parámetros
    $("#boddyGeericModal").load(`/Taller/PartialViewModalRetirarPiezas?id=${id}&tipoVehiculo=${tipoVehiculo}&idVehiculo=${idVehiculo}`, function () {
        $("#genericModal").modal("show");
    });
}
function ModalAsignarPiezas(id) {
    console.log(id);
    //$("#titleGenerciModal").text("Retirar Piezas");
}