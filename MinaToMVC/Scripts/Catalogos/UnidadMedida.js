$(document).ready(function () {
    $("#frmunidadmedida").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        },
        messages: {
            txtNombre: "El nombre es requerido",
            txtDescripcion: "La descripción es requerida"
        }
    });

    // Inicialización de la tabla de unidades de medida
    $("#tableUnidadMedida").dataTable({
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
                    return '<button class="btn btn-sm btn-primary" onclick="EditarUnidad(' + data + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarUnidad(' + data + ')">' +
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

    GetAllUnidadMedida();

    if (typeof unidadJson.Id != 0 && unidadJson.Id != null) {
        $("#txtunidadmedida").val(unidadJson.Id);
        $("#txtNombre").val(unidadJson.Nombre);
        $("#txtDescripcion").val(unidadJson.Descripcion);
        $("#chbEstatus").prop('checked', unidadJson.Estatus);
        // Actualizar el label del estatus
        if (typeof updateEstatusLabel === 'function') {
            updateEstatusLabel();
        }
    }
});

// Función que se ejecuta al hacer clic en el botón de Guardar
function SaveOrUpdateUnidadMedida() {
    // Validación manual de campos requeridos
    var nombre = $("#txtNombre").val();
    var descripcion = $("#txtDescripcion").val();

    if (!nombre || nombre.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor ingrese el nombre de la unidad de medida.",
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

    if ($("#frmunidadmedida").valid()) {
        var parametro = {
            Id: $("#txtunidadmedida").val() || 0,
            Nombre: nombre,
            Descripcion: descripcion,
            Estatus: 1,
            CreatedDt: $("#txtCreatedDt").val()
        };

        console.log("Enviando parámetro:", parametro);
        swal({
            title: "¡Registro guardado!",
            text: "El registro se ha guardado correctamente.",
            type: "success",
            confirmButtonText: 'OK'
        }, function () {
            window.location.href = '/Catalog/UnidadMedida';
        });
        PostMVC('/Catalog/SaveOrUpdateUnidadMedida', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                swal({
                    title: "¡Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.href = '/Catalog/UnidadMedida';
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

// Función para eliminar la unidad de medida
function EliminarUnidad(id) {
    swal({
        title: '¿Está seguro?',
        text: "¿Desea eliminar la unidad de medida?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            swal({
                title: "Eliminado",
                text: "La unidad de medida ha sido eliminada correctamente.",
                type: "success",
                confirmButtonText: 'OK'
            }, function () {
                window.location.href = '/Catalog/UnidadMedida';
            });
            window.location.href = '/Catalog/UnidadMedida';
            PostMVC('/Catalog/DeleteUnidadMedida', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "La unidad de medida ha sido eliminada correctamente.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/UnidadMedida';
                    });
                } else {
                    swal({
                        title: "Error",
                        text: "Error al eliminar la unidad de medida: " + r.ErrorMessage,
                        type: "error",
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}

function EditarUnidad(id) {
    console.log("Editar ID recibido:", id);
    location.href = "/Catalog/UnidadMedida/" + id;
}

// Función que obtiene todas las unidades de medida
function GetAllUnidadMedida() {
    GetMVC("/Catalog/GetAllUnidadMedida", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableUnidadMedida", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las unidades de medida: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: 'OK'
            });
        }
    });
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtunidadmedida").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#chbEstatus").prop('checked', false);
    if (typeof updateEstatusLabel === 'function') {
        updateEstatusLabel();
    }
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