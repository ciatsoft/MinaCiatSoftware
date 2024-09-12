$(document).ready(function () {
    // Inicializa la validación del formulario cuando el DOM esté listo
    $("#frmtipovehiculo").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        }
    });

   
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
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

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

$(document).ready(function () {
    $("#tblTipoVehiculo").dataTable({
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

    GetAllTipoVehiculo();
});

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
