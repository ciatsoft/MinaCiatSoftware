$(document).ready(function () {

    // Actualiza el precio y total cuando cambia la cantidad
    $("#cantidadRecibida").on("input", function () {
        ObtenerPrecioMaterial();
    });

    // También cuando cambia el tipo de material
    $("#TipoMaterial_Id").on("change", function () {
        ObtenerPrecioMaterial();
    });

    $("#tablePuntoVenta").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "id" },
            { data: "folio", title: "Folio" },
            { data: "nombreUbicacion",title: "Planta"},
            { data: "nombreTipoMaterial", title: "Material" },
            {
                data: "formaDePago",
                title: "Forma de Pago",
                render: function (data, type, row) {
                    if (data === "E") {
                        return "Efectivo";
                    }
                    else if (data == "T") {
                        return "Transferencia";
                    } else {
                        return "Vale";
                    }
                    return data;
                }
            },
            { data: "cantidadRecibida", title: "Cantidad Recibida" },
            { data: "totalPago", title: "Total Pago" },
            { data: "transporte", title: "Transporte" },
            { data: "placa", title: "Placa" },
            { data: "cantidad", title: "Cantidad" },
            { data: "precioUnidad", title: "Precio por Unidad" },
            { data: "nombreUnidadMedida", title: "Unidad Medida" },
            { data: "userName", title: "Usuario" },
            { data: "fecha", title: "Fecha" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "estatusVenta",
                title: "Pago",
                render: function (data, type, row) {
                    if (data === "E") {
                        return "Efectivo";
                    }
                    else if (data == "C") {
                        return "Cancelada";
                    } else {
                        return "Rechazada";
                    }
                    return data;
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Cancelar Venta" class="btn btn-custom-cancel" onclick="ActualizarVenta(' + data + ', \'C\')" />' +
                        '<br /><br />' +
                        '<input type="button" value="Rechazar Venta" class="btn btn-custom-clean" onclick="ActualizarVenta(' + data + ', \'R\')" />';
                }
            }
        ]
        ,
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
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

    GetAllPV_Ventas();
})

$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmVentaCrud").validate({
        rules: {
            "Ubicacion_Id": {
                required: true
            },
            "TipoMaterial_Id": {
                required: true
            },
            "Transporte": {
                required: true
            },
            "Placa": {
                required: true
            }
        }
    });

    // Variables globales
    var precioMaterial = 0;

    // Al cambiar la ubicación, carga los materiales disponibles
    $("#Ubicacion_Id").on("change", function () {
        CambioUbicacion();
    });

    // Al cambiar el material, actualiza el precio
    $("#TipoMaterial_Id").on("change", function () {
        ObtenerPrecioMaterial();
    });

    // Escucha cambios en la cantidad recibida
    $("#cantidadRecibida").on("input", function () {
        actualizarTotal();
    });

    // Escucha el cambio en el dinero recibido
    $("#dineroRecibido").on("input", function () {
        actualizarCambio();
    });

    // Inicializar al cargar la página si hay valores seleccionados
    if ($("#Ubicacion_Id").val()) {
        CambioUbicacion();
    }
});

function CambioUbicacion() {
    var ubicacionSeleccionada = $("#Ubicacion_Id").val();

    if (!ubicacionSeleccionada) {
        $("#TipoMaterial_Id").empty().append('<option value="">Selecciona una opción</option>');
        $("#precioMaterial").val(0);
        precioMaterial = 0;
        actualizarTotal();
        return;
    }

    GetMVC("/VentaPublicoGeneral/GetMaterialUbicacionByUbicacion/" + ubicacionSeleccionada, function (r) {
        if (r.IsSuccess) {
            $("#TipoMaterial_Id").empty();

            // Agregar opción por defecto
            $("#TipoMaterial_Id").append('<option value="">Selecciona un material</option>');

            $.each(r.Response, function (index, item) {
                var templateoption = "<option value='" + item.material.id + "'>" + item.material.nombreTipoMaterial + "</option>";
                $("#TipoMaterial_Id").append(templateoption);
            });

            // Si solo hay un material, seleccionarlo automáticamente
            if (r.Response.length === 1) {
                $("#TipoMaterial_Id").val(r.Response[0].material.id).trigger('change');
            } else {
                // Limpiar precios si hay múltiples opciones
                $("#precioMaterial").val(0);
                precioMaterial = 0;
                actualizarTotal();
            }
        } else {
            console.log(r.response.ErrorMessage);
            window.Swal.fire('Error', 'No es posible obtener los materiales de esta ubicación: ', 'error');
        }
    });
}

// Declarar precioMaterial como variable global
var precioMaterial = 0;

// Función para obtener y asignar el precio dependiendo de la cantidad
function ObtenerPrecioMaterial() {
    var materialSeleccionado = $("#TipoMaterial_Id").val();
    var cantidadFormulario = parseFloat($("#cantidadRecibida").val()) || 0;

    if (!materialSeleccionado) {
        console.warn("No hay material seleccionado aún.");
        $("#precioMaterial").val(0);
        precioMaterial = 0;
        actualizarTotal();
        return;
    }

    // Obtener los precios desde el backend
    GetMVC("/VentaPublicoGeneral/GetPreciosBymaterialId/" + materialSeleccionado, function (r) {
        if (r.IsSuccess && Array.isArray(r.Response) && r.Response.length > 0) {

            // Filtrar solo los objetos con esPrecioActivo = true
            const preciosActivos = r.Response.filter(item => item.esPrecioActivo === true);

            if (preciosActivos.length > 0) {
                var datos = preciosActivos[0]; // Usamos el primero activo
                var cantidadMenudeo = parseFloat(datos.cantidad) || 0;

                precioMaterial = (cantidadFormulario > cantidadMenudeo)
                    ? parseFloat(datos.precioMayoreo) || 0
                    : parseFloat(datos.precioMenudeo) || 0;

                $("#precioMaterial").val(precioMaterial);
                $("#PrecioUnidad").val(precioMaterial);
            } else {
                console.warn("No se encontraron precios con esPrecioActivo = true");
                precioMaterial = 0;
                $("#precioMaterial").val(0);
                $("#PrecioUnidad").val(0);
            }

            actualizarTotal();
        } else {
            console.error("Error en la respuesta:", r);
            precioMaterial = 0;
            $("#precioMaterial").val(0);
            actualizarTotal();
        }
    });
}

// Función para calcular y actualizar el total a pagar
function actualizarTotal() {
    var cantidad = parseFloat($("#cantidadRecibida").val()) || 0;
    var total = cantidad * precioMaterial;

    $("#totalPagar").text("Total a Pagar: $" + total.toFixed(2));
    $("#TotalPagoInput").val(total);

    actualizarCambio(); // Asegúrate de tener esta función definida
}

function actualizarCambio() {
    // Obtener el valor de la cantidad recibida
    var dineroRecibido = parseFloat($("#dineroRecibido").val()) || 0;

    // Obtener el valor total a pagar (quitando el texto y el símbolo $)
    var totalPagarText = $("#totalPagar").text().replace("Total a Pagar: $", "");
    var totalPagar = parseFloat(totalPagarText) || 0;

    // Calcular el cambio
    var cambio = dineroRecibido - totalPagar;

    // Mostrar el total recibido con formato de moneda
    $("#totalRecibido").text("Dinero Recibido: $" + dineroRecibido.toFixed(2));

    // Condicional para mostrar el cambio
    if (cambio < 0) {
        $("#cambio").text("Cambio: Fondos insuficientes").css("color", "red");
    } else {
        $("#cambio").text("Cambio: $" + cambio.toFixed(2)).css("color", "green");
    }
}

function GetAllPV_Ventas() {
    GetMVC("/VentaPublicoGeneral/GetAllPV_Ventas", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tablePuntoVenta", r.Response);
        } else {
            alert("Error al cargar las Ventas: " + r.ErrorMessage);
        }
    });
}

function ActualizarVenta(idVenta, tipoAccion) {
    PostMVC('/VentaPublicoGeneral/ActualizarEstatusVenta', { id: idVenta, valor: tipoAccion }, function (r) {
        if (r.IsSuccess) {
            location.href = '/VentaPublicoGeneral/Index';
        } else {
            alert("Error al actualizar la venta. Ver consola para más detalles.");
        }
    });
}
