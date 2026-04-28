$(document).ready(function () {
    // Función para formatear como moneda MXN (por si se necesita)
    function formatCurrency(value) {
        if (value === '' || value === null || value === undefined) return '';
        let num = parseFloat(value);
        if (isNaN(num)) return value;
        return num.toLocaleString('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    $("#tblCategoriaInventario").DataTable({
        data: [],
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        columns: [
            { data: 'id', title: 'ID', visible: false },
            { data: 'nombre', title: 'Nombre' },
            { data: 'descripccion', title: 'Descripcion' },
            {
                data: "id",
                title: "Acciones",
                orderable: false,
                render: function (data) {
                    return '<button class="btn btn-info btn-sm btnEditar" data-id="' + data + '" title="Editar">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-danger btn-sm btnEliminar" data-id="' + data + '" title="Eliminar">' +
                        '<i class="fa fa-trash"></i> Eliminar</button>';
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": '<i class="fa fa-list"></i> Mostrar _MENU_ entradas',
            "zeroRecords": '<i class="fa fa-info-circle"></i> No se encontraron resultados',
            "emptyTable": '<i class="fa fa-database"></i> Ningun dato disponible en esta tabla',
            "info": '<i class="fa fa-info-circle"></i> Mostrando _START_ a _END_ de _TOTAL_ entradas',
            "infoEmpty": '<i class="fa fa-info-circle"></i> Mostrando 0 a 0 de 0 entradas',
            "infoFiltered": '<i class="fa fa-filter"></i> (filtrado de un total de _MAX_ entradas)',
            "search": '<i class="fa fa-search"></i> Buscar:',
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i> Primero',
                "last": '<i class="fa fa-fast-forward"></i> Último',
                "next": '<i class="fa fa-forward"></i> Siguiente',
                "previous": '<i class="fa fa-backward"></i> Anterior'
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    // Evento para editar
    $(document).on('click', '.btnEditar', function () {
        var id = $(this).data('id');
        EditarCatalogoInventario(id);
    });

    // Evento para eliminar
    $(document).on('click', '.btnEliminar', function () {
        var id = $(this).data('id');
        EliminarCatalogoInventario(id);
    });

    // Validación del formulario
    $("#frmCategoriaInventario").validate({
        rules: {
            Nombre: "required",
            Descripccion: "required"
        },
        messages: {
            Nombre: "Por favor ingrese el nombre de la categoría",
            Descripccion: "Por favor ingrese una descripción"
        },
        errorElement: "span",
        errorClass: "help-block",
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });

    GetAllCategoriaInventario();
});

function GetAllCategoriaInventario() {
    GetMVC("/Taller/GetAllCategoriaInventario", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblCategoriaInventario", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las Categorías del Inventario: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function SaveOrUpdateCategoriaInventario() {
    if ($("#frmCategoriaInventario").valid()) {
        var parametro = {
            Id: $("#id").val() || 0,
            Nombre: $("#nombre").val(),
            Descripccion: $("#descripccion").val(),
            Estatus: $("#estatus").val() || 1,
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val()
        };

        PostMVC('/Taller/SaveOrUpdateCategoriaInventario', parametro, function (r) {
            if (r.IsSuccess) {
                swal({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.href = '/Taller/CategoriaInventario';
                });
            } else {
                swal({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.href = '/Taller/CategoriaInventario';
                });
            }
        });
    }
}

function EliminarCatalogoInventario(id) {
    swal({
        title: "Eliminar registro",
        text: "Desea eliminar el siguiente registro",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        cancelButtonText: "Cancelar"
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            swal({
                title: "Eliminado",
                text: "La Categoria del Inventario ha sido eliminada.",
                type: "success",
                confirmButtonText: "Aceptar"
            }, function () {
                window.location.href = '/Taller/CategoriaInventario';
            });
            window.location.href = '/Taller/CategoriaInventario';
            PostMVC('/Taller/DeleteCategoriaInventarioById', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "La Categoria del Inventario ha sido eliminada.",
                        type: "success",
                        confirmButtonText: "Aceptar"
                    }, function () {
                        window.location.href = '/Taller/CategoriaInventario';
                    });
                } else {
                    swal({
                        title: "Eliminado",
                        text: "La Categoria del Inventario ha sido eliminada.",
                        type: "success",
                        confirmButtonText: "Aceptar"
                    }, function () {
                        window.location.href = '/Taller/CategoriaInventario';
                    });
                }
            });
        }
    });
}

function EditarCatalogoInventario(id) {
    location.href = "/Taller/CategoriaInventario/" + id;
}

function LimpiarFormulario() {
    $("#id").val('');
    $("#nombre").val('');
    $("#descripccion").val('');
    $("#frmCategoriaInventario").validate().resetForm();
    $('.form-group').removeClass('has-error');
}