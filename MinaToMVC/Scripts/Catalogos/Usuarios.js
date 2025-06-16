$(document).ready(function () {
    $("#frmUsuario").validate({
        rules: {
            "nombre": "required",
            "username": "required",
            "email": "required",
            "password": "required"
        },
        messages: {
            "nombre": "El nombre es obligatorio.",
            "username": "El Username es obligatorio.",
            "email": "El correo es obligatorio.",
            "password": "La contraseña es obligatoria."
        }
    });

    $("#tblUsuarios").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: true, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "username", title: "Nombre de Usuario" },
            { data: "name", title: "Nombre" },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return `
                        <input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarUsuario(${data})" />
                        <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarUsuario(${data})" />
                    `;
                }
            }
        ],
        language: {
            decimal: ",",
            thousands: ".",
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ entradas",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de un total de _MAX_ entradas)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            aria: {
                sortAscending: ": activar para ordenar ascendente",
                sortDescending: ": activar para ordenar descendente"
            }
        }
    });

    GetAllUsuario();

    if (typeof UsuariosJson !== "undefined" && UsuariosJson && UsuariosJson.Id != 0) {
        console.log("Precargando datos: ", UsuariosJson);

        $("#id").val(UsuariosJson.Id);
        $("#nombre").val(UsuariosJson.Nombre);
        $("#descripcion").val(UsuariosJson.Descripcion);
        $("#monto").val(UsuariosJson.Monto);
        $("#fecha").val(UsuariosJson.Fecha.split('T')[0]);
        $("#encargado").val(UsuariosJson.UsuarioName);
        $("#estatus").val(UsuariosJson.Estatus ? "1" : "0");
        $("#chbestatus").prop('checked', UsuariosJson.Estatus === 1);
    } else {
        $("#btnEliminaru").hide();
        $("#btnGuardaru").show();
    }
});

function GetAllUsuario() {
    GetMVC("/Administracion/GetAllUsuario", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblUsuarios", r.Response);
        } else {
            Swal.fire("Error", "Error al cargar los usuarios: " + r.ErrorMessage, "error");
        }
    });
}

function SaveOrUpdateUsuario() {
    if ($("#frmUsuario").valid()) {
        var parametro = {
            Id: $("#id").val(),
            nombre: $("#nombre").val(),
            username: $("#username").val(),
            email: $("#email").val(),
            password: $("#password").val(),
            Estatus: 1,
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val()
        };

        var isUpdating = parametro.Id && parametro.Id != 0;
        Swal.fire({
            title: isUpdating ? '¿Desea actualizar el registro?' : '¿Desea guardar el nuevo registro?',
            html: `<strong>Id:</strong> ${parametro.Id}<br/>
                   <strong>Nombre:</strong> ${parametro.nombre}<br/> 
                   <strong>UserName:</strong> ${parametro.username}<br/> 
                   <strong>Email:</strong> ${parametro.email}<br/>
                   <strong>password:</strong> ${parametro.password}<br/>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: isUpdating ? 'Actualizar' : 'Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                PostMVC("/Administracion/SaveOrUpdateUsuario", parametro, function (success, response) {
                    if (success) {
                        Swal.fire('Éxito', isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.', 'success')
                            .then(() => window.location.href = '/Administracion/Usuarios');
                    } else {
                        Swal.fire('Error', 'Error al guardar los datos: ' + response.ErrorMessage, 'error');
                    }
                });
            }
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios.', 'warning');
    }
}

function EditarUsuario(id) {
    window.location.href = "/Administracion/Usuarios/" + id;
}

function EliminarUsuario(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el usuario.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            PostMVC('/Administracion/DeleteUsuario', { id: id }, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success')
                        .then(() => window.location.href = '/Administracion/Usuarios');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}
