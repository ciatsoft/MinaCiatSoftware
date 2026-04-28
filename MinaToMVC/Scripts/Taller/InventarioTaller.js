$(document).ready(function () {

    // Función para formatear como moneda MXN
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

    function unformatCurrency(value) {
        if (!value) return '';
        return value.toString().replace(/[^\d.-]/g, '');
    }

    // Función para obtener estado texto
    function obtenerEstadoTextoCantidad(cantidad) {
        if (cantidad === 0) return 'Sin Piezas Disponibles';
        if (cantidad < 10) return 'Pocas Piezas';
        if (cantidad < 25) return 'Moderado';
        return 'Stock Suficiente';
    }

    function obtenerEstadoCirculo(cantidad) {
        if (cantidad === 0) return '#6c757d';
        if (cantidad < 10) return '#dc3545';
        if (cantidad < 25) return '#ffc107';
        return '#28a745';
    }

    // Actualizar el TextBox cuando cambie la selección del DropDownList
    $("#ddlCategoriaInventario").change(function () {
        var selectedText = $(this).find("option:selected").text();
        $("#nombreCategoria").val(selectedText);

        if ($(this).val() === "") {
            $("#nombreCategoria").val("");
        }
    });

    if ($("#ddlCategoriaInventario").val() !== "") {
        var initialText = $("#ddlCategoriaInventario option:selected").text();
        $("#nombreCategoria").val(initialText);
    }

    // Configuración de DataTable para Inventario
    $("#tblInventario").DataTable({
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
            { data: 'idCategoria', title: 'IdCategoria', visible: false },
            { data: 'nombreCategoria', title: 'Categoria' },
            { data: 'marca', title: 'Marca' },
            { data: 'codigoFabricante', title: 'Codigo del Fabricante' },
            {
                data: 'cantidadExistente',
                title: 'Estado Inventario',
                render: function (data) {
                    var texto = obtenerEstadoTextoCantidad(data);
                    var color = obtenerEstadoCirculo(data);
                    return '<div class="estado-indicador">' +
                        '<span class="estado-circulo" style="background-color: ' + color + ';"></span>' +
                        '<span>' + texto + '</span>' +
                        '</div>';
                }
            },
            { data: 'cantidadExistente', title: 'Cantidad Existente' },
            {
                data: 'precioCompra',
                title: 'Precio',
                render: function (data) {
                    return formatCurrency(data);
                }
            },
            { data: 'ubicacionAlmacen', title: 'Ubicacion en Almacen' },
            { data: 'proveedor', title: 'Proveedor' },
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

    // Configuración de DataTable para Componentes de Vehículo
    $("#tblComponenteVehiculo").DataTable({
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
            { data: 'nombreInventario', title: 'Nombre de Pieza' },
            { data: 'cantidadComponente', title: 'Cantidad Usado' },
            {
                data: "id",
                title: "Acciones",
                orderable: false,
                render: function (data) {
                    return '<button class="btn btn-danger btn-sm btnEliminarComponente" data-id="' + data + '" title="Eliminar">' +
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

    // Eventos delegados
    $(document).on('click', '.btnEditar', function () {
        var id = $(this).data('id');
        EditarInventario(id);
    });

    $(document).on('click', '.btnEliminar', function () {
        var id = $(this).data('id');
        EliminarInventario(id);
    });

    $(document).on('click', '.btnEliminarComponente', function () {
        var id = $(this).data('id');
        EliminarComponenteInventario(id);
    });

    // Configuración de validación del formulario
    $("#frmInventario").validate({
        rules: {
            nombre: "required",
            IdCategoria: "required",
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

    // Formateo de precio de compra
    $('#precioCompra').on('input', function () {
        let input = $(this).val();
        let value = input.replace(/[^0-9.]/g, '');
        let parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        if (parts.length > 1 && parts[1].length > 2) {
            value = parts[0] + '.' + parts[1].substring(0, 2);
        }
        $(this).val(value);
    }).on('blur', function () {
        let value = $(this).val();
        if (value && value.trim() !== '') {
            let num = parseFloat(value);
            if (!isNaN(num)) {
                $(this).val(formatCurrency(num));
            }
        }
    }).on('focus', function () {
        let value = $(this).val();
        let cleaned = unformatCurrency(value);
        $(this).val(cleaned);
    });

    $('form').on('submit', function () {
        let rawValue = $('#precioCompra').val().replace(/[^\d.-]/g, '');
        if (rawValue) {
            let num = parseFloat(rawValue);
            if (!isNaN(num)) {
                $('#precioCompra').val(num.toFixed(2));
            }
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
            swal({
                title: "Error",
                text: "Error al cargar el Inventario: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function GetAllComponenteVehiculo() {
    GetMVC("/Taller/GetAllComponenteVehiculo", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblComponenteVehiculo", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar el Historial de Componentes: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function SaveOrUpdateInventario() {
    if ($("#frmInventario").valid()) {
        if ($("#ddlCategoriaInventario").val() === "") {
            swal({
                title: "Error",
                text: "Por favor seleccione una categoría",
                type: "error",
                confirmButtonText: "Aceptar"
            });
            return false;
        }

        var parametro = {
            Id: $("#id").val() || 0,
            Nombre: $("#nombre").val(),
            IdCategoria: $("#ddlCategoriaInventario").val(),
            NombreCategoria: $("#nombreCategoria").val(),
            Marca: $("#marca").val(),
            CodigoFabricante: $("#codigoFabricante").val(),
            CantidadExistente: $("#cantidadExistencia").val(),
            PrecioCompra: $("#precioCompra").val().replace(/[^\d.-]/g, ''),
            UbicacionAlmacen: $("#ubicacionAlmacen").val(),
            Proveedor: $("#proveedor").val(),
            Estatus: $("#estatus").val() || 1,
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val()
        };

        PostMVC('/Taller/SaveOrUpdateInventario', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                swal({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: "OK"
                }, function () {
                    window.location.reload();
                });
            } else {
                swal({
                    title: "Error",
                    text: "Error al guardar los datos: " + r.ErrorMessage,
                    type: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        });
    }
}

function LimpiarFormulario() {
    $("#frmInventario")[0].reset();
    $("#ddlCategoriaInventario").val("").trigger("change");
    $("#frmInventario").validate().resetForm();
    $('.form-group').removeClass('has-error');
}

function EditarInventario(id) {
    location.href = "/Taller/Inventario_Taller/" + id;
}

function EliminarInventario(id) {
    swal({
        title: "Eliminar Registro",
        text: "Se eliminara el siguiente registro",
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
                text: "El Inventario de este registro ha sido eliminado.",
                type: "success",
                confirmButtonText: "Aceptar"
            }, function () {
                window.location.reload();
            });
            window.location.reload();
            PostMVC('/Taller/DeleteInventarioById', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El Inventario de este registro ha sido eliminado.",
                        type: "success",
                        confirmButtonText: "Aceptar"
                    }, function () {
                        window.location.reload();
                    });
                } else {
                    swal({
                        title: "Error",
                        text: r.ErrorMessage || "Error al eliminar el inventario",
                        type: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            });
        }
    });
}

function EliminarComponenteInventario(id) {
    swal({
        title: "¿Estás seguro?",
        text: "¿Desea eliminar el siguiente registro?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/Taller/DeleteComponenteVehiculoById', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El Componente usado ha sido eliminado.",
                        type: "success",
                        confirmButtonText: "Aceptar"
                    }, function () {
                        window.location.reload();
                    });
                } else {
                    swal({
                        title: "Error",
                        text: r.ErrorMessage || "Error al eliminar el componente",
                        type: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            });
        }
    });
}

function AbrirModalComponente(id) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Usar Componente para Vehículo en Taller:");
    $("#boddyGeericModal").load("/Taller/PartialComponenteVehiculo/" + id, function () {
        $("#genericModal").modal("show");
    });
}

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});

document.getElementById("btnGenerarExcel").addEventListener("click", function () {
    generarReporteExcelInventario();
});

function obtenerEstadoTextoCantidad(cantidad) {
    if (cantidad === 0) return 'Sin Piezas Disponibles';
    if (cantidad < 10) return 'Pocas Piezas';
    if (cantidad < 25) return 'Moderado';
    return 'Stock Suficiente';
}

function obtenerEstadoTexto(cantidad) {
    if (cantidad === 0) return 'Agotado';
    if (cantidad <= 5) return 'Bajo';
    if (cantidad <= 20) return 'Normal';
    return 'Suficiente';
}

function generarReportePDF() {
    var table = $('#tblInventario').DataTable();
    var datos = table.data().toArray();

    swal({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        type: "info",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    setTimeout(function () {
        swal.close();
        swal({
            title: "¡Reporte generado!",
            text: "El PDF se ha creado correctamente",
            type: "success",
            timer: 3000,
            showConfirmButton: false
        });
    }, 4000);

    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    tablaHTML += '<thead><tr style="background-color:#34495e;color:white;">';
    tablaHTML += '<th style="padding:10px;">Nombre</th>';
    tablaHTML += '<th style="padding:10px;">Categoría</th>';
    tablaHTML += '<th style="padding:10px;">Marca</th>';
    tablaHTML += '<th style="padding:10px;">Código del Fabricante</th>';
    tablaHTML += '<th style="padding:10px;">Estado Inventario</th>';
    tablaHTML += '<th style="padding:10px;">Cantidad Existente</th>';
    tablaHTML += '<th style="padding:10px;">Precio</th>';
    tablaHTML += '<th style="padding:10px;">Ubicación en Almacén</th>';
    tablaHTML += '<th style="padding:10px;">Proveedor</th>';
    tablaHTML += '</tr></thead><tbody>';

    datos.forEach(function (item) {
        tablaHTML += '<tr>';
        tablaHTML += '<td style="padding:8px;">' + (item.nombre || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.nombreCategoria || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.marca || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.codigoFabricante || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + obtenerEstadoTextoCantidad(item.cantidadExistente) + '</td>';
        tablaHTML += '<td style="padding:8px;text-align:center;">' + (item.cantidadExistente || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.precioCompra ?
            new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            }).format(item.precioCompra) : '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.ubicacionAlmacen || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.proveedor || '') + '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

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

function generarReporteExcelInventario() {
    var table = $('#tblInventario').DataTable();
    var datos = table.data().toArray();

    if (datos.length === 0) {
        swal({
            title: "Inventario vacío",
            text: "No hay productos en el inventario para generar el reporte",
            type: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    swal({
        title: "Generando Excel...",
        text: "Por favor espere mientras se genera el archivo Excel",
        type: "info",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    setTimeout(function () {
        swal.close();
        swal({
            title: "¡Excel generado!",
            text: "El archivo Excel se ha creado correctamente",
            type: "success",
            timer: 3000,
            showConfirmButton: false
        });
    }, 2000);

    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    tablaHTML += '<thead><tr style="background-color:#34495e;color:white;">';
    tablaHTML += '<th style="padding:10px;">Nombre</th>';
    tablaHTML += '<th style="padding:10px;">Categoría</th>';
    tablaHTML += '<th style="padding:10px;">Marca</th>';
    tablaHTML += '<th style="padding:10px;">Código del Fabricante</th>';
    tablaHTML += '<th style="padding:10px;">Estado Inventario</th>';
    tablaHTML += '<th style="padding:10px;">Cantidad Existente</th>';
    tablaHTML += '<th style="padding:10px;">Precio</th>';
    tablaHTML += '<th style="padding:10px;">Ubicación en Almacén</th>';
    tablaHTML += '<th style="padding:10px;">Proveedor</th>';
    tablaHTML += '</tr></thead><tbody>';

    datos.forEach(function (item) {
        var estadoTexto = obtenerEstadoTexto(item.cantidadExistente || 0);

        tablaHTML += '<tr>';
        tablaHTML += '<td style="padding:8px;">' + (item.nombre || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.nombreCategoria || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.marca || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.codigoFabricante || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + estadoTexto + '</td>';
        tablaHTML += '<td style="padding:8px;text-align:center;">' + (item.cantidadExistente || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.precioCompra ?
            new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN'
            }).format(item.precioCompra) : '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.ubicacionAlmacen || '') + '</td>';
        tablaHTML += '<td style="padding:8px;">' + (item.proveedor || '') + '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></tr>';

    var form = $('<form>', {
        method: 'POST',
        action: '/Excel/GenerarReporteInventario'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaHTML',
        value: tablaHTML
    }).appendTo(form);

    form.appendTo('body').submit().remove();
}