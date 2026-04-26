$(document).ready(function () {
    $("#frmroll").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        },
        messages: {
            txtNombre: "El nombre es requerido",
            txtDescripcion: "La descripción es requerida"
        }
    });

    $("#tblRoll").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripción" },
            {
                data: "estatus",
                visible: false,
                title: "Estatus",
                render: function (data) {
                    return data == 1 ? '<span class="label label-success">Activo</span>' : '<span class="label label-danger">Inactivo</span>';
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return '<button class="btn btn-sm btn-primary" onclick="EditarRoll(' + data + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarRoll(' + data + ')">' +
                        '<i class="fa fa-trash"></i> Eliminar</button>';
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": '<i class="fa fa-search"></i> Buscar:',
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i>',
                "last": '<i class="fa fa-fast-forward"></i>',
                "next": '<i class="fa fa-forward"></i>',
                "previous": '<i class="fa fa-backward"></i>'
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    GetAllRoll();

    if (rollJson.Id !== 0) {
        $("#txtidroll").val(rollJson.Id);
        $("#txtNombre").val(rollJson.Nombre);
        $("#txtDescripcion").val(rollJson.Descripcion);
        $("#chbEstatus").prop('checked', rollJson.Estatus);
        // Actualizar el texto del label de estatus
        if (typeof updateEstatusLabel === 'function') {
            updateEstatusLabel();
        }
        $("#btnAsociar").show(); // Mostrar botón
    } else {
        $("#btnAsociar").hide(); // Ocultar botón
    }
});

function AbrirModalPermisosRol() {
    var idRoll = $("#txtidroll").val();
    var nombreRol = $("#txtNombre").val();
    var createdBy = $('#txtCreatedBy').val();
    var updatedBy = $('#txtCreatedBy').val();
    var createdDt = $('#txtCreatedDt').val();
    var updatedDt = $('#txtCreatedDt').val();

    if (!idRoll || idRoll === "0") {
        swal({
            title: "¡ID inválido!",
            text: "No se ha seleccionado ningún rol. Por favor guarde el rol primero.",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();
    $("#titleGenerciModal").html(`<span style="color: black;">Agregar Permisos a Rol: ${nombreRol}</span>`);

    const url = `/Catalog/PartialPermisosRol?id=${encodeURIComponent(idRoll)}&nombre=${encodeURIComponent(nombreRol)}&createdBy=${encodeURIComponent(createdBy)}&updatedBy=${encodeURIComponent(updatedBy)}&createdDt=${encodeURIComponent(createdDt)}&updatedDt=${encodeURIComponent(updatedDt)}`;

    $("#boddyGeericModal").load(url, function () {
        $("#genericModal").modal("show");
    });
}

function SaveOrUpdateRoll() {
    var nombre = $("#txtNombre").val();
    var descripcion = $("#txtDescripcion").val();

    if (!nombre || nombre.trim() === "" || !descripcion || descripcion.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor llene todos los campos (Nombre y Descripción).",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    // Solo si pasó la validación anterior, verificamos la validación del formulario
    if ($("#frmroll").valid()) {
        var parametro = {
            Id: $("#txtidroll").val() || 0,
            Nombre: nombre,
            Descripcion: descripcion,
            Estatus: 1,
            CreatedDt: $("#txtCreatedDt").val()
        };

        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Catalog/SaveOrUpdateRoll', parametro, function (r) {
            if (r.IsSuccess) {
                swal({
                    title: "¡Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.href = '/Catalog/Roll';
                });
            } else {
                swal({
                    title: "Error",
                    text: "Error al guardar los datos: " + r.ErrorMessage,
                    type: "error",
                    confirmButtonText: 'OK'
                });
            }
        });
    }
}

// Función para eliminar el rol con confirmación y actualización de estatus
function EliminarRoll(id) {
    swal({
        title: '¿Está seguro?',
        text: "¿Desea eliminar el rol?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/Catalog/DeleteRoll', parametro, function (r) {
                window.location.href = '/Catalog/Roll';
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El rol ha sido eliminado correctamente.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/Roll';
                    });
                } else {
                    swal({
                        title: "Error",
                        text: "Error al eliminar el rol: " + r.ErrorMessage,
                        type: "error",
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}

function EditarRoll(id) {
    location.href = "/Catalog/Roll/" + id;
}

// Función que obtiene todos los roles
function GetAllRoll() {
    GetMVC("/Catalog/GetAllRoll", function (r) {
        if (r.IsSuccess) {
            console.log("Datos recibidos del servidor:", r.Response);
            MapingPropertiesDataTable("tblRoll", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar los roles: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtidroll").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#chbEstatus").prop('checked', false);
    if (typeof updateEstatusLabel === 'function') {
        updateEstatusLabel();
    }
}

// Función global para actualizar el label del estatus (si existe en el HTML)
window.updateEstatusLabel = function () {
    var chkEstatus = document.getElementById('chbEstatus');
    var lblEstatus = document.getElementById('lblEstatus');

    if (chkEstatus && lblEstatus) {
        lblEstatus.textContent = chkEstatus.checked ? 'Activo' : 'Inactivo';
        lblEstatus.style.color = chkEstatus.checked ? '#5cb85c' : '#d9534f';
    }
};