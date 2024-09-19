
$(document).ready(function () {
    // Inicializa la validación del formulario cuando el DOM esté listo
    $("#frmroll").validate({
        rules: {
            "txtNombre": {
                required: true,
                minlength: 1,
                maxlength: 80,
                pattern: "^[A-Za-záéíóúÁÉÍÓÚñÑ ]+$"  // Solo letras y espacios
            },
            "txtDescripcion": "required",
        },
        messages: {
            "txtNombre": {
                required: "Este campo es obligatorio.",
                maxlength: "El nombre no puede tener más de 80 caracteres."
            },
            "txtDescripcion": "Este campo es obligatorio."
        }
    });

    // Agregar un método de validación para solo letras
    $.validator.addMethod("pattern", function (value, element, param) {
        return this.optional(element) || new RegExp(param).test(value);
    });
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
                // Recarga la página después de guardar exitosamente
                location.reload();
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    } else {
        // Mostrar mensaje de error si la validación falla
        alert("Por favor, corrige los errores en el formulario."); // Mensaje de error general
    }
}

$(document).ready(function () {
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
                    // Si estatus es 1, muestra "Activo", si es 0, muestra "Inactivo"
                    return data == 1 ? "Activo" : "Inactivo";
                }
            }
        ]
    });

    GetAllRoll();  // Carga inicial de roles
});

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
