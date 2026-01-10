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
            { data: 'idCategoria', title: 'IdCategoria', visible: false },
            { data: 'nombreCategoria', title: 'Categoria' },
            { data: 'marca', title: 'Marca' },
            { data: 'codigoFabricante', title: 'Codigo del Fabricante' },
            {
                data: 'cantidadExistente',
                title: 'Estado Inventario',
                render: function (data, type, row) {
                    if (data === 0) {
                        return '<div style="display: flex; align-items: center; gap: 8px;">' +
                            '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: #000000;"></div>' +
                            '<span>Sin Piezas Disponibles</span>' +
                            '</div>';
                    } else if (data < 10) {
                        return '<div style="display: flex; align-items: center; gap: 8px;">' +
                            '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: #dc3545;"></div>' +
                            '<span>Pocas Piezas</span>' +
                            '</div>';
                    } else if (data < 25) {
                        return '<div style="display: flex; align-items: center; gap: 8px;">' +
                            '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: #ffc107;"></div>' +
                            '<span>Moderado</span>' +
                            '</div>';
                    } else {
                        return '<div style="display: flex; align-items: center; gap: 8px;">' +
                            '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: #28a745;"></div>' +
                            '<span>Stock Suficiente</span>' +
                            '</div>';
                    }
                }
            },
            { data: 'cantidadExistente', title: 'Cantidad Existente' },
            {
                data: 'precioCompra',
                title: 'Precio',
                render: function (data) {
                    return new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                    }).format(data);
                }
            },
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

    $("#tblComponenteVehiculo").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            //{ data: 'idInventario', title: 'Id Inventario', visable: false },
            { data: 'nombreInventario', title: 'Nombre de Pieza' },
            { data: 'cantidadComponente', title: 'Cantidad Usado' },
            //{ data: 'idVehiculo', title: 'Id Vehiculo' },
            { data: 'placa', title: 'Placa del Vehiculo' },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarComponenteInventario(' + data + ')"/>';
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
    GetAllComponenteVehiculo();
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

function GetAllComponenteVehiculo() {
    GetMVC("/Taller/GetAllComponenteVehiculo", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblComponenteVehiculo", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar el Historial de Componentes: ' + r.ErrorMessage,
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

function EliminarComponenteInventario(id) {
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

            PostMVC('/Taller/DeleteComponenteVehiculoById', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El Componente usado ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                } else {
                    Swal.fire('Eliminado', 'El Componente usado ha sido eliminado.', 'success')
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

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});

// Función para generar el reporte PDF
function generarReportePDF() {
    var table = $('#tblInventario').DataTable();
    var datos = table.data().toArray();

    // Swalfire de generando reporte
    Swal.fire({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();

            // Cerrar automáticamente después de 8 segundos
            setTimeout(() => {
                Swal.close();

                // Mostrar mensaje de éxito después de cerrar
                Swal.fire({
                    icon: 'success',
                    title: '¡Reporte generado!',
                    text: 'El PDF se ha creado correctamente',
                    timer: 3000, // Opcional: cerrar después de 3 segundos
                    showConfirmButton: false
                });
            }, 4000); // 4000 ms = 4 segundos
        }
    });

    // Crear tabla HTML manualmente
    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';

    // Encabezados (excluyendo columnas ocultas y de acciones)
    tablaHTML += '<thead><tr>';
    tablaHTML += '<th>Nombre</th>';
    tablaHTML += '<th>Categoria</th>';
    tablaHTML += '<th>Marca</th>';
    tablaHTML += '<th>Codigo del Fabricante</th>';
    tablaHTML += '<th>Estado Inventario</th>';
    tablaHTML += '<th>Cantidad Existente</th>';
    tablaHTML += '<th>Precio</th>';
    tablaHTML += '<th>Ubicacion en Almacen</th>';
    tablaHTML += '<th>Proveedor</th>';
    tablaHTML += '</tr></thead>';

    // Datos
    tablaHTML += '<tbody>';
    datos.forEach(function (item) {
        tablaHTML += '<tr>';
        tablaHTML += '<td>' + (item.nombre || '') + '</td>';
        tablaHTML += '<td>' + (item.nombreCategoria || '') + '</td>';
        tablaHTML += '<td>' + (item.marca || '') + '</td>';
        tablaHTML += '<td>' + (item.codigoFabricante || '') + '</td>';
        tablaHTML += '<td>' + obtenerEstadoTexto(item.cantidadExistente) + '</td>';
        tablaHTML += '<td>' + (item.cantidadExistente || '') + '</td>';
        tablaHTML += '<td>' + (item.precioCompra ?
            new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            }).format(item.precioCompra) : '') + '</td>';
        tablaHTML += '<td>' + (item.ubicacionAlmacen || '') + '</td>';
        tablaHTML += '<td>' + (item.proveedor || '') + '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    // Crear formulario y enviar
    var form = $('<form>', {
        method: 'POST',
        action: '/Pdf/GenerarReporteInventario'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaHTML',
        value: tablaHTML
    }).appendTo(form);

    form.appendTo('body').submit().remove();
}

// Función auxiliar para convertir el estado a texto
function obtenerEstadoTexto(cantidad) {
    if (cantidad === 0) return 'Sin Piezas Disponibles';
    if (cantidad < 10) return 'Pocas Piezas';
    if (cantidad < 25) return 'Moderado';
    return 'Stock Suficiente';
}