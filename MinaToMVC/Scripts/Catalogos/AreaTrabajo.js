$(document).ready(function () {
    $("#frmareaTrabajo").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        }
    });
    $("#tableareaTrabajo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripción" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="Editarareat(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="Eliminarareat(' + data + ', this)" />';
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

    GetAllAreaTrabajo();

    if (typeof areatJson.Id != 0) {
        $("#txtidareatrabajo").val(areatJson.Id);
        $("#txtNombre").val(areatJson.Nombre);
        $("#txtDescripcion").val(areatJson.Descripcion);
        
    }
});


// Función que se ejecuta al hacer clic en el botón de Guardar
function SaveOrUpdateAreaTrabajo() {
    // Validamos el formulario antes de proceder
    if ($("#frmareaTrabajo").valid()) {
        var parametro = {
            Id: $("#txtidareatrabajo").val(),
            Nombre: $("#txtNombre").val(),
            Descripcion: $("#txtDescripcion").val(),
            Estatus: true,  // Booleano directo
            CreatedDt: $("#txtCreatedDt").val(),
        };
        
        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateAreaTrabajo', parametro, function (r) {
            if (r.IsSuccess) {
                
                Swal.fire({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.href = "/Catalog/AreaTrabajo";
                    }
                });

            } else {
                Swal.fire({
                    
                    text: "Error al guardar los datos: " + r.ErrorMessage,
                    icon: "error",
                    confirmButtonText: 'OK'
                }).then((result) => {
                });
            }
        });
    }
}


// Función para eliminar el rol con confirmación y actualización de estatus
function Eliminarareat(id) {
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar la siguiente area de trabajo?",
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
            PostMVC('/Catalog/DeleteAreaTrabajo', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire(
                        'Eliminado',
                        'El area de trabajo ha sido eliminada.',
                        'success'
                    ).then(() => {
                        window.location.href = '/Catalog/AreaTrabajo';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar el area de trabajo: ' + r.ErrorMessage,
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}

function Editarareat(id) {
    location.href = "/Catalog/AreaTrabajo/" + id;
}
function LimpiarFormulario() {
    $("#txtidareatrabajo").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#chbEstatus").prop('checked', false);  // Desmarcar el checkbox
}


// Función que llama al servidor para obtener todos los vehículos
function GetAllAreaTrabajo() {
    GetMVC("/Catalog/GetAllAreaTrabajo", function (r) {
        if (r.IsSuccess) {
            // Mapea los datos recibidos a la tabla DataTable
            MapingPropertiesDataTable("tableareaTrabajo", r.Response);
        } else {
            alert("Error al cargar las areas disponibles: " + r.ErrorMessage);
        }
    });
}
