$(document).ready(function () {
    $("#frmusuario").validate({
        rules: {
            "txtNombreUsuario": "required",
            "txtPassword": "required",
            "txtNombre": "required",
            "txtEmail": "required",
        }
    });

    // Inicialización de la tabla de roles
    $("#tableUsuario").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "userName", title: "UserName" },
            { data: "password", title: "Contraseña" },
            { data: "nombre", title: "Nombre" },
            { data: "email", title: "Correo" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarUnidad(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarUnidad(' + data + ', this)" />'; // 'this' se pasa para obtener la fila
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
    GetAllUsuario();

    if (typeof usuarioJson.Id != 0) {
        $("#txtUsuario").val(usuarioJson.Id);
        $("#txtNombreUsuario").val(usuarioJson.txtNombreUsuario);
        $("#txtPassword").val(usuarioJson.txtPassword);
        $("#txtNombre").val(usuarioJson.txtNombre);
        $("#txtEmail").val(usuarioJson.txtEmail);
        $("#chbEstatus").prop('checked', usuarioJson.Estatus);
    }
});

function SaveOrUpdateUsuario() {
    if ($("#frmusuario").valid()) {
        var parametro = {
            Id: $("#txtUsuario").val(),
            UserName: $("#txtNombreUsuario").val(),
            Password: $("#txtPassword").val(),
            Nombre: $("#txtNombre").val(),
            Email: $("#txtEmail").val(),
            Estatus: $("#chbEstatus").is(':checked'),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };
        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Usuario/SaveOrUpdateUsuario', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                alert("Datos guardados exitosamente.");
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}

function EliminarUnidad(id, boton) {
    // Obtener la fila correspondiente al botón de eliminación
    var row = $(boton).closest("tr");

    // Obtener los valores de la fila y almacenarlos en variables
    var nombre = row.find("td:eq(0)").text();  // Nombre
    var descripcion = row.find("td:eq(1)").text();  // Descripción

    // Confirmación de eliminación
    if (confirm("¿Usted desea eliminar la siguiente medida? \nNombre: " + nombre + "\nDescripcion: " + descripcion)) {
        // Actualizamos el estatus a "Inactivo" (0) y preparamos el parámetro
        var parametro = {
            Id: id,
            UserName: userName,
            Password: password,
            Nombre: nombre,
            Email: email,
            Estatus: 0,  // Cambiamos el estatus a inactivo (0)
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),  // Asignamos el valor de quien está actualizando
            UpdatedDt: new Date().toISOString()  // Asignamos la fecha y hora actual como fecha de actualización
        };

        window.location.href = '/Seguridad/Usuario';
        // Llamada para guardar o actualizar el rol
        PostMVC('/Seguridad/SaveOrUpdateUsuario', parametro, function (r) {
            if (r.IsSuccess) {
                alert("Rol eliminado exitosamente.");
                // Actualiza la interfaz de usuario, por ejemplo, eliminando la fila de la tabla
            } else {
                alert("Error al eliminar el rol: " + r.ErrorMessage);
            }
        });
    }
}

function EditarUnidad(id) {
    location.href = "/Seguridad/Usuario/" + id;
}

function GetAllUsuario() {
    GetMVC("/Seguridad/GetAllUsuario", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableUsuario", r.Response);
        } else {
            alert("Error al cargar los roles: " + r.ErrorMessage);
        }
    });
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtUsuario").val('');
    $("#txtNombreUsuario").val('');
    $("#txtPassword").val('');
    $("#txtNombre").val('');
    $("#txtEmail").val('');
    $("#chbEstatus").prop('checked', false);
}

