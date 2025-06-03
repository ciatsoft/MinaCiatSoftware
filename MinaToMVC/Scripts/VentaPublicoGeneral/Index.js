// Declarar precioMaterial como variable global
var precioMaterial = 0;

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
        order: [[0, 'desc']],
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
            {
                data: "cantidadRecibida",
                title: "Cantidad Recibida",
                render: function (data, type, row) {
                    if (data == null || data === "") return "$0.00";
                    return parseFloat(data).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2
                    });
                }
            },
            {
                data: "totalPago",
                title: "Total Pago",
                render: function (data, type, row) {
                    if (data == null || data === "") return "$0.00";
                    return parseFloat(data).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2
                    });
                }
            },
            { data: "transporte", title: "Transporte" },
            { data: "placa", title: "Placa" },
            { data: "cantidad", title: "Cantidad" },
            {
                data: "precioUnidad",
                title: "Precio por Unidad",
                render: function (data, type, row) {
                    if (data == null || data === "") return "$0.00";
                    return parseFloat(data).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2
                    });
                }
            },
            { data: "nombreUnidadMedida", title: "Unidad Medida" },
            { data: "userName", title: "Usuario" },
            {
                data: "fecha",
                title: "Fecha",
                render: function (data, type, row) {
                    if (!data) return "";
                    let date = new Date(data);
                    let day = String(date.getDate()).padStart(2, '0');
                    let month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0
                    let year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            },
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
            { data: "corte_Id", title: "ID Corte", visible: false },
            {
                data: "id",
                render: function (data, type, row) {
                    // row contiene toda la fila, así que podemos acceder a corte_Id
                    if (row.corte_Id > 0) {
                        return '<label>Ya en corte<label/>'; // No se muestran los botones si corte_Id > 0
                    }

                    // Mostrar botones si corte_Id <= 0
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

    $("#totalPagar").text("Total a Pagar: " + formatMoney(total));
    $("#TotalPagoInput").val(total);

    actualizarCambio(); // Asegúrate de tener esta función definida
}

function actualizarCambio() {
    var dineroRecibido = parseFloat($("#dineroRecibido").val()) || 0;

    // Obtener el total desde el input oculto, no desde el texto formateado
    var totalPagar = parseFloat($("#TotalPagoInput").val()) || 0;

    // Calcular el cambio
    var cambio = dineroRecibido - totalPagar;

    // Mostrar el total recibido con formato de moneda
    $("#totalRecibido").text("Dinero Recibido: " + formatMoney(dineroRecibido));

    // Mostrar el cambio o advertencia por fondos insuficientes
    if (cambio < 0) {
        $("#cambio").text("Cambio: Fondos insuficientes").css("color", "red");
    } else {
        $("#cambio").text("Cambio: " + formatMoney(cambio)).css("color", "green");
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
