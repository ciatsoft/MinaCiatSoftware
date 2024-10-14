$(document).ready(function () {
    $("#frmubicacion").validate({
        rules: {
            "txtNombreUbicacion": "required",
            "txtDescripcionUbicacion": "required",
        }
    });
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
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarUbicacion(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarUbicacion(' + data + ', this)" />'; // 'this' se pasa para obtener la fila
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
            "emptyTable": "Ning�n dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": "Buscar:",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "�ltimo",
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

    if (typeof UbicacionJson.Id != 0) {
        $("#txtIdUbicacion").val(UbicacionJson.Id);
        $("#txtNombreUbicacion").val(UbicacionJson.NombreUbicacion);
        $("#txtDescripcionUbicacion").val(UbicacionJson.DescripcionUbicacion);
        $("#chbEstatus").prop('checked', UbicacionJson.Estatus);
    }
});

// Funci�n que se ejecuta al hacer clic en el bot�n de Guardar
function SaveOrUpdateUbicacion() {
    if ($("#frmubicacion").valid()) {
        var parametro = {
            Id: $("#txtIdUbicacion").val(),
            NombreUbicacion: $("#txtNombreUbicacion").val(),
            DescripcionUbicacion: $("#txtDescripcionUbicacion").val(),
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
                window.location.href = '/Catalog/Ubicacion';
            }
        });

        console.log(parametro);
        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateUbicacion', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                alert("Datos guardados exitosamente.");
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}

// Funci�n para eliminar el rol con confirmaci�n y actualizaci�n de estatus
function EliminarUbicacion(id, boton) {
    // Obtener la fila correspondiente al bot�n de eliminaci�n
    var row = $(boton).closest("tr");

    // Obtener los valores de la fila y almacenarlos en variables
    var nombre = row.find("td:eq(0)").text();  // Nombre
    var descripcion = row.find("td:eq(1)").text();  // Descripci�n

    // Confirmaci�n de eliminaci�n
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar la siguiente Ubicación? \nNombre: " + nombre,
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
                Id: id,
                NombreUbicacion: nombre,
                DescripcionUbicacion: descripcion,
                Estatus: 0,  // Cambiamos el estatus a inactivo (0)
                CreatedBy: $("#txtCreatedBy").val(),
                CreatedDt: $("#txtCreatedDt").val(),
                UpdatedBy: $("#txtUpdatedBy").val(),
                UpdatedDt: new Date().toISOString()
            };
            console.log(parametro);
            window.location.href = '/Catalog/Ubicacion';
            PostMVC('/Catalog/SaveOrUpdateUbicacion', parametro, function (r) {
                window.location.href = '/Catalog/Ubicacion';
                if (r.IsSuccess) {
                    Swal.fire(
                        'Eliminado',
                        'La Ubicación ha sido eliminada.',
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
    $("#chbEstatus").prop('checked', false);
}