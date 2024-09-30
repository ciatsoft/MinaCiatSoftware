$(document).ready(function () {
    // Validación del formulario usando el mismo estilo que el código 2
    $("#frmTipoMaterialUbicacion").validate({
        rules: {
            "txtNombreTipoMaterial": "required",
            "txtDescripcionTipoMaterial": "required"
        }
    });

    // Inicialización de la tabla de tipo de material con formato similar al código 2
    $("#tableTipodematerial").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombreTipoMaterial", title: "Nombre Material" },
            { data: "descripcionTipoMaterial", title: "Descripción Material" },
            { data: "dtoUbicacion.nombreUbicacion", title: "Ubicación" },
            { data: "unidadMedida.nombre", title: "Unidad Medida" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
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

    // Cargar el registro en caso de edición con el mismo enfoque que el código 2
    if (typeof tipoMaterialUbicacionJson != 0) {
        $("#txtidtipomaterial").val(tipoMaterialUbicacionJson.Id);
        $("#txtNombreTipoMaterial").val(tipoMaterialUbicacionJson.NombreTipoMaterial);
        $("#txtDescripcionTipoMaterial").val(tipoMaterialUbicacionJson.DescripcionTipoMaterial);
        $("#chbEstatus").prop('checked', tipoMaterialUbicacionJson.Estatus);
    }
});

// Función para obtener todos los tipos de material (idéntica a la estructura del código 2)
function GetAllTipoMaterialUbicacion() {
    GetMVC("/Catalog/GetAllTipoMaterialUbicacion", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableTipodematerial", r.Response);
        } else {
            alert("Error al cargar los materiales: " + r.ErrorMessage);
        }
    });
}

// Función para guardar o actualizar, adaptada para ser similar al código 2
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
        PostMVC("/Catalog/SaveOrUpdateTipoMaterial", parametro, function (success, response) {
            if (success) {
                LimpiarFormulario();
                alert("Datos guardados exitosamente.");
            } else {
                alert("Error al guardar los datos: " + response.ErrorMessage);
            }
        });
    }
}

// Función para eliminar con confirmación y estructura de mensajes similares al código 2
function EliminarTipoMaterial(id, boton) {
    var row = $(boton).closest("tr");
    var nombre = row.find("td:eq(1)").text();
    var descripcion = row.find("td:eq(2)").text();

    if (confirm("¿Usted desea eliminar este tipo de material?\nNombre: " + nombre + "\nDescripción: " + descripcion)) {
        var parametro = {
            Id: id,
            NombreTipoMaterial: nombre,
            DescripcionTipoMaterial: descripcion,
            Estatus: 0,  // Se establece como inactivo
            UpdatedBy: $("#txtUpdateBy").val(),
            UpdatedDt: new Date().toISOString()
        };

        window.location.href = '/Catalog/TipoMaterialUbicacion';
        PostMVC("/Catalog/SaveOrUpdateTipoMaterial", parametro, function (success, response) {
            if (success) {
                alert("Tipo de material eliminado exitosamente.");
                row.remove();
            } else {
                alert("Error al eliminar el tipo de material: " + response.ErrorMessage);
            }
        });
    }
}

// Función para editar con estilo de redireccionamiento similar al código 2
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
