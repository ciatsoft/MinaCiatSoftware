﻿$(document).ready(function () {
    $("#frmtipovehiculo").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        },
        messages: {
            "txtNombre": "Por favor, ingresa el nombre del vehículo",
            "txtDescripcion": "Por favor, ingresa una descripción",
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element); // Coloca el mensaje de error después del campo correspondiente
        }
    });

    $("#tblTipoVehiculo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": true, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripción" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    // Si estatus es 1, muestra "Activo", si es 0, muestra "Inactivo"
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarTVehiculo(' + data + ')" />' +
' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarTVehiculo(' + data + ')" />';
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

    GetAllTipoVehiculo();

    // Verifica si tVehiculoJson tiene un id válido
    if (tVehiculoJson && tVehiculoJson.Id && tVehiculoJson.Id !== 0) {
        $("#txtidtipovehiculo").val(tVehiculoJson.Id);
        $("#txtNombre").val(tVehiculoJson.Nombre);
        $("#txtDescripcion").val(tVehiculoJson.Descripcion);
        $("#chbEstatus").prop('checked', tVehiculoJson.Estatus);
        $("#estatusContainer").show(); // Mostrar solo si se está editando
    } else {
        $("#estatusContainer").hide(); // No mostrar si no se está editando
    }
});


// Función que se ejecuta al hacer clic en el botón de Guardar
function SaveOrUpdateTipoVehiculo() {
    // Validamos el formulario antes de proceder
    if ($("#frmtipovehiculo").valid()) {
        var parametro = {
            Id: $("#txtidtipovehiculo").val(),
            Nombre: $("#txtNombre").val(),
            Descripcion: $("#txtDescripcion").val(),
            Estatus: $("#chbEstatus").is(':checked'),  // Booleano directo
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

        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateTipoVehiculo', parametro, function (r) {
            if (r.IsSuccess) {
                location.href = "/Catalog/TipoVehiculo/" + r.Response.id;
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}


// Función para eliminar el rol con confirmación y actualización de estatus
function EliminarTVehiculo(id) {

    // Confirmación de eliminación
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar la siguiente registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Actualizamos el estatus a "Inactivo" (0) y preparamos el parámetro
            var parametro = {
                Id: id
            };
            // Llamada para guardar o actualizar el rol
            PostMVC('/Catalog/DeleteTipoVehiculo', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire(
                        'Eliminado',
                        'El tipo de vehiculo ha sido eliminada.',
                        'success'
                    ).then(() => {
                        window.location.href = '/Catalog/TipoVehiculo';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar El tipo de vehiculo: ' + r.ErrorMessage,
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}

function EditarTVehiculo(id) {
    location.href = "/Catalog/TipoVehiculo/" + id;
}
function LimpiarFormulario() {
    $("#txtidtipovehiculo").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#chbEstatus").prop('checked', false);  // Desmarcar el checkbox
}


// Función que llama al servidor para obtener todos los vehículos
function GetAllTipoVehiculo() {
    GetMVC("/Catalog/GetAllTipoVehiculo", function (r) {
        if (r.IsSuccess) {
            // Mapea los datos recibidos a la tabla DataTable
            MapingPropertiesDataTable("tblTipoVehiculo", r.Response);
        } else {
            alert("Error al cargar los vehículos: " + r.ErrorMessage);
        }
    });
}
