$(document).ready(function () {
    // Validación del formulario
    $("#frmVehiculoCrud").validate({
        rules: {
            "txtPlaca": "required",
            "txtColor": "required",
            "txtEstado": "requerid",
            
        }
    });

    // Datos en la tabla
    $("#tblvehiculo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "tipoVehiculo.nombre", title: "Vehiculo" },
            { data: "placa", title: "Placas" },
            { data: "color", title: "Color" },
            { data: "comentario", title: "Comentario" },
            {
                data: "estado",
                title: "Estado",
                render: function (valor) {
                    if (valor == 'En patio') {
                        return "<span style='display: inline-block; width: 20px; height: 20px; background-color: #51b00b; border-radius: 50%; animation: blink 1s infinite alternate;'></span> En Patio";
                    } else if (valor == 'En viaje') {
                        return "<span style='display: inline-block; width: 20px; height: 20px; background-color: yellow; border-radius: 50%; animation: blink 1s infinite alternate;'></span> En Viaje";
                    } else if (valor == 'En taller') {
                        return "<span style='display: inline-block; width: 20px; height: 20px; background-color: red; border-radius: 50%; animation: blink 1s infinite alternate;'></span> En Taller";
                    } else {
                        return "<span style='display: inline-block; width: 20px; height: 20px; background-color: blue; border-radius: 50%; animation: blink 1s infinite alternate;'></span> Sin estado";
                    }
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
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarVehiculo(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarVehiculo(' + data + ')"/>';
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

    GetAllVehiculo();
});

function EliminarVehiculo(id) {
    Swal.fire({
        title: 'Eliminar Registro',
        text: "Se eliminara el siguiente registro",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/Vehiculo/EliminarVehiculo', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El vehiculo ha sido eliminado.', 'success')
                        .then(() => { window.location.href = '/Taller/Vehiculos'; });
                } else {
                    Swal.fire('Eliminado', 'El vehiculo ha sido eliminado.', 'success')
                        .then(() => { window.location.href = '/Taller/Vehiculos'; });
                }
            });
        }
    });
}

function SaveOrUpdateVehiculo() {
    if ($("#frmVehiculoCrud").valid()) {
        var parametro = {
            Id: $("#Id").val(),
            Placa: $("#txtPlaca").val(),
            Color: $("#txtColor").val(),
            Estado: $("#txtEstado").val(),
            Comentario: $("#txtComentario").val(),
            TipoVehiculo: {
                Id: $("#TipoVehiculo_Id").val()
            }
        };

        PostMVC('/Vehiculo/SaveOrUpdateVehiculo', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                Swal.fire({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.reload();
                });

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar los datos: ' + r.ErrorMessage,
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
}

function GetAllVehiculo() {
    GetMVC("/Vehiculo/GetAllVehiculo", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblvehiculo", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los vehículos: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function EditarVehiculo(id) {
    location.href = "/Taller/Vehiculos/" + id;
}

function LimpiarFormulario() {
    $("#frmVehiculoCrud")[0].reset();
}