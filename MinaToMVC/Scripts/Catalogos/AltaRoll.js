$(document).ready(function () {
    $("#frmroll").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        }
    });

    // Inicializaci�n de la tabla de roles
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
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRoll(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRoll(' + data + ', this)" />'; // 'this' se pasa para obtener la fila
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

// Funci�n que se ejecuta al hacer clic en el bot�n de Guardar
function SaveOrUpdateRoll() {
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

        window.location.href = '/Catalog/Roll';
        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateRoll', parametro, function (r) {
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
function EliminarRoll(id, boton) {
    // Obtener la fila correspondiente al bot�n de eliminaci�n
    var row = $(boton).closest("tr");

    // Obtener los valores de la fila y almacenarlos en variables
    var nombre = row.find("td:eq(0)").text();  // Nombre
    var descripcion = row.find("td:eq(1)").text();  // Descripci�n

    // Confirmaci�n de eliminaci�n
    if (confirm("�Est�s seguro de que deseas eliminar este rol? \nNombre: " + nombre + "\nDescripci�n: " + descripcion)) {
        // Actualizamos el estatus a "Inactivo" (0) y preparamos el par�metro
        var parametro = {
            Id: id,
            Nombre: nombre,
            Descripcion: descripcion,
            Estatus: 0,  // Cambiamos el estatus a inactivo (0)
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),  // Asignamos el valor de quien est� actualizando
            UpdatedDt: new Date().toISOString()  // Asignamos la fecha y hora actual como fecha de actualizaci�n
        };

        window.location.href = '/Catalog/Roll';
        // Llamada para guardar o actualizar el rol
        PostMVC('/Catalog/SaveOrUpdateRoll', parametro, function (r) {
            if (r.IsSuccess) {
                alert("Rol eliminado exitosamente.");
                // Actualiza la interfaz de usuario, por ejemplo, eliminando la fila de la tabla
                row.remove();  // Eliminar la fila de la tabla si es necesario
            } else {
                alert("Error al eliminar el rol: " + r.ErrorMessage);
            }
        });
    }
}


function EditarRoll(id) {
    location.href = "/Catalog/Roll/" + id;
}

// Funci�n que obtiene todos los roles
function GetAllRoll() {
    GetMVC("/Catalog/GetAllRoll", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblRoll", r.Response);
        } else {
            alert("Error al cargar los roles: " + r.ErrorMessage);
        }
    });
}

// Funci�n para limpiar el formulario
function LimpiarFormulario() {
    $("#txtidroll").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#chbEstatus").prop('checked', false);
}
