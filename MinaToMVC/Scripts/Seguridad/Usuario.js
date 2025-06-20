$(document).ready(function () {
    $("#frmUsuario").validate({
        rules: {
            "nombre": "required",
            "username": "required",
            "email": "required",
            "password": "required",
        }
    });

    // Inicialización de la tabla de roles
    $("#tblUsuarios").dataTable({
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
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarUsuario(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarUsuario(' + data + ', this)" />'; // 'this' se pasa para obtener la fila
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
        $("#id").val(usuarioJson.Id);
        $("#nombre").val(usuarioJson.nombre);
        $("#username").val(usuarioJson.username);
        $("#email").val(usuarioJson.email);
        $("#password").val(usuarioJson.password);
    }
});

function SaveOrUpdateUsuario() {
    if ($("#frmUsuario").valid()) {
        var parametro = {
            Id: $("#id").val(),
            UserName: $("#username").val(),
            Password: $("#password").val(),
            Nombre: $("#nombre").val(),
            Email: $("#email").val(),
            Estatus: 1,
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val()
        };
        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Administracion/SaveOrUpdateUsuario', parametro, function (r) {
            if (r.IsSuccess) {
                // Mostrar una alerta de éxito con SweetAlert
                Swal.fire({
                    title: "Registro guardado!",
                    text: "El usuario se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/Administracion/Usuarios';
                    }
                });
            } else {
                Swal.fire({
                    title: "Registro guardado!",
                    text: "El usuario se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/Administracion/Usuarios';
                    }
                });
            }
        });
    }
}

function EditarUsuario(id) {
    location.href = "/Administracion/Usuarios/" + id;
}

function EliminarUsuario(id) {
    PostMVC('/Administracion/DeleteUsuario', { id: id }, function (r) {
        if (r.IsSuccess) {
            Swal.fire({
                title: "Registro Eliminado!",
                text: "El usuario se ha eliminado correctamente.",
                icon: "success",
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/Administracion/Usuarios';
                }
            });
        } else {
            Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
        }
    });
}

function GetAllUsuario() {
    GetMVC("/Administracion/GetAllUsuario", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblUsuarios", r.Response);
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

