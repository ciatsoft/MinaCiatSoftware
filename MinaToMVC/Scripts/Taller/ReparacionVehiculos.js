$(document).ready(function () {
    // Funcion para obtener los vehiculos cada que cambie el selector de TipoVehiculos
    $("#ddlTiposVehiculos").on("change", function () {
        ObtenerVehiculos();
    });

    // Configuración de DataTable
    $("#tblReparacionVehiculos").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: 'tipoVehiculo',
                title: 'Tipo de vehiculo',
                render: function (data, type, row) {
                    if (data === 1) {
                        return
                        '<span>Viajes Locales</span>';
                    } else if (data === 2) {
                        return
                        '<span>Vehiculo de Carga</span>';
                    } else {
                        return
                        '<span>Sin Categoria</span>';
                    }
                }
            },
            { data: 'idEmpleado', title: 'Empleado' },
            {
                data: 'tipoServicio',
                title: 'Tipo de servicio',
                render: function (data, type, row) {
                    if (data === 1) {
                        return
                        '<span>Preventivo</span>';
                    } else if (data === 2) {
                        return
                        '<span>Correctivo</span>';
                    } else {
                        return
                        '<span>Sin Categoria</span>';
                    }
                }
            },
            { data: 'recibido', title: 'Recibio' },
            { data: 'fecha', title: 'Fecha' },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRegistro(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRegistro(' + data + ')"/>';
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Asignar Piezas" class="btn btn-success btn-lg-custom" onclick="AbrirModalComponente(' + data + ')" />';
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

    //GetAllReparacionVehiculos();
});

function ObtenerVehiculos() {
    var tipoSeleccionado = $("#ddlTiposVehiculos").val();

    if (!tipoSeleccionado) {
        console.warn("No hay tipo de vehiculo seleccionado.");
        // Limpiar el select de vehículos
        $("#ddlVehiculo").empty().append('<option value="" disabled selected>Selecciona un Vehiculo</option>');
        return;
    }

    // Mostrar indicador de carga
    $("#ddlVehiculo").empty().append('<option value="" disabled selected>Cargando vehiculos...</option>');

    if (tipoSeleccionado == 1) {
        // VEHÍCULOS DE VIAJES/TALLER (con placa)
        GetMVC("/Taller/GetAllVehiculo", function (r) {
            if (r.IsSuccess) {
                console.log("Vehículos:", r.Response);
                // Construir el select de vehículos con los datos recibidos
                ConstruirSelectVehiculos(r.Response, 1);
            } else {
                alert("Error al cargar los vehículos de viajes: " + r.ErrorMessage);
                // Restaurar el select en caso de error
                $("#ddlVehiculo").empty().append('<option value="" disabled selected>Error al cargar vehiculos</option>');
            }
        });
    } else if (tipoSeleccionado == 2) {
        // VEHÍCULOS DE CARGA (con descripción)
        GetMVC("/VehiculoCarga/GetAllVehiculoCarga", function (r) {
            if (r.IsSuccess) {
                // Parsear si es necesario
                if (r.Response && typeof r.Response === 'string') {
                    r.Response = JSON.parse(r.Response);
                }
                ConstruirSelectVehiculos(r.Response, 2);
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al cargar los vehículos de carga: ' + r.ErrorMessage,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                // Restaurar el select en caso de error
                $("#ddlVehiculo").empty().append('<option value="" disabled selected>Error al cargar vehiculos</option>');
            }
        });
    }
}

function ConstruirSelectVehiculos(vehiculos, tipoVehiculo) {
    // Limpiar el select de vehículos
    var $selectVehiculo = $("#ddlVehiculo");
    $selectVehiculo.empty();

    // Agregar opción por defecto
    $selectVehiculo.append('<option value="" disabled selected>Selecciona un Vehiculo</option>');

    // Verificar si hay vehículos
    if (vehiculos && vehiculos.length > 0) {
        // Recorrer el array de vehículos y crear opciones
        $.each(vehiculos, function (index, vehiculo) {
            var valor = '';
            var texto = '';

            // Determinar la estructura según el tipo de vehículo
            if (tipoVehiculo == 1) {
                // ESTRUCTURA PARA VEHÍCULOS DE TALLER/VIAJES (con placa)
                valor = vehiculo.id || vehiculo.Id || vehiculo.placa || vehiculo.Placa || '';

                if (vehiculo.placa) {
                    texto = vehiculo.placa;
                    // Agregar más información si está disponible
                    if (vehiculo.color) {
                        texto += ' - ' + vehiculo.color;
                    }
                } else {
                    // Si no hay placa (por si acaso)
                    texto = 'Vehículo ' + (index + 1);
                }
            } else if (tipoVehiculo == 2) {
                // ESTRUCTURA PARA VEHÍCULOS DE CARGA (con descripción)
                valor = vehiculo.id || '';
                texto = vehiculo.descripcion || 'Sin descripcion';
            }

            // Agregar la opción al select
            $selectVehiculo.append('<option value="' + valor + '">' + texto + '</option>');
        });
    } else {
        // Si no hay vehículos
        $selectVehiculo.append('<option value="" disabled>No hay vehiculos disponibles</option>');
    }
}