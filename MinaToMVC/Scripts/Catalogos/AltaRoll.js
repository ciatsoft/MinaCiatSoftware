$(document).ready(function () {
    // Inicializa la validación del formulario cuando el DOM esté listo
    $("#frmroll").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        }
    });
});

// Función que se ejecuta al hacer clic en el botón de Guardar
function SaveOrUpdateRoll() {
    // Validamos el formulario antes de proceder
    if ($("#frmroll").valid()) {
        var parametro = {
            Id: $("#txtidroll").val(),  // Actualizado
            Nombre: $("#txtNombre").val(),
            Descripcion: $("#txtDescripcion").val(),
            Estatus: $("#chbEstatus").is(':checked'),  // Booleano directo
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateRoll', parametro, function (r) {  // Actualizado
            if (r.IsSuccess) {
                location.href = "/Catalog/Roll/" + r.Response.id;  // Actualizado
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}

$(document).ready(function () {
    $("#tblRoll").dataTable({  // Actualizado
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
                    // Si estatus es 1, muestra "Activo", si es 0, muestra "Inactivo"
                    return data == 1 ? "Activo" : "Inactivo";
                }
            }
        ]
    });

    GetAllRoll();  // Actualizado
});

// Función que llama al servidor para obtener todos los roles
function GetAllRoll() {  // Actualizado
    GetMVC("/Catalog/GetAllRoll", function (r) {  // Actualizado
        if (r.IsSuccess) {
            // Mapea los datos recibidos a la tabla DataTable
            MapingPropertiesDataTable("tblRoll", r.Response);  // Actualizado
        } else {
            alert("Error al cargar los roles: " + r.ErrorMessage);  // Actualizado
        }
    });
}
