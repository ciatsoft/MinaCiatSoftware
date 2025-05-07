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

function ObtenerPrecioMaterial() {
    var materialSeleccionado = $("#TipoMaterial_Id").val();

    if (!materialSeleccionado) {
        console.warn("No hay material seleccionado aún.");
        $("#precioMaterial").val(0);
        precioMaterial = 0;
        actualizarTotal();
        return;
    }

    GetMVC("/VentaPublicoGeneral/GetPreciosBymaterialId/" + materialSeleccionado, function (r) {
        if (r.IsSuccess && Array.isArray(r.Response) && r.Response.length > 0) {
            var datos = r.Response[0];
            precioMaterial = parseFloat(datos.precioActual) || 0;

            // Asignar el precio al input
            $("#precioMaterial").val(precioMaterial);

            // Al obtener el precio, actualizamos el total
            actualizarTotal();

        } else {
            console.error("Error en la respuesta:", r);
            $("#precioMaterial").val(0);
            precioMaterial = 0;
            actualizarTotal();
        }
    });
}

function actualizarTotal() {
    // Obtener el valor de la cantidad ingresada en el campo
    var cantidad = parseFloat($("#cantidadRecibida").val()) || 0;

    // Calcular el total
    var total = cantidad * precioMaterial;

    // Mostrar el total con formato de moneda
    $("#totalPagar").text("Total a Pagar: $" + total.toFixed(2));

    // Actualizar el cambio automáticamente
    actualizarCambio();
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