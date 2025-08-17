$(document).ready(function () {
    $("#tblCategoriaInventario").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'nombre', title: 'Nombre' },
            { data: 'descripccion', title: 'Descripcion' },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarCatalogoInventario(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarCatalogoInventario(' + data + ')"/>';
                }
            }
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
    })

    GetAllVehiculo();
});

function GetAllVehiculo() {
    GetMVC("/Taller/GetAllCategoriaInventario", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblCategoriaInventario", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las Categorias del Inventario: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function SaveOrUpdateCategoriaInventario() {
    if ($("#frmCategoriaInventario").valid()) {
        var parametro = {
            Id: $("#id").val(),
            Nombre: $("#nombre").val(),
            Descripccion: $("#descripccion").val(),
            Estatus: $("#estatus").val(),
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val(),

        };

        PostMVC('/Taller/SaveOrUpdateCategoriaInventario', parametro, function (r) {
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


function EliminarCatalogoInventario(id) {
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

            PostMVC('/Taller/DeleteCategoriaInventarioById', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'La Categoria del Inventario ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                } else {
                    Swal.fire('Eliminado', 'La Categoria del Inventario ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                }
            });
        }
    });
}

function EditarCatalogoInventario(id) {
    location.href = "/Taller/CategoriaInventario/" + id;
} 