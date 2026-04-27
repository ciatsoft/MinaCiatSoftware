$(document).ready(function () {
    // Validación del formulario
    $("#frmTipoMaterialUbicacion").validate({
        rules: {
            "txtNombreTipoMaterial": "required",
            "txtDescripcionTipoMaterial": "required"
        },
        messages: {
            txtNombreTipoMaterial: "El nombre es requerido",
            txtDescripcionTipoMaterial: "La descripción es requerida"
        }
    });

    // Inicialización de la tabla de tipo de material
    $("#tableTipodematerial").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "nombreTipoMaterial", title: "Nombre" },
            { data: "descripcionTipoMaterial", title: "Descripción Material" },
            { data: "unidadMedida.nombre", title: "Unidad Medida" },
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
                    return '<button class="btn btn-sm btn-primary" onclick="EditarTipoMaterial(' + data + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarTipoMaterial(' + data + ')">' +
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

    GetAllTipoMaterialUbicacion();

    // Cargar el registro en caso de edición
    if (tipoMaterialUbicacionJson && tipoMaterialUbicacionJson.Id != 0) {
        console.log("Datos recibidos: " + JSON.stringify(tipoMaterialUbicacionJson));
        $("#txtidtipomaterial").val(tipoMaterialUbicacionJson.Id);
        $("#txtNombreTipoMaterial").val(tipoMaterialUbicacionJson.NombreTipoMaterial);
        $("#txtDescripcionTipoMaterial").val(tipoMaterialUbicacionJson.DescripcionTipoMaterial);
        $("#ddlUnidadDeMedida").val(tipoMaterialUbicacionJson.UnidadMedida.Id);
        $("#chbEstatus").prop('checked', tipoMaterialUbicacionJson.Estatus);
        // Actualizar el label del estatus
        if (typeof updateEstatusLabel === 'function') {
            updateEstatusLabel();
        }
        $("#btnEliminaru").show();
        $("#btnGuardaru").show();
        $("#estatusContainer").show();
    } else {
        $("#btnEliminaru").hide();
        $("#btnGuardaru").show();
        $("#estatusContainer").hide();
    }
});

// Función para guardar o actualizar
function SaveOrUpdateTipoMaterialUbicacion() {
    // Validación manual de campos requeridos
    var nombre = $("#txtNombreTipoMaterial").val();
    var descripcion = $("#txtDescripcionTipoMaterial").val();

    if (!nombre || nombre.trim() === "" || !descripcion || descripcion.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor llene todos los campos (Nombre y Descripción).",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if ($("#frmTipoMaterialUbicacion").valid()) {
        var parametro = {
            Id: $("#txtidtipomaterial").val() || 0,
            NombreTipoMaterial: nombre,
            DescripcionTipoMaterial: descripcion,
            UnidadMedida: { Id: $("#ddlUnidadDeMedida").val() },
            Estatus: 1,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        console.log("Parámetros enviados:", parametro);
        swal("Éxito", "Datos guardados exitosamente.", "success");
        window.location.href = '/Catalog/TipoMaterialUbicacion';
        PostMVC("/Catalog/SaveOrUpdateTipoMaterialUbicacion", parametro, function (r) {
            window.location.href = '/Catalog/TipoMaterialUbicacion';
            if (r.IsSuccess) {
                LimpiarFormulario();
                swal({
                    title: 'Éxito',
                    text: isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.',
                    type: 'success',
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.href = '/Catalog/TipoMaterialUbicacion';
                });
            } else {
                swal({
                    title: 'Error',
                    text: 'Error al ' + (isUpdating ? 'actualizar' : 'guardar') + ' los datos: ' + r.ErrorMessage,
                    type: 'error',
                    confirmButtonText: 'OK'
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

// Función para eliminar con confirmación
function EliminarTipoMaterial(id) {
    // Obtener datos actuales para mostrar en confirmación
    var nombre = $("#txtNombreTipoMaterial").val();
    var descripcion = $("#txtDescripcionTipoMaterial").val();

    if (!id || id === "0") {
        // Si no hay ID válido, obtener de algún otro lugar o usar valores por defecto
        id = $("#txtidtipomaterial").val();
    }

    swal({
        title: '¿Está seguro?',
        text: "¿Desea eliminar este tipo de material?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = {
                Id: id,
                Estatus: false
            };

            PostMVC('/Catalog/DeleteTipoMaterialUbicacion', { id: id }, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: 'Eliminado',
                        text: 'El tipo de material ha sido eliminado correctamente.',
                        type: 'success',
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/TipoMaterialUbicacion';
                    });
                } else {
                    swal({
                        title: 'Error',
                        text: 'Error al eliminar el tipo de material: ' + r.ErrorMessage,
                        type: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });
}

// Función para editar
function EditarTipoMaterial(id) {
    location.href = "/Catalog/TipoMaterialUbicacion/" + id;
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtidtipomaterial").val('');
    $("#txtNombreTipoMaterial").val('');
    $("#txtDescripcionTipoMaterial").val('');
    $("#chbEstatus").prop('checked', false);
    if (typeof updateEstatusLabel === 'function') {
        updateEstatusLabel();
    }
}

// Función para obtener todos los tipos de material
function GetAllTipoMaterialUbicacion() {
    GetMVC("/Catalog/GetAllTipoMaterialUbicacion", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableTipodematerial", r.Response);
        } else {
            swal({
                title: 'Error',
                text: 'Error al cargar los materiales: ' + r.ErrorMessage,
                type: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}

// Función global para actualizar el label del estatus
window.updateEstatusLabel = function () {
    var chkEstatus = document.getElementById('chbEstatus');
    var lblEstatus = document.getElementById('lblEstatus');

    if (chkEstatus && lblEstatus) {
        lblEstatus.textContent = chkEstatus.checked ? 'Activo' : 'Inactivo';
        lblEstatus.style.color = chkEstatus.checked ? '#5cb85c' : '#d9534f';
    }
};