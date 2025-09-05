$(document).ready(function () {

    // Configuración de DataTable
    $("#tblDocumentos").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'nombre', title: 'Nombre' },
            { data: 'descripcion', title: 'descripcion' },

            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarDocumento(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarDocumento(' + data + ')"/>';
                }
            },
            
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningun dato disponible en esta tabla",
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


    // Configuración de validación del formulario
    $("#frmListado").validate({
        rules: {
            nombre: "required",
            descripcion: "required",  // Asegúrate de que coincida con el nombre de la propiedad
            
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            descripcion: "Por favor ingrese la descripción",
            
        }
    });

    GetAllDocumentos();
});

function GetAllDocumentos() {
    GetMVC("/Empleado/GetAllDocumentos", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblDocumentos", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar Documentos: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}


function SaveOrUpdateDocumento() {
    if ($("#frmDocumento").valid()) {
        var fechaActual = new Date().toISOString().split("T")[0];

        var parametro = {
            Id: $("#id").val(),
            Nombre: $("#nombre").val(),
            Descripcion: $("#descripcion").val(),
        };

        PostMVC('/Documento/SaveOrUpdateDocumento', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarDocumento();
                Swal.fire({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar : ' + r.ErrorMessage,
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
}

function LimpiarFormulario() {
    $("#frmDocumento")[0].reset();
}

function EditarDocumento(id) {
    location.href = "/Empleado/ListaDocumentos/" + id;
}

function EliminarDocumento(id) {
    Swal.fire({
        title: '¿Estas seguro?',
        text: "¿Desea eliminar el siguiente registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/Empleado/DeleteDocumentoById', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El Documento de este registro ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                } else {
                    Swal.fire('Eliminado', 'El Documento de este registro ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                }
            });
        }
    });
}
