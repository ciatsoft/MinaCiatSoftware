$(document).ready(function () {
    $("#frmCliente").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        }
    });

    // Inicialización de la tabla de roles
    $("#tbCliente").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "telefono", title: "Telefono" },
            { data: "email", title: "Email" },
            { data: "comentarios", title: "Comentarios" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarCliente(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarCliente(' + data + ', this)" />'; // 'this' se pasa para obtener la fila
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

    GetAllCliente();

    if (typeof clienteJson.Id != 0) {
        $("#txtIdCliente").val(clienteJson.Id);
        $("#txtNombre").val(clienteJson.Nombre);
        $("#txtTelefono").val(clienteJson.Telefono);
        $("#txtEmail").val(clienteJson.Email);
        $("#txtComentarios").val(clienteJson.Comentarios);
        $("#chbEstatus").prop('checked', clienteJson.Estatus);
        
    }
});

// Función que se ejecuta al hacer clic en el botón de Guardar
function SaveOrupdateCliente() {
    if ($("#frmCliente").valid()) {
        var parametro = {
            Id: $("#txtIdCliente").val(),
            Nombre: $("#txtNombre").val(),
            Telefono: $("#txtTelefono").val(),
            Email: $("#txtEmail").val(),
            Descripcion: $("#txtComentarios").val(),
            Estatus: $("#chbEstatus").is(':checked'),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        window.location.href = '/Administracion/Clientes';
        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Administracion/SaveOrUpdateCliente', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                alert("Datos guardados exitosamente.");
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}

// Función para eliminar el rol con confirmación y actualización de estatus
function EliminarCliente(id, boton) {
    // Obtener la fila correspondiente al botón de eliminación
    var row = $(boton).closest("tr");

    // Obtener los valores de la fila y almacenarlos en variables
    var nombre = row.find("td:eq(0)").text();  // Nombre
    var Comentario = row.find("td:eq(1)").text();  // 

    // Confirmación de eliminación
    if (confirm("¿Usted desea eliminar el siguiente rol? \nNombre: " + nombre + "\nComentario: " + Comentario)) {
        // Actualizamos el estatus a "Inactivo" (0) y preparamos el parámetro
        var parametro = {
            Id: id,
            Nombre: nombre,
            Comentario: Comentario,
            Estatus: 0,  // Cambiamos el estatus a inactivo (0)
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),  // Asignamos el valor de quien está actualizando
            UpdatedDt: new Date().toISOString()  // Asignamos la fecha y hora actual como fecha de actualización
        };

        window.location.href = '/Administracion/Clientes';
        // Llamada para guardar o actualizar el Cliente
        PostMVC('/Administracion/SaveOrUpdateCliente', parametro, function (r) {
            if (r.IsSuccess) {
                alert("Cliente eliminado exitosamente.");
                // Actualiza la interfaz de usuario, por ejemplo, eliminando la fila de la tabla
            } else {
                alert("Error al eliminar el rol: " + r.ErrorMessage);
            }
        });
    }
}


function EditarCliente(id) {
    location.href = "/Administracion/Clientes/" + id;
}

// Función que obtiene todos los roles
function GetAllCliente() {
    GetMVC("/Administracion/GetAllCliente", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tbCliente", r.Response);
        } else {
            alert("Error al cargar los roles: " + r.ErrorMessage);
        }
    });
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtidroll").val('');
    $("#txtNombre").val('');
    $("#txtTelefono").val('');
    $("#txtEmail").val('');
    $("#txtComentarios").val('');
    $("#chbEstatus").prop('checked', false);
}
