$(document).ready(function () {
    $("#frmroll").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        }
    });

    $("#tblRoll").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripcion" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRoll(' + data + ')" /> <input type="button" value="Eliminar" class="btn btn-custom-cancel" />';

                }
            }
        ]
    });


    GetAllRoll();  

    if (typeof rollJson.Id != 0) {
        $("#txtidroll").val(rollJson.Id);
        $("#txtNombre").val(rollJson.Nombre);
        $("#txtDescripcion").val(rollJson.Descripcion);
        $("#chbEstatus").prop('checked', rollJson.Estatus);
    }
});


// Función que se ejecuta al hacer clic en el botón de Guardar
function SaveOrUpdateRoll() {
    // Validamos el formulario antes de proceder
    if ($("#frmroll").valid()) {
        var parametro = {
            Id: $("#txtidroll").val(),
            Nombre: $("#txtNombre").val(),
            Descripcion: $("#txtDescripcion").val(),
            Estatus: $("#chbEstatus").is(':checked'),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateRoll', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();  // Función para limpiar las cajas de texto
                alert("Datos guardados exitosamente.");
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}


function EditarRoll(id) {
    location.href = "/Catalog/Roll/" + id;
}

// Función que llama al servidor para obtener todos los roles
function GetAllRoll() {
    GetMVC("/Catalog/GetAllRoll", function (r) {
        if (r.IsSuccess) {
            // Mapea los datos recibidos a la tabla DataTable
            MapingPropertiesDataTable("tblRoll", r.Response);
        } else {
            alert("Error al cargar los roles: " + r.ErrorMessage);
        }
    });
}

function LimpiarFormulario() {
    $("#txtidroll").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#chbEstatus").prop('checked', false);  // Desmarcar el checkbox
}
