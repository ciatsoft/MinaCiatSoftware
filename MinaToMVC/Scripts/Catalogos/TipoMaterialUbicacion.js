$(document).ready(function () {
    // Validación del formulario usando el mismo 
    $("#frmTipoMaterialUbicacion").validate({
        rules: {
            "txtNombreTipoMaterial": "required",
            "txtDescripcionTipoMaterial": "required"
        }
    });

    // Inicialización de la tabla de tipo de material con formato 
    $("#tableTipodematerial").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombreTipoMaterial", title: "Nombre" },
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
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarTipoMaterial(' + data + ', this)" />';
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

    // Cargar el registro en caso de edición 
    if (tipoMaterialUbicacionJson && tipoMaterialUbicacionJson.Id != 0) {

        console.log("Datos recibidos: " + JSON.stringify(tipoMaterialUbicacionJson));
        $("#txtidtipomaterial").val(tipoMaterialUbicacionJson.Id);
        $("#txtNombreTipoMaterial").val(tipoMaterialUbicacionJson.NombreTipoMaterial);
        $("#txtDescripcionTipoMaterial").val(tipoMaterialUbicacionJson.DescripcionTipoMaterial);
        $("#ddlUbicacion").val(tipoMaterialUbicacionJson.DtoUbicacion.Id);
        $("#ddlUnidadDeMedida").val(tipoMaterialUbicacionJson.UnidadMedida.Id);
        $("#chbEstatus").prop('checked', tipoMaterialUbicacionJson.Estatus);

        $("#btnEliminaru").show();
        $("#btnGuardaru").show();
    } else {
        // Si el ID es 0 (nuevo registro)
        $("#btnEliminaru").hide();
        $("#btnGuardaru").show();
    }
});


// Función para guardar o actualizar
function SaveOrUpdateTipoMaterialUbicacion() {
    if ($("#frmTipoMaterialUbicacion").valid()) {
        // Se construye el objeto de parámetros para el tipo de material
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
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        // Determinar si es una actualización o un nuevo registro
        var isUpdating = parametro.Id && parametro.Id != 0;
        var titleText = isUpdating ? '¿Desea actualizar el registro?' : '¿Desea guardar el nuevo registro?';
        var confirmButtonText = isUpdating ? 'Actualizar' : 'Guardar';

        // Mostrar los datos capturados en una alerta usando SweetAlert
        Swal.fire({
            title: 'Datos del tipo de material',
            html: `<strong>Nombre:</strong> ${$("#txtNombreTipoMaterial").val()}<br/>
                   <strong>Descripción:</strong> ${$("#txtDescripcionTipoMaterial").val()}<br/>
                   <strong>Ubicación:</strong> ${$("#ddlUbicacion option:selected").text()}<br/>
                   <strong>Unidad de Medida:</strong> ${$("#ddlUnidadDeMedida option:selected").text()}<br/>
                   <strong>Estatus:</strong> ${$("#chbEstatus").is(':checked') ? 'Activo' : 'Inactivo'}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/Catalog/TipoMaterialUbicacion';
                // Enviar los datos al servidor
                PostMVC("/Catalog/SaveOrUpdateTipoMaterialUbicacion", parametro, function (success, response) {

                    if (success) {
                        LimpiarFormulario();
                        Swal.fire('Éxito', isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.', 'success')
                            .then(function () {
                                window.location.href = '/Catalog/TipoMaterialUbicacion';
                            });
                    } else {
                        Swal.fire('Error', 'Error al ' + (isUpdating ? 'actualizar' : 'guardar') + ' los datos: ' + response.ErrorMessage, 'error');
                    }
                });
            }
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios.', 'warning');
    }
}


// Función para eliminar con confirmación y estructura de mensajes de SweetAlert
function EliminarTipoMaterial() {
    var valid = true;

    // Validación de campos requeridos
    $(".required").each(function () {
        if ($(this).val() === "") {
            valid = false;
            $(this).addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid");
        }
    });

    if (valid) {
        // Se construye el objeto de parámetros con los datos del tipo de material
        var parametro = {
            Id: $("#txtidtipomaterial").val(),
            NombreTipoMaterial: $("#txtNombreTipoMaterial").val(),
            DescripcionTipoMaterial: $("#txtDescripcionTipoMaterial").val(),
            DtoUbicacion: { Id: $("#ddlUbicacion").val() },
            UnidadMedida: { Id: $("#ddlUnidadDeMedida").val() },
            Estatus: false,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdateBy").val(),
            UpdatedDt: $("#txtUpdateDt").val()
        };

        // Mostrar los datos capturados en una alerta usando SweetAlert
        Swal.fire({
            title: 'Confirmar eliminación',
            html: `<strong>¿Está seguro de que desea eliminar este tipo de material?</strong><br/>
                   <strong>Nombre:</strong> ${$("#txtNombreTipoMaterial").val()}<br/>
                   <strong>Descripción:</strong> ${$("#txtDescripcionTipoMaterial").val()}<br/>
                   <strong>Ubicación:</strong> ${$("#ddlUbicacion option:selected").text()}<br/>
                   <strong>Unidad de Medida:</strong> ${$("#ddlUnidadDeMedida option:selected").text()}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/Catalog/TipoMaterialUbicacion';
                // Enviar los datos al servidor para eliminar
                PostMVC("/Catalog/SaveOrUpdateTipoMaterialUbicacion", parametro, function (success, response) {
                    if (success) {
                        LimpiarFormulario();
                        Swal.fire('Éxito', 'El tipo de material ha sido eliminado exitosamente', 'success').then(function () {
                            window.location.href = '/Catalog/TipoMaterialUbicacion';
                        });
                    } else {
                        Swal.fire('Error', 'Error al eliminar el tipo de material: ' + response.ErrorMessage, 'error');
                    }
                });
            }
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios antes de continuar.', 'warning');
    }
}



// Función para editar con estilo de redireccionamiento 
function EditarTipoMaterial(id) {
    location.href = "/Catalog/TipoMaterialUbicacion/" + id;
}

// Función para limpiar el formulario con estilo uniforme
function LimpiarFormulario() {
    $("#txtidtipomaterial").val('');
    $("#txtNombreTipoMaterial").val('');
    $("#txtDescripcionTipoMaterial").val('');
    $("#chbEstatus").prop('checked', false);
}

// Función para obtener todos los tipos de material
function GetAllTipoMaterialUbicacion() {
    GetMVC("/Catalog/GetAllTipoMaterialUbicacion", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableTipodematerial", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los materiales: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}
