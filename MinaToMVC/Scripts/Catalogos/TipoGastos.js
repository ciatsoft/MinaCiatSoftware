$(document).ready(function () {
    // Validación de formulario
    $("#frmTipoGastos").validate({
        rules: {
            "nombre": "required",
            "descripcion": "required"
        },
        messages: {
            "nombre": "El nombre es obligatorio.",
            "descripcion": "La descripción es obligatoria."
        }
    });

    // En el ready
    $("#chbestatus").change(function () {
        $("#estatus").val(this.checked ? "1" : "0");
    });

    // Al cargar la edición
    if ($("#id").val() != "0") {
        $("#chbestatus").prop('checked', $("#estatus").val() == "1");
    }

    // Inicialización de la tabla
    $("#tblTipoGastos").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripcion de Gasto" },
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
                    return '<button class="btn btn-sm btn-primary" onclick="EditarTipoGastos(' + data + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarTipoGastos(' + data + ')">' +
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
            "emptyTable": "Ningun dato disponible en esta tabla",
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

    // Obtener todos los datos al cargar
    GetAllTipoGastos();

    if (typeof TipoGastosJson !== "undefined" && TipoGastosJson && TipoGastosJson.Id != 0) {

        $("#id").val(TipoGastosJson.Id);
        $("#nombre").val(TipoGastosJson.Nombre);
        $("#descripcion").val(TipoGastosJson.Descripcion);
        $("#estatus").val(TipoGastosJson.Estatus ? "1" : "0");
        $("#chbestatus").prop('checked', TipoGastosJson.Estatus === 1);
    } else {
        // Si el ID es 0 (nuevo registro)
        $("#btnEliminaru").hide();
        $("#btnGuardaru").show();
        $("#estatusContainer").hide(); // No mostrar si no se está editando
    }
});

// Guardar o actualizar
function SaveOrUpdateTipoGastos() {
    // Validación manual de campos requeridos
    var nombre = $("#nombre").val();
    var descripcion = $("#descripcion").val();

    if (!nombre || nombre.trim() === "" || !descripcion || descripcion.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor llene todos los campos (Nombre y Descripcion).",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if ($("#frmTipoGastos").valid()) {
        var parametro = {
            Id: $("#id").val(),
            Nombre: nombre,
            Descripcion: descripcion,
            Estatus: 1,
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#CreatedDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#UpdatedDt").val()
        };

        var isUpdating = parametro.Id && parametro.Id != 0;
        var titleText = isUpdating ? '¿Desea actualizar el registro?' : '¿Desea guardar el nuevo registro?';
        var confirmButtonText = isUpdating ? 'Actualizar' : 'Guardar';

        swal({
            title: titleText,
            text: `Nombre: ${parametro.Nombre}\nDescripcion: ${parametro.Descripcion}`,
            type: 'info',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar'
        }, function (isConfirmed) {
            if (isConfirmed) {
                PostMVC("/Catalog/SaveOrUpdateTipoGastos", parametro, function (r) {
                    swal("Éxito", "Rol asignado exitosamente.", "success");
                    window.location.href = '/Catalog/TipoGastos';
                    if (r.IsSuccess) {
                        LimpiarFormulario();
                        swal({
                            title: 'Éxito',
                            text: isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.',
                            type: 'success',
                            confirmButtonText: 'OK'
                        }, function () {
                            window.location.href = '/Catalog/TipoGastos';
                        });
                    } else {
                        LimpiarFormulario();
                        swal({
                            title: 'Éxito',
                            text: isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.',
                            type: 'success',
                            confirmButtonText: 'OK'
                        }, function () {
                            window.location.href = '/Catalog/TipoGastos';
                        });
                    }
                });
            }
        });
    } else {
        swal({
            title: 'Advertencia',
            text: 'Por favor, complete todos los campos obligatorios.',
            type: 'warning',
            confirmButtonText: 'OK'
        });
    }
}

// Redireccionar a editar
function EditarTipoGastos(id) {
    window.location.href = "/Catalog/TipoGastos/" + id;
}

// Eliminar con confirmación
function EliminarTipoGastos(id) {
    swal({
        title: '¿Estás seguro?',
        text: "Esta accion eliminara el tipo de gasto.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            PostMVC('/Catalog/DeleteTipoGastos', { id: id }, function (r) {
                swal("Éxito", "El tipo de gasto ha sido eliminado.", "success");
                window.location.href = '/Catalog/TipoGastos';
                if (r.IsSuccess) {
                    swal({
                        title: '¡Eliminado!',
                        text: 'El tipo de gasto ha sido eliminado.',
                        type: 'success',
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/TipoGastos';
                    });
                } else {
                    swal({
                        title: '¡Eliminado!',
                        text: 'El tipo de gasto ha sido eliminado.',
                        type: 'success',
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/TipoGastos';
                    });
                }
            });
        }
    });
}

// Obtener todos los registros
function GetAllTipoGastos() {
    GetMVC("/Catalog/GetAllTipoGastos", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblTipoGastos", r.Response);
        } else {
            swal({
                title: 'Error',
                text: 'Error al cargar los datos: ' + r.ErrorMessage,
                type: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}

// Limpiar formulario
function LimpiarFormulario() {
    $("#id").val('');
    $("#nombre").val('');
    $("#descripcion").val('');
    $("#chbestatus").prop('checked', false);
}