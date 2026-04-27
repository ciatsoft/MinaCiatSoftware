$(document).ready(function () {
    // Validación del formulario
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Solo se permiten caracteres alfabéticos");

    $("#frmubicacion").validate({
        rules: {
            "txtNombreUbicacion": {
                lettersonly: true,
                required: true
            },
            "txtDescripcionUbicacion": {
                lettersonly: true,
                required: true
            }
        },
        messages: {
            "txtDescripcionUbicacion": {
                required: "La descripción es requerida.",
                lettersonly: "Este campo no acepta valores numéricos."
            },
            "txtNombreUbicacion": {
                required: "El nombre es requerido.",
                lettersonly: "Este campo no acepta valores numéricos."
            }
        }
    });

    // Configuración de la tabla
    $("#tableUbicacion").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "nombreUbicacion", title: "Nombre" },
            { data: "descripcionUbicacion", title: "Descripción" },
            {
                data: "esInterna",
                title: "Tipo de Mina",
                render: function (data) {
                    return data == 1 ? '<span class="label label-success">Interna</span>' : '<span class="label label-info">Externa</span>';
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data, type, row) {
                    var nombreEscapado = row.nombreUbicacion.replace(/'/g, "\\'").replace(/"/g, '\\"');
                    return '<button class="btn btn-sm btn-primary" onclick="EditarUbicacion(' + data + ', \'' + nombreEscapado + '\')">' +
                        '<i class="fa fa-edit"></i> Editar</button>';
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

    GetAllUbicacion();

    // Al cargar la página, si ya hay un ID (estamos editando)
    if (UbicacionJson.Id != 0) {
        $("#txtIdUbicacion").val(UbicacionJson.Id);
        $("#txtNombreUbicacion").val(UbicacionJson.NombreUbicacion);
        $("#txtDescripcionUbicacion").val(UbicacionJson.DescripcionUbicacion);
        $("#Estatus").val(UbicacionJson.Estatus);
        $("#EsInterna").prop('checked', UbicacionJson.EsInterna);

        // Actualizar el label del checkbox
        if (typeof updateEsInternaLabel === 'function') {
            updateEsInternaLabel();
        }

        // Habilitar el botón de eliminar
        $("#btnEliminarUbicacion").prop('disabled', false);
        $("#btnEliminarUbicacion").data('id', UbicacionJson.Id);

        // Habilitar el botón de Asignacion de Material
        $("#btnAsociar").prop('disabled', false);
        $("#btnAsociar").data('id', UbicacionJson.Id);
    }

    // Verificar si hay una bandera para abrir el modal
    const modalData = sessionStorage.getItem("abrirModalUbicacion");
    if (modalData) {
        const datos = JSON.parse(modalData);
        AbrirModalMateriales(datos.id, datos.nombre);
        sessionStorage.removeItem("abrirModalUbicacion");
    }
});

// Función para editar ubicación
function EditarUbicacion(id, nombreUbicacion) {
    // Guardar el ID y el nombre en el botón de asociar materiales
    $("#btnAsociar").data('id', id);
    $("#btnAsociar").data('nombre', nombreUbicacion);
    $("#btnAsociar").prop('disabled', false);

    // Guardar el ID en el botón de eliminar
    $("#btnEliminarUbicacion").data('id', id);
    $("#btnEliminarUbicacion").prop('disabled', false);

    // Redirigir a la página de edición
    location.href = "/Catalog/Ubicacion/" + id;
}

// Función para eliminar ubicación
function EliminarUbicacion() {
    var id = $("#btnEliminarUbicacion").data('id');

    if (!id || id == 0) {
        swal({
            title: "Error",
            text: "No se ha seleccionado una ubicación para eliminar",
            type: "error",
            confirmButtonText: 'OK'
        });
        return;
    }

    swal({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            swal({
                title: "Eliminado",
                text: "La ubicación ha sido eliminada correctamente.",
                type: "success",
                confirmButtonText: 'OK'
            }, function () {
                window.location.href = '/Catalog/Ubicacion';
            });
            window.location.href = '/Catalog/Ubicacion';
            PostMVC('/Catalog/DeleteUbicacion', { id: id }, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "La ubicación ha sido eliminada correctamente.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/Ubicacion';
                    });
                } else {
                    swal({
                        title: "Error",
                        text: "Error al eliminar la ubicación: " + r.ErrorMessage,
                        type: "error",
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });
}

// Función para guardar o actualizar ubicación
function SaveOrUpdateUbicacion() {
    // Validación manual de campos requeridos
    var nombre = $("#txtNombreUbicacion").val();
    var descripcion = $("#txtDescripcionUbicacion").val();

    if (!nombre || nombre.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor ingrese el nombre de la ubicación.",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!descripcion || descripcion.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor ingrese una descripción.",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if ($("#frmubicacion").valid()) {
        var parametro = {
            Id: $("#txtIdUbicacion").val() || 0,
            NombreUbicacion: nombre,
            DescripcionUbicacion: descripcion,
            Estatus: $("#Estatus").val(),
            CreatedBy: $("#CreatedBy").val(),
            CreatedDt: $("#CreatedDt").val(),
            UpdatedBy: $("#UpdatedBy").val(),
            UpdatedDt: $("#UpdatedDt").val(),
            EsInterna: $("#EsInterna").is(':checked')
        };

        console.log("Enviando parámetro:", parametro);

        PostMVC('/Catalog/SaveOrUpdateUbicacion', parametro, function (r) {
            LimpiarFormulario();
            swal({
                title: "¡Registro guardado!",
                text: "El registro se ha guardado correctamente.",
                type: "success",
                confirmButtonText: 'OK'
            }, function () {
                window.location.href = '/Catalog/Ubicacion';
            });
            if (r.IsSuccess) {
                LimpiarFormulario();
                swal({
                    title: "¡Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.href = '/Catalog/Ubicacion';
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

    } else {
        swal({
            title: "Advertencia",
            text: "Por favor, complete todos los campos obligatorios.",
            type: "warning",
            confirmButtonText: 'OK'
        });
    }
}

// Función que obtiene todas las ubicaciones
function GetAllUbicacion() {
    GetMVC("/Catalog/GetAllUbicacion", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableUbicacion", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las ubicaciones: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: 'OK'
            });
        }
    });
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtIdUbicacion").val('');
    $("#txtNombreUbicacion").val('');
    $("#txtDescripcionUbicacion").val('');
    $("#Estatus").prop('checked', false);
    $("#EsInterna").prop('checked', false);
    if (typeof updateEsInternaLabel === 'function') {
        updateEsInternaLabel();
    }
}

// Función para abrir modal de materiales
function AbrirModalMateriales(idUbicacion, NombreUbicacion) {
    var createdBy = $('#CreatedBy').val();
    var updatedBy = $('#UpdatedBy').val();
    var createdDt = $('#CreatedDt').val();
    var updatedDt = $('#UpdatedDt').val();

    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").html(`<span style="color: black;">Configuración de Planta con Materiales: ${NombreUbicacion}</span>`);

    $("#boddyGeericModal").load("/Catalog/PartialConfigurationUbicacionMaterial" +
        "?idUbicacion=" + idUbicacion +
        "&nombreUbicacion=" + encodeURIComponent(NombreUbicacion) +
        "&createdBy=" + encodeURIComponent(createdBy) +
        "&updatedBy=" + encodeURIComponent(updatedBy) +
        "&createdDt=" + encodeURIComponent(createdDt) +
        "&updatedDt=" + encodeURIComponent(updatedDt),
        function () {
            $("#genericModal").modal("show");
        }
    );
}

// Función global para actualizar el label del checkbox EsInterna
window.updateEsInternaLabel = function () {
    var chkEsInterna = document.getElementById('EsInterna');
    var lblEsInterna = document.getElementById('lblEsInterna');

    if (chkEsInterna && lblEsInterna) {
        lblEsInterna.textContent = chkEsInterna.checked ? 'Sí' : 'No';
        lblEsInterna.style.color = chkEsInterna.checked ? '#5cb85c' : '#d9534f';
    }
};