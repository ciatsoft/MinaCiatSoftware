$(document).ready(function () {
    // PREVENIR AUTOCOMPLETADO DEL NAVEGADOR
    // Agregar atributos para evitar autocompletado
    $('#password').attr('autocomplete', 'new-password');

    // Limpiar campo de contraseña al cargar la página
    $('#password').val('');

    // Si es edición, permitir modificar la contraseña pero sin mostrar la actual
    if (typeof UsuariosJson != 'undefined' && UsuariosJson.Id != 0 && UsuariosJson.Id != null) {
        // En modo edición, limpiar el campo de contraseña
        $('#password').val('');
        $('#password').attr('placeholder', 'Dejar en blanco para mantener la contraseña actual');
    }

    // TOGGLE PARA MOSTRAR/OCULTAR CONTRASEÑA
    $('#togglePassword').on('click', function () {
        var passwordField = $('#password');
        var icon = $(this).find('i');

        if (passwordField.attr('type') === 'password') {
            passwordField.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordField.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // RESTANTE DE TU CÓDIGO EXISTENTE...
    $("#frmUsuario").validate({
        rules: {
            nombre: "required",
            username: "required",
            email: {
                required: true,
                email: true
            },
            password: {
                required: function () {
                    // La contraseña es obligatoria solo si es un nuevo usuario
                    var id = $("#id").val();
                    return !id || id === '0' || id === '';
                }
            }
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            username: "Por favor ingrese el username",
            email: {
                required: "Por favor ingrese el correo electrónico",
                email: "Por favor ingrese un correo electrónico válido"
            },
            password: "Por favor ingrese la contraseña",
        },
        errorElement: "span",
        errorClass: "help-block",
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });

    $("#frmUsuario").validate({
        rules: {
            nombre: "required",
            username: "required",
            email: {
                required: true,
                email: true
            },
            password: "required",
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            username: "Por favor ingrese el username",
            email: {
                required: "Por favor ingrese el correo electrónico",
                email: "Por favor ingrese un correo electrónico válido"
            },
            password: "Por favor ingrese la contraseña",
        },
        errorElement: "span",
        errorClass: "help-block",
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });

    // Inicialización de la tabla
    var table = $("#tblUsuarios").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "userName", title: "UserName", className: "text-center" },
            { data: "password", title: "Contraseña", visible: false },
            { data: "nombre", title: "Nombre", className: "text-center" },
            { data: "email", title: "Correo", className: "text-center" },
            {
                data: "estatus",
                visible:false,
                title: "Estatus",
                className: "text-center",
                render: function (data, type, row) {
                    if (data == 1) {
                        return '<span class="label label-success"><i class="fa fa-check"></i> Activo</span>';
                    } else {
                        return '<span class="label label-danger"><i class="fa fa-times"></i> Inactivo</span>';
                    }
                }
            },
            {
                data: "id",
                title: "Acciones",
                className: "text-center",
                orderable: false,
                render: function (data) {
                    return '<button class="btn btn-primary btn-sm btnEditarUsuario" data-id="' + data + '" title="Editar">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-danger btn-sm btnEliminarUsuario" data-id="' + data + '" title="Eliminar">' +
                        '<i class="fa fa-trash"></i> Eliminar</button>';
                }
            }
        ],
        language: {
            "decimal": ".",
            "thousands": ",",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": '<i class="fa fa-list"></i> Mostrar _MENU_ registros',
            "zeroRecords": '<i class="fa fa-info-circle"></i> No se encontraron resultados',
            "emptyTable": '<i class="fa fa-database"></i> No hay datos disponibles',
            "info": '<i class="fa fa-info-circle"></i> Mostrando _START_ a _END_ de _TOTAL_ registros',
            "infoEmpty": '<i class="fa fa-info-circle"></i> Mostrando 0 a 0 de 0 registros',
            "infoFiltered": '<i class="fa fa-filter"></i> (filtrado de _MAX_ registros totales)',
            "search": '<i class="fa fa-search"></i> Buscar:',
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i> Primero',
                "last": '<i class="fa fa-fast-forward"></i> Último',
                "next": '<i class="fa fa-forward"></i> Siguiente',
                "previous": '<i class="fa fa-backward"></i> Anterior'
            },
            "aria": {
                "sortAscending": ": activar para ordenar ascendente",
                "sortDescending": ": activar para ordenar descendente"
            }
        }
    });

    GetAllUsuario();

    if (typeof usuarioJson != 'undefined' && usuarioJson.Id != 0) {
        $("#id").val(usuarioJson.Id);
        $("#nombre").val(usuarioJson.nombre);
        $("#username").val(usuarioJson.userName);
        $("#email").val(usuarioJson.email);
        $("#password").val(usuarioJson.password);
    }

    // Evento para editar usuario
    $(document).on('click', '.btnEditarUsuario', function () {
        var id = $(this).data('id');
        EditarUsuario(id);
    });

    // Evento para eliminar usuario
    $(document).on('click', '.btnEliminarUsuario', function () {
        var id = $(this).data('id');
        EliminarUsuario(id);
    });
});

function SaveOrUpdateUsuario() {
    if ($("#frmUsuario").valid()) {
        var parametro = {
            Id: $("#id").val() || 0,
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
        PostMVC('/Administracion/SaveOrUpdateUsuario', parametro, function (r) {
            if (r.IsSuccess) {
                swal({
                    title: "¡Éxito!",
                    text: "El usuario se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#337ab7'
                }, function () {
                    window.location.href = '/Administracion/Usuarios';
                });
            } else {
                swal({
                    title: "¡Éxito!",
                    text: "El usuario se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#337ab7'
                }, function () {
                    window.location.href = '/Administracion/Usuarios';
                });
            }
        });
    } else {
        swal({
            title: "Validación",
            text: "Por favor complete todos los campos requeridos.",
            type: "warning",
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#f0ad4e'
        });
    }
}

function EditarUsuario(id) {
    location.href = "/Administracion/Usuarios/" + id;
}

function EliminarUsuario(id) {
    swal({
        title: "¿Estás seguro?",
        text: "¿Deseas eliminar este usuario? Esta acción no se puede deshacer.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d9534f",
        cancelButtonColor: "#5bc0de",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: true
    }, function (isConfirmed) {
        if (isConfirmed) {
            window.location.href = '/Administracion/Usuarios';
            PostMVC('/Administracion/DeleteUsuario', { id: id }, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "¡Eliminado!",
                        text: "El usuario se ha eliminado correctamente.",
                        type: "success",
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#337ab7'
                    }, function () {
                        window.location.href = '/Administracion/Usuarios';
                    });
                } else {
                    swal({
                        title: "¡Eliminado!",
                        text: "El usuario se ha eliminado correctamente.",
                        type: "success",
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#337ab7'
                    }, function () {
                        window.location.href = '/Administracion/Usuarios';
                    });
                }
            });
        }
    });
}

function GetAllUsuario() {
    GetMVC("/Administracion/GetAllUsuario", function (r) {
        if (r.IsSuccess && r.Response) {
            MapingPropertiesDataTable("tblUsuarios", r.Response);
        } else if (r.Response === null || r.Response.length === 0) {
            // Limpiar tabla si no hay datos
            var table = $("#tblUsuarios").DataTable();
            table.clear().draw();
        } else {
            swal({
                title: "Error",
                text: "Error al cargar los usuarios: " + (r.ErrorMessage || "Error desconocido"),
                type: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: '#d9534f'
            });
        }
    });
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#id").val('');
    $("#nombre").val('');
    $("#username").val('');
    $("#password").val('');
    $("#email").val('');
    $("#frmUsuario").validate().resetForm();
    $('.form-group').removeClass('has-error');
}

// Evento para permisos
$("#btnPermisos").on('click', function () {
    var id = $("#id").val();
    if (id && id !== '0') {
        AbrirModalPermisosUsuario(id);
    } else {
        swal({
            title: "Advertencia",
            text: "Primero debe guardar el usuario antes de asignar permisos.",
            type: "warning",
            confirmButtonText: "Aceptar",
            confirmButtonColor: '#f0ad4e'
        });
    }
});

function AbrirModalPermisosUsuario(id) {
    $("#genericModal").removeData('modal');
    $("#boddyGeericModal").empty();
    $("#titleGenerciModal").html('<i class="fa fa-key"></i> Roles para Usuario');

    $("#boddyGeericModal").load("/Administracion/AbrirModalPermisosUsuario/" + id, function () {
        $("#genericModal").modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#genericModal").modal("show");
    });
}