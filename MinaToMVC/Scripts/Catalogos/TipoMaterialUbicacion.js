$(document).ready(function () {
    // Validación del formulario usando el mismo 
    $("#frmTipoMaterialUbicacion").validate({
        rules: {
            "txtNombreTipoMaterial": "required",
            "txtDescripcionTipoMaterial": "required"
        }
    });

    // Inicialización de la tabla de tipo de material con formato 
    $("#tableTipodematerial").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombreTipoMaterial", title: "Nombre" },
            { data: "descripcionTipoMaterial", title: "Descripción Material" },
            { data: "dtoUbicacion.nombreUbicacion", title: "Ubicación" },
            { data: "unidadMedida.nombre", title: "Unidad Medida" },
            { data: "dtoUbicacion.id", title: "Ubicación" },
            { data: "unidadMedida.id", title: "Unidad Medida" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", title: "Acciones" , render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarTipoMaterial(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarTipoMaterial(' + data + ', this)" />';
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

    GetAllTipoMaterialUbicacion();

    // Cargar el registro en caso de edición 
    if (typeof tipoMaterialUbicacionJson != 0) {
        $("#txtidtipomaterial").val(tipoMaterialUbicacionJson.Id);
        $("#txtNombreTipoMaterial").val(tipoMaterialUbicacionJson.NombreTipoMaterial);
        $("#txtDescripcionTipoMaterial").val(tipoMaterialUbicacionJson.DescripcionTipoMaterial);
        $("#chbEstatus").prop('checked', tipoMaterialUbicacionJson.Estatus);
    }
});



// Función para guardar o actualizar
function SaveOrUpdateTipoMaterialUbicacion() {
    if ($("#frmTipoMaterialUbicacion").valid()) {
        var parametro = {
            Id: $("#txtidtipomaterial").val(),
            NombreTipoMaterial: $("#txtNombreTipoMaterial").val(),
            DescripcionTipoMaterial: $("#txtDescripcionTipoMaterial").val(),
            DtoUbicacion: { Id: $("#ddlUbicacion").val() },
            UnidadMedida: { Id: $("#ddlUnidadDeMedida").val() },
            Estatus: $("#chbEstatus").is(':checked'),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdateBy").val(),
            UpdatedDt: $("#txtUpdateDt").val()
        };

        // Actualizar la navegación
        window.location.href = '/Catalog/TipoMaterialUbicacion';
        console.log("Parámetros enviados para la eliminación:", parametro);
        PostMVC("/Catalog/SaveOrUpdateTipoMaterialUbicacion", parametro, function (success, response) {
            if (success) {
                LimpiarFormulario();
                alert("Datos guardados exitosamente.");
            } else {
                alert("Error al guardar los datos: " + response.ErrorMessage);
            }
        });
    }
}

// Función para eliminar con confirmación y estructura de mensajes 
function EliminarTipoMaterial(id, boton) {
    // Obtener la fila correspondiente al botón de eliminación.
    var row = $(boton).closest("tr");

    // Extraer el nombre y la descripción de las celdas correspondientes.
    var nombre = row.find("td:eq(0)").text(); // Columna para el nombre
    var descripcion = row.find("td:eq(1)").text(); // Columna para la descripción
    var idUbicacion = row.find("td:eq(4)").text(); // Columna oculta para el ID de ubicación
    var idUnidadMedida = row.find("td:eq(5)").text(); // Columna oculta para el ID de unidad de medida

    // Asignar los valores de los campos ocultos que contienen el usuario y la fecha actual.
    var UpdatedBy = $("#txtUpdatedBy").val();
    var UpdatedDt = $("#txtUpdatedDt").val();

    // Confirmar la eliminación con el usuario.
    if (confirm("¿Usted desea eliminar este tipo de material?\nNombre: " + nombre + "\nDescripción: " + descripcion
        + "\nID Ubicación: " + idUbicacion + "\nID Unidad de Medida: " + idUnidadMedida + "\nUsuario: " + UpdatedBy + " " + UpdatedDt)) {
        // Crear el objeto con los parámetros para enviar al servidor.
        var parametro = {
            Id: id,
            NombreTipoMaterial: nombre,
            DescripcionTipoMaterial: descripcion,
            DtoUbicacion: idUbicacion, // Añadir ID de ubicación
            UnidadMedida: idUnidadMedida, // Añadir ID de unidad de medida
            Estatus: 0,  // Se establece como inactivo.
            UpdatedBy: UpdatedBy,
            UpdatedDt: UpdatedDt
        };

        // Actualizar la navegación
        window.location.href = '/Catalog/TipoMaterialUbicacion';
        // Enviar la solicitud POST usando la función `PostMVC`.
        console.log("Parámetros enviados para la eliminación:", parametro);
        PostMVC("/Catalog/SaveOrUpdateTipoMaterialUbicacion", parametro, function (success, response) {
            if (success) {
                alert("Tipo de material eliminado exitosamente.");
            } else {
                alert("Error al eliminar el tipo de material: " + response.ErrorMessage);
            }
        });
    }
}


// Función para editar con estilo de redireccionamiento 
function EditarTipoMaterial(id) {
    location.href = "/Catalog/TipoMaterialUbicacion/" + id;
}

// Función para limpiar el formulario con estilo uniforme
function LimpiarFormulario() {
    $("#txtidtipomaterial").val('');
    $("#txtNombreTipoMaterial").val('');
    $("#txtDescripcionTipoMaterial").val('');
    $("#ddlUbicacion").val('');
    $("#ddlUnidadDeMedida").val('');
    $("#chbEstatus").prop('checked', false);
}

// Función para obtener todos los tipos de material
function GetAllTipoMaterialUbicacion() {
    GetMVC("/Catalog/GetAllTipoMaterialUbicacion", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableTipodematerial", r.Response);
        } else {
            alert("Error al cargar los materiales: " + r.ErrorMessage);
        }
    });
}