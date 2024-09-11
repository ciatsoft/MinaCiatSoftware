// Inicializa la validación del formulario cuando el DOM esté listo
$(function () {
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
            Estatus: $("#chkEstatus").is(':checked') ? 'Activo' : 'Inactivo',
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateTipoVehiculo', parametro, function (r) {
            if (r.IsSuccess) {
                location.href = "/Catalog/TipoVehiculo" + r.Response.id;
            } else {
                alert("Error al guardar los datos");
            }
        });
    }
}


// Inicializa la tabla DataTable para mostrar los vehículos
 $(document).ready(function () {
     $('#tblTipoVehiculo').DataTable({
         processing: true,
         destroy: true,
         paging: true,
         searching: true,
         columns: [
             { data: "Id", "visible": false, title: "ID" },  // Columna de ID (oculta)
             { data: "NombreVehiculo", title: "Vehículo" },  // Columna de nombre de vehículo
             { data: "Descripcion", title: "Descripción" },  // Columna de descripción
             { data: "Estatus", title: "Estatus" }  // Columna de estatus (activo/inactivo)
        ]
    });
//
//    // Cargar todos los tipos de vehículos al cargar la página
    GetAllVehiculos();
});

// Función que llama al servidor para obtener todos los vehículos
function GetAllVehiculos() {
    GetMVC("/Catalog/GetAllVehiculos", function (r) {
        if (r.IsSuccess) {
            // Mapea los datos recibidos a la tabla DataTable
            MapingPropertiesDataTable("tblTipoVehiculo", r.Response);
        } else {
            alert("Error al cargar los vehículos");
        }
    });
}
