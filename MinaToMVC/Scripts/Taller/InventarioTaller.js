$(document).ready(function () {

    // Actualizar el TextBox cuando cambie la selección del DropDownList
    $("#ddlCategoriaInventario").change(function () {
        var selectedText = $(this).find("option:selected").text();
        $("#nombreCategoria").val(selectedText);

        // Si el usuario selecciona "Selecciona una categoria", limpiamos el TextBox
        if ($(this).val() === "") {
            $("#nombreCategoria").val("");
        }
    });

    // También puedes inicializar el valor si ya hay una selección al cargar la página
    if ($("#ddlCategoriaInventario").val() !== "") {
        var initialText = $("#ddlCategoriaInventario option:selected").text();
        $("#nombreCategoria").val(initialText);
    }

    // Configuración de DataTable
    $("#tblInventario").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'nombre', title: 'Nombre' },
            { data: 'idCategoria', title: 'IdCategoria', visable: false },
            { data: 'nombreCategoria', title: 'Categoria' },
            { data: 'marca', title: 'Marca' },
            { data: 'codigoFabricante', title: 'Codigo del Fabricante' },
            { data: 'cantidadExistente', title: 'Cantidad Existente' },
            { data: 'precioCompra', title: 'Precio' },
            { data: 'ubicacionAlmacen', title: 'Ubicacion en Almacen' },
            { data: 'proveedor', title: 'Proveedor' },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarInventario(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarInventario(' + data + ')"/>';
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Usar Componente" class="btn btn-success btn-lg-custom" onclick="AbrirModalComponente(' + data + ')" />';
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
    });

    // Configuración de validación del formulario
    $("#frmInventario").validate({
        rules: {
            nombre: "required",
            IdCategoria: "required",  // Asegúrate de que coincida con el nombre de la propiedad
            marca: "required",
            codigoFabricante: "required",
            cantidadExistencia: "required",
            precioCompra: "required",
            ubicacionAlmacen: "required",
            proveedor: "required"
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            IdCategoria: "Por favor seleccione una categoría",
            marca: "Por favor ingrese la marca",
            codigoFabricante: "Por favor ingrese el código del fabricante",
            cantidadExistencia: "Por favor ingrese la cantidad existente",
            precioCompra: "Por favor ingrese el precio de compra",
            ubicacionAlmacen: "Por favor ingrese la ubicación en almacén",
            proveedor: "Por favor ingrese el proveedor"
        }
    });

    GetAllInventario();
});

function GetAllInventario() {
    GetMVC("/Taller/GetAllInventario", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblInventario", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar el Inventario: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function SaveOrUpdateInventario() {
    if ($("#frmInventario").valid()) {
        // Validación adicional para la categoría
        if ($("#ddlCategoriaInventario").val() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor seleccione una categoría',
                confirmButtonText: 'Aceptar'
            });
            return false;
        }

        var parametro = {
            Id: $("#id").val(),
            Nombre: $("#nombre").val(),
            IdCategoria: $("#ddlCategoriaInventario").val(),
            NombreCategoria: $("#nombreCategoria").val(),
            Marca: $("#marca").val(),
            CodigoFabricante: $("#codigoFabricante").val(),
            CantidadExistente: $("#cantidadExistencia").val(),
            PrecioCompra: $("#precioCompra").val(),
            UbicacionAlmacen: $("#ubicacionAlmacen").val(),
            Proveedor: $("#proveedor").val(),
            Estatus: $("#estatus").val(),
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val(),
        };

        PostMVC('/Taller/SaveOrUpdateInventario', parametro, function (r) {
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
    $("#frmInventario")[0].reset();
    $("#ddlCategoriaInventario").val("").trigger("change");
}

function EditarInventario(id) {
    location.href = "/Taller/Inventario_Taller/" + id;
}

function EliminarInventario(id) {
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

            PostMVC('/Taller/DeleteInventarioById', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El Inventario de este registro ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                } else {
                    Swal.fire('Eliminado', 'El Inventario de este registro ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                }
            });
        }
    });
}

function AbrirModalComponente(id) {
    // Limpiar completamente el modal antes de cargar nuevo contenido
    $("#genericModal").removeData('b s.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Usar Componente para Vehiculo en Taller:");
    $("#boddyGeericModal").load("/Taller/PartialComponenteVehiculo/" + id, function () {
        $("#genericModal").modal("show");
    });
}