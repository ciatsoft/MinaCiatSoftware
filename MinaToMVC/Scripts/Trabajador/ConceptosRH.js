$(document).ready(function () {
    // Configuración de DataTable
    $("#tblConceptosRH").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'nombre', title: 'Nombre' },
            { data: 'descripcion', title: 'Descripcion' },
            { data: 'valor', title: 'Valor' },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarConceptosRH(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarConceptosRH(' + data + ')"/>';
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

    $("#frmConceptosEmpleado").validate({
        rules: {
            nombre: "required",
            descripcion: "required",
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            descripcion: "Por favor ingrese una descripcion"
        }
    });

    GetAllConceptosEmpleados();
});

function GetAllConceptosEmpleados() {
    GetMVC("/RH/GetAllConceptosEmpleados", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblConceptosRH", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los Conceptos para el Empleado: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function SaveOrUpdateConceptosEmpleados() {
    if ($("#frmConceptosEmpleado").valid()) {

        var parametro = {
            id: $("#id").val(),
            nombre: $("#nombre").val(),
            descripcion: $("#descripcion").val(),
            valor: $("#valor").val(),
            Estatus: $("#estatus").val(),
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val(),
        };

        PostMVC('/RH/SaveOrUpdateConceptosEmpleados', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
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
                    text: 'Error al guardar los datos: ' + r.ErrorMessage,
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
}

function LimpiarFormulario() {
    $("#frmConceptosEmpleado")[0].reset();
}

function EditarConceptosRH(id) {
    location.href = "/RH/ConceptosRH/" + id;
}

function EliminarConceptosRH(id) {
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

            PostMVC('/RH/DeleteConceptosEmpleadosById', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El Concepto ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                } else {
                    Swal.fire('Eliminado', 'El Concepto ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                }
            });
        }
    });
}