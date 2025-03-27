$(document).ready(function () {
    $("#frmunidadmedida").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        }
    });

    // Inicialización de la tabla de roles
    $("#tableUnidadMedida").dataTable({
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
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarUnidad(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarUnidad(' + data + ')" />'; // 'this' se pasa para obtener la fila
                }
            }
        ]
        ,
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

    GetAllUnidadMedida();

    if (typeof unidadJson.Id != 0) {
        $("#txtunidadmedida").val(unidadJson.Id);
        $("#txtNombre").val(unidadJson.Nombre);
        $("#txtDescripcion").val(unidadJson.Descripcion);
        $("#chbEstatus").prop('checked', unidadJson.Estatus);
    }
});

// Función que se ejecuta al hacer clic en el botón de Guardar
function SaveOrUpdateUnidadMedida() {
    if ($("#frmunidadmedida").valid()) {
        var parametro = {
            Id: $("#txtunidadmedida").val(),
            Nombre: $("#txtNombre").val(),
            Descripcion: $("#txtDescripcion").val(),
            Estatus: $("#chbEstatus").is(':checked'),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        Swal.fire({
            title: "Registro guardado!",
            text: "El registro se ha guardado correctamente.",
            icon: "success",
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/Catalog/UnidadMedida';
            }
        });

        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateUnidadMedida', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                alert("Datos guardados exitosamente.");
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}

// Función para eliminar el rol con confirmación y actualización de estatus
function EliminarUnidad(id) {
    // Obtener la fila correspondiente al botón de eliminación
    //var row = $(boton).closest("tr");

    // Obtener los valores de la fila y almacenarlos en variables
    //var nombre = row.find("td:eq(0)").text();  // Nombre
    //var descripcion = row.find("td:eq(1)").text();  // Descripción

    // Confirmación de eliminación
    // Confirmación de eliminación con SweetAlert
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar el registro?",
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
            //window.location.href = '/Catalog/UnidadMedida';
            PostMVC('/Catalog/DeleteUnidadMedida', parametro, function (r) {
                //window.location.href = '/Catalog/UnidadMedida';
                if (r.IsSuccess) {
                    Swal.fire(
                        'Eliminado',
                        'La medida ha sido eliminada.',
                        'success'
                    ).then(() => {
                        window.location.href = '/Catalog/UnidadMedida';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar la medida: ' + r.ErrorMessage,
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}


function EditarUnidad(id) {
    location.href = "/Catalog/UnidadMedida/" + id;
}

// Función que obtiene todos los roles
function GetAllUnidadMedida() {
    GetMVC("/Catalog/GetAllUnidadMedida", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableUnidadMedida", r.Response);
        } else {
            alert("Error al cargar los roles: " + r.ErrorMessage);
        }
    });
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtunidadmedida").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#chbEstatus").prop('checked', false);
}
