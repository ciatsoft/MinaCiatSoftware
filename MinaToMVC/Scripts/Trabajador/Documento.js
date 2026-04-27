$(document).ready(function () {

    // Configuración de DataTable
    $("#tblDocumentos").DataTable({
        data: [],
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: 'id', visible: false, title: 'ID' },
            { data: 'nombre', title: 'Nombre' },
            { data: 'descripcion', title: 'Descripcion' },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return '<button class="btn btn-sm btn-primary" onclick="EditarDocumento(' + data + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarDocumento(' + data + ')">' +
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

    // Configuración de validación del formulario
    $("#frmDocumento").validate({
        rules: {
            nombre: "required",
            descripcion: "required"
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            descripcion: "Por favor ingrese la descripción"
        }
    });

    GetAllDocumentos();
});

function GetAllDocumentos() {
    GetMVC("/Empleado/GetAllDocumentos", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblDocumentos", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar Documentos: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: 'OK'
            });
        }
    });
}

function SaveOrUpdateDocumento() {
    if ($("#frmDocumento").valid()) {
        var parametro = {
            Id: $("#id").val() || 0,
            nombre: $("#nombre").val(),
            descripcion: $("#descripcion").val(),
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#fecha").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#fecha").val()
        };

        PostMVC("/Empleado/SaveOrUpdateDocumento", parametro, function (r) {
            if (r.IsSuccess) {
                swal({
                    title: "¡Éxito!",
                    text: isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.',
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.href = '/Empleado/ListaDocumentos';
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

function LimpiarFormulario() {
    $("#frmDocumento")[0].reset();
}

function EditarDocumento(id) {
    console.log("Editar ID recibido:", id);
    location.href = "/Empleado/ListaDocumentos/" + id;
}

function EliminarDocumento(id) {
    swal({
        title: '¿Estás seguro?',
        text: "Se eliminara el siguiente registro.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            swal({
                title: "Eliminado",
                text: "El documento ha sido eliminado correctamente.",
                type: "success",
                confirmButtonText: 'OK'
            }, function () {
                window.location.reload();
            });
            window.location.reload();

            PostMVC('/Empleado/DeleteDocumentoById', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El documento ha sido eliminado correctamente.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.reload();
                    });
                } else {
                    swal({
                        title: "Error",
                        text: "Error al eliminar el documento: " + r.ErrorMessage,
                        type: "error",
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });
}