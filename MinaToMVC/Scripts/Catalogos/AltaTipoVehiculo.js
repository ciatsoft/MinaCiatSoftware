$(document).ready(function () {
    // Validación del formulario
    $("#frmtipovehiculo").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
            "txtCapacidad": "required"
        },
        messages: {
            "txtNombre": "Por favor, ingresa el nombre del vehículo",
            "txtDescripcion": "Por favor, ingresa una descripción",
            "txtCapacidad": "Por favor, ingrsar capacidad del vehiculo"
        }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        }
    });

    // Configuración de la tabla
    $("#tblTipoVehiculo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: true, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripción" },
            { data: "capacidad", title: "Capacidad"},
            {
                data: "estatus",
                title: "Estatus",
                render: function (data) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarTVehiculo(' + data + ')" />' +
<<<<<<< HEAD
                    ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarTVehiculo(' + data + ')" />';
=======
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarTVehiculo(' + data + ')" />';
>>>>>>> DEV
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
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

    // Carga inicial de datos
    GetAllTipoVehiculo();

    // Si se va a editar un registro, llenar los campos
    if (tVehiculoJson && tVehiculoJson.Id && tVehiculoJson.Id !== 0) {
        $("#txtidtipovehiculo").val(tVehiculoJson.Id);
        $("#txtNombre").val(tVehiculoJson.Nombre);
        $("#txtDescripcion").val(tVehiculoJson.Descripcion);
        $("#chbEstatus").prop('checked', tVehiculoJson.Estatus);
    }
});

// Función para guardar o actualizar tipo de vehículo
function SaveOrUpdateTipoVehiculo() {
    if ($("#frmtipovehiculo").valid()) {
        var parametro = {
            Id: $("#txtidtipovehiculo").val(),
            Nombre: $("#txtNombre").val(),
            Descripcion: $("#txtDescripcion").val(),
            Estatus: $("#chbEstatus").is(':checked'),
            CreatedDt: $("#txtCreatedDt").val()
        };

        Swal.fire({
            title: "Registro guardado!",
            text: "El registro se ha guardado correctamente.",
            icon: "success",
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/Catalog/TipoVehiculo';
            }
        });

        PostMVC('/Catalog/SaveOrUpdateTipoVehiculo', parametro, function (r) {
            if (r.IsSuccess) {
                location.href = "/Catalog/TipoVehiculo/" + r.Response.id;
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}

// Función para eliminar tipo de vehículo
function EliminarTVehiculo(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar el registro seleccionado?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = {
                Id: id
            };
            PostMVC('/Catalog/DeleteTipoVehiculo', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire(
                        'Eliminado',
                        'El tipo de vehículo ha sido eliminado.',
                        'success'
                    ).then(() => {
                        window.location.href = '/Catalog/TipoVehiculo';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar el tipo de vehículo: ' + r.ErrorMessage,
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}

// Redirección al editar
function EditarTVehiculo(id) {
    location.href = "/Catalog/TipoVehiculo/" + id;
}

// Limpieza del formulario
function LimpiarFormulario() {
    $("#txtidtipovehiculo").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#chbEstatus").prop('checked', false);
}

// Obtención de todos los registros
function GetAllTipoVehiculo() {
    GetMVC("/Catalog/GetAllTipoVehiculo", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblTipoVehiculo", r.Response);
        } else {
            alert("Error al cargar los vehículos: " + r.ErrorMessage);
        }
    });
}
