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
    if ($("#frmDocumentos").valid()) {
        var parametro = {
            Id: $("#id").val(),
            nombre: $("#nombre").val(),
            descripcion: $("#descripcion").val(),
            CreatedBy: $("#encargado").val(),
            CreatedDt: $("#fecha").val(),
            UpdatedBy: $("#encargado").val(),
            UpdatedDt: $("#fecha").val()
        };

        var isUpdating = parametro.Id && parametro.Id != 0;
        Swal.fire({
            title: isUpdating ? '¿Desea actualizar el registro?' : '¿Desea guardar el nuevo registro?',
            html: `<strong>Id:</strong> ${parametro.Id}<br/>
                   <strong>Nombre:</strong> ${parametro.nombre}<br/> 
                   <strong>Descripción:</strong> ${parametro.descripcion}<br/>
                   <strong>Encargado:</strong> ${parametro.UsuarioName}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: isUpdating ? 'Actualizar' : 'Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                PostMVC("/Empleado/SaveOrUpdateDocumento", parametro, function (success, response) {
                    if (success) {
                        Swal.fire('Éxito', isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.', 'success')
                            .then(() => window.location.href = '/Empleado/SaveOrUpdateDocumento');
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
