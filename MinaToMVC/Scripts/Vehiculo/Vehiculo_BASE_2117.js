$(document).ready(function () {
    //Validacion del formuklario
    $("#frmVehiculoCrud").validate({
        rules: {
            "txtPlaca": "required",
            "txtColor": "required"
        }
    });

    //Datos en la tabla
    $("#tblvehiculo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "tipoVehiculo.nombre", title: "Vehiculo" },
            { data: "placa", title: "Placas" },
            { data: "color", title: "Color" },
            {data: "Estado", title: "Estado"}
            
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRoll(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRoll(' + data + ')"/>'; // 'this' se pasa para obtener la fila
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

    GetAllVehiculo();

    
});
function EliminarVehiculo(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar el siguiente registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Actualizamos el estatus a "Inactivo" (0) y preparamos el par�metro
            var parametro = {
                Id: id
            };

            ///window.location.href = '/Catalog/Roll';
            PostMVC('/Vehiculo/GetAllVehiculo', parametro, function (r) {
                //window.location.href = '/Catalog/Roll';
                if (r.IsSuccess) {
                    Swal.fire(
                        'Eliminado',
                        'El Vehiculo ha sido eliminada.',
                        'success'
                    ).then(() => {
                        window.location.href = '/Vehiculo/GetAllVehiculo';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar el Vehiculo: ' + r.ErrorMessage,
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}
function SaveOrUpdateVehiculol() {
    if ($("#frmroll").valid()) {
        var parametro = {
            Id: $("#txtidVehiculo").val(),
            Nombre: $("#txtPlacas").val(),
            Descripcion: $("#txtColor").val(),
            Estado: $('#txtEstado').val(),
            CreatedDt: $("#txtCreatedDt").val()

        };


        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateRoll', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();

                Swal.fire({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/Vehiculo/GetAllVehiculo';
                    }
                });
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
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
                text: 'Error al cargar los vehiculos: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}
function EditarVehiculo(id) {
    location.href = "Vehiculo/GetAllVehiculo" + id;
}

function LimpiarFormulario() {
   
}