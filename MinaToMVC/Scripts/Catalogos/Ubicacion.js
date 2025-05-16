$(document).ready(function () {



    $("#tableUbicacion").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombreUbicacion", title: "Nombre" },
            { data: "descripcionUbicacion", title: "Descripción" },
            {
                data: "esInterna",
                title: "Tipo de mina",
                render: function (data, type, row) {
                    return data == 1 ? "Interna" : "Externa";
                }
            },
            {
                data: "id",
                render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarUbicacion(' + data + ')" />';
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

    GetAllUbicacion();

    // Al cargar la página, si ya hay un ID (estamos editando)
    if (UbicacionJson.Id != 0) {
        $("#txtIdUbicacion").val(UbicacionJson.Id);
        $("#txtNombreUbicacion").val(UbicacionJson.NombreUbicacion);
        $("#txtDescripcionUbicacion").val(UbicacionJson.DescripcionUbicacion);
        $("#Estatus").val(UbicacionJson.Estatus);
        $("#EsInterna").prop('checked', UbicacionJson.EsInterna);

        // Habilitar el botón de eliminar
        $("#btnEliminarUbicacion").prop('disabled', false);
        // Guardar el ID en el botón de eliminar
        $("#btnEliminarUbicacion").data('id', UbicacionJson.Id);
    }
});

// Función para editar ubicación
function EditarUbicacion(id) {
    // Guardar el ID en el botón de eliminar
    $("#btnEliminarUbicacion").data('id', id);
    // Habilitar el botón de eliminar
    $("#btnEliminarUbicacion").prop('disabled', false);
    // Redirigir a la página de edición
    location.href = "/Catalog/Ubicacion/" + id;
}

// Función para eliminar ubicación
function EliminarUbicacion() {
    // Obtener el ID guardado en el botón
    var id = $("#btnEliminarUbicacion").data('id');

    if (!id || id == 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se ha seleccionado una ubicación para eliminar',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            PostMVC('/Catalog/DeleteUbicacion', { id: id }, function (r) {
                if (r.IsSuccess) {
                    Swal.fire(
                        'Eliminado!',
                        'La ubicación ha sido eliminada.',
                        'success'
                    ).then(() => {
                        window.location.href = '/Catalog/Ubicacion';
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Error al eliminar la Ubicacion: ' + r.ErrorMessage,
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}

// Función que se ejecuta al hacer clic en el bot�n de Guardar
function SaveOrUpdateUbicacion() {
    if ($("#frmubicacion").valid()) {
        var parametro = {
            Id: $("#txtIdUbicacion").val(),
            NombreUbicacion: $("#txtNombreUbicacion").val(),
            DescripcionUbicacion: $("#txtDescripcionUbicacion").val(),
            Estatus: $("#Estatus").val(),
            CreatedBy: $("#CreatedBy").val(),
            CreatedDt: $("#CreatedDt").val(),
            UpdatedBy: $("#UpdatedBy").val(),
            UpdatedDt: $("#UpdatedDt").val(),
            EsInterna: $("#EsInterna").is(':checked')
        };

        console.log(parametro);
        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateUbicacion', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                Swal.fire({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/Catalog/Ubicacion';
                    }
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

function EditarUbicacion(id) {
    location.href = "/Catalog/Ubicacion/" + id;
}

// Funci�n que obtiene todos los roles
function GetAllUbicacion() {
    GetMVC("/Catalog/GetAllUbicacion", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableUbicacion", r.Response);
        } else {
            alert("Error al cargar las ubicaciones: " + r.ErrorMessage);
        }
    });
}

// Funci�n para limpiar el formulario
function LimpiarFormulario() {
    $("#txtIdUbicacion").val('');
    $("#txtNombreUbicacion").val('');
    $("#txtDescripcionUbicacion").val('');
    $("#Estatus").prop('checked', false);
}