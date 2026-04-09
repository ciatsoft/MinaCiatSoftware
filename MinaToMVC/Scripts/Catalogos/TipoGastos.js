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
        columns: [
            { data: "id", visible: true, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripcion de Gasto" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return ` 
                        <input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarTipoGastos(${data})" />
                        <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarTipoGastos(${data})" />
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
            emptyTable: "Ningun datos disponible en esta tabla",
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

    // Obtener todos los datos al cargar
    GetAllTipoGastos();
    if (typeof TipoGastosJson !== "undefined" && TipoGastosJson && TipoGastosJson.Id != 0) {
        console.log("Precargando datos: ", TipoGastosJson);

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
    if ($("#frmTipoGastos").valid()) {
        var parametro = {
            Id: $("#id").val(),
            Nombre: $("#nombre").val(),
            Descripcion: $("#descripcion").val(),
            Estatus: $("#chbestatus").is(':checked'),
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };


        var isUpdating = parametro.Id && parametro.Id != 0;
        var titleText = isUpdating ? '¿Desea actualizar el registro?' : '¿Desea guardar el nuevo registro?';
        var confirmButtonText = isUpdating ? 'Actualizar' : 'Guardar';

        Swal.fire({
            title: titleText,
            html: `<strong>Nombre:</strong> ${parametro.Nombre}<br/>
                   <strong>Descripción:</strong> ${parametro.Descripcion}<br/>
                   <strong>Estatus:</strong> ${parametro.Estatus ? "Activo" : "Inactivo"}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                PostMVC("/Catalog/SaveOrUpdateTipoGastos", parametro, function (success, response) {
                    if (success) {
                        LimpiarFormulario();
                        Swal.fire('Éxito', isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.', 'success')
                            .then(() => window.location.href = '/Catalog/TipoGastos');
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

// Redireccionar a editar
function EditarTipoGastos(id) {
    window.location.href = "/Catalog/TipoGastos/" + id;
}

// Eliminar con confirmación
function EliminarTipoGastos(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el tipo de gasto.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            PostMVC('/Catalog/DeleteTipoGastos', { id: id }, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('¡Eliminado!', 'El tipo de gasto ha sido eliminado.', 'success')
                        .then(() => window.location.href = '/Catalog/TipoGastos');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar: ' + r.ErrorMessage, 'error');
                    console.error(r);
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
            Swal.fire('Error', 'Error al cargar los datos: ' + r.ErrorMessage, 'error');
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

