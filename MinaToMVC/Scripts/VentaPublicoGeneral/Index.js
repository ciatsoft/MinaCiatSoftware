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

    // Filtrado RFID cliente venta publico general
    $('#rfid').on('input', function () {
        const valorRFID = $(this).val().trim();
        const $nombreCliente = $('#nombreCliente');
        const $descripcionVehiculo = $('#descripcionVehiculo');
        const $placa = $('#placa');
        const $cantidadRecibida = $('#cantidadRecibida');
        const $dropdown = $('#vehiculosDropdown');

        // Limpiar todo si no hay RFID
        if (!valorRFID) {
            $nombreCliente.val('');
            $descripcionVehiculo.val('');
            $placa.val('');
            $cantidadRecibida.val('');
            $dropdown.empty().append('<option value="">Seleccione un vehículo</option>');
            return;
        }

        $.ajax({
            url: '/VentaPublicoGeneral/SearchClienteByRFID',
            type: 'GET',
            data: { rfid: valorRFID },
            dataType: 'json',
            success: function (respuesta) {
                if (respuesta.IsSuccess && respuesta.Response && Object.keys(respuesta.Response).length > 0) {
                    const cliente = respuesta.Response;
                    $nombreCliente.val(cliente.nombre || '');

                    // Solo si encontramos cliente, buscamos vehículos
                    $.ajax({
                        url: '/VentaPublicoGeneral/GetVehiculosPublicoGralByIdCliente',
                        type: 'GET',
                        data: { id: cliente.id },
                        dataType: 'json',
                        success: function (respuesta2) {
                            $dropdown.empty();

                            if (respuesta2.IsSuccess && respuesta2.Response) {
                                const vehiculosArray = Array.isArray(respuesta2.Response) ?
                                    respuesta2.Response : [respuesta2.Response];

                                if (vehiculosArray.length > 0) {
                                    $dropdown.append('<option value="">Seleccione un vehiculo</option>');

                                    vehiculosArray.forEach(vehiculo => {
                                        $dropdown.append($('<option></option>')
                                            .val(vehiculo.nombre)
                                            .text(vehiculo.nombre)
                                            .data('placa', vehiculo.placa)
                                            .data('capacidad', vehiculo.capacidad));
                                    });

                                    $dropdown.on('change', function () {
                                        const selected = $(this).find('option:selected');
                                        if (selected.val()) {
                                            $descripcionVehiculo.val(selected.val());
                                            $placa.val(selected.data('placa'));
                                        } else {
                                            $descripcionVehiculo.val('');
                                            $placa.val('');

                                        }
                                    });

                                    if (vehiculosArray.length === 1) {
                                        $dropdown.val(vehiculosArray[0].nombre).trigger('change');
                                    }
                                } else {
                                    $dropdown.append('<option value="">No hay vehiculos</option>');
                                    // No limpiamos otros campos si no hay vehículos pero sí cliente
                                }
                            } else {
                                $dropdown.append('<option value="">Error al cargar</option>');
                                // No limpiamos otros campos si hay error pero sí cliente encontrado
                            }
                        },
                        error: function () {
                            $dropdown.append('<option value="">Error al cargar</option>');
                            // No limpiamos campos existentes en error de vehículos
                        }
                    });
                } else {
                    // Solo limpiamos si no encontramos cliente
                    $nombreCliente.val('');
                    $descripcionVehiculo.val('');
                    $placa.val('');
                    $cantidadRecibida.val('');
                    $dropdown.empty().append('<option value="">No se encontro cliente</option>');
                }
            },
            error: function () {
                // No limpiamos campos en error de conexión (podría ser temporal)
                console.error("Error en la solicitud AJAX");
            }
        });
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
            { data: "nombreTipoMaterial", title: "Material" },
            { data: "nombreUbicacion", title: "Planta" },
            {
                data: "formaDePago",
                "visible": false,
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
                "visible": false,
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
            { data: "nombreUnidadMedida", title: "Unidad Medida", "visible": false },
            { data: "userName", title: "Vendedor"},
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
                "visible": false,
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "estatusVenta",
                "visible": false,
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
            { data: "rfid", title: "RFID", visible: false },
            { data: "nombreCliente", title: "Nombre Cliente" },
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
            },
            {
                data: "id",
                render: function (data, type, row, meta) {
                    return `
                        <button 
                            type="button"
                            onclick="printItem(${meta.row})"
                            style="background-color: yellow; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                            Imprimir
                        </button>
                    `;
                }
            },
            {
                data: "carga",  // Esta es la columna que define si está cargado o no (0 o 1)
                title: "Carga",
                render: function (data, type, row) {  // Añade 'row' para acceder a todas las propiedades de la fila
                    if (data == 0) {
                        return `
                            <input type="button" value="Cargar" class="btn btn-success" onclick="Cargar(${row.id})" />
                        `;
                                } else if (data == 1) {
                                    return `
                            <span style="display: inline-flex; align-items: center; gap: 5px;">
                              <span style="
                                display: inline-block;
                                width: 20px;
                                height: 20px;
                                background-color: red;
                                border-radius: 50%;
                              "></span> 
                              Ya cargado
                            </span>
                        `;
                    } else {
                        return '';
                    }
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

    $("#tableDeducciones").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        order: [[0, 'desc']],
        searching: true,
        columns: [
            { data: "id", visible: true, title: "Id" },
            { data: "nombreGasto", title: "Tipo Gasto" },
            { data: "descripcion", title: "Descripción de la Deducción" },
            { data: "usuarioName", title: "Encargado" },
            {
                data: "monto",
                title: "Monto",
                render: function (data) {
                    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data);
                }
            },
            {
                data: "fecha",
                title: "Fecha",
                render: function (data) {
                    return new Date(data).toLocaleDateString('es-MX');
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return `
                    <input type="button" value="Cancelar" class="btn btn-custom-cancel" onclick="EliminarDeduccion(${data})" />
                     <input type="button" value="Imprimir" class="btn btn-custom-cancel" style="background-color: yellow; border:
                     none; color:black;  padding: 7px 10px; border-radius: 5px; cursor: pointer;" onclick="ImprimirDeduccion(${data})" />
                      <input type="button" value="Editar" class="btn btn-custom-clean" style="width: 65px;" onclick="EditarDeduccion(${data})" />
                `;
                }
            }
        ],
        language: {
            decimal: ",",
            thousands: ".",
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ entradas",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de un total de _MAX_ entradas)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            aria: {
                sortAscending: ": activar para ordenar ascendente",
                sortDescending: ": activar para ordenar descendente"
            }
        }

    });

    GetAllPV_Ventas();
});

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
            GetAllDeducciones();
        } else {
            alert("Error al cargar las Ventas: " + r.ErrorMessage);
        }
    });
}

function GetAllDeducciones() {
    GetMVC("/VentaPublicoGeneral/GetAllDeducciones", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableDeducciones", r.Response);
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

// Evento del botón Filtrado
document.getElementById("btnFiltrar").addEventListener("click", function () {

    var usuarioId = $("#userId").val();
    var fecha = $("#fechaFiltro").val();
    var userName = $("#userName").val();

    if (!usuarioId || !fecha || !userName) {
        alert("Por favor, seleccione un usuario y una fecha válida.");
        return;
    }

    SearchPV_VentasByDateAndUser( fecha, userName);
});
// Escucha del botón
document.getElementById("btnDeducciones").addEventListener("click", function () {
    var usuarioIdDeducciones = $("#userIdDeducciones").val();
    var fechaDeducciones = $("#fechaDeducciones").val();
    var userNameDeducciones = $("#userNameDeducciones").val();

    if (!usuarioIdDeducciones || !fechaDeducciones || !userNameDeducciones) {
        alert("Por favor, seleccione un usuario y una fecha válida.");
        return;
    }

    SearchDeduccionesFecha(fechaDeducciones);
});

// Función principal
function SearchDeduccionesFecha(fechaDeducciones) {
    PostMVC('/VentaPublicoGeneral/SearchDeduccionesByDate', { fechaDeducciones }, function (r) {
        if (r.IsSuccess && Array.isArray(r.Response)) {
            const data = r.Response;
            const table = $("#tableDeducciones");

            // Destruir tabla existente
            if ($.fn.DataTable.isDataTable(table)) {
                table.DataTable().clear().destroy();
                table.empty();
            }

            // Asegurar estructura básica
            if (table.find('thead').length === 0) {
                table.append('<thead><tr></tr></thead>');
            }
            if (table.find('tbody').length === 0) {
                table.append('<tbody></tbody>');
            }

            // Crear DataTable
            table.DataTable({
                data: data,
                processing: true,
                paging: true,
                searching: true,
                columns: [
                    { data: "id", title: "Id" },
                    { data: "nombreGasto", title: "Tipo Gasto" },
                    { data: "descripcion", title: "Descripción de la Deducción" },
                    { data: "usuarioName", title: "Encargado" },
                    {
                        data: "monto",
                        title: "Monto",
                        render: function (data) {
                            return new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN'
                            }).format(data);
                        }
                    },
                    {
                        data: "fecha",
                        title: "Fecha",
                        render: function (data) {
                            return new Date(data).toLocaleDateString('es-MX');
                        }
                    },
                    {
                        data: "id",
                        title: "Acciones",
                        render: function (data) {
                            return `
                                <input type="button" value="Cancelar" class="btn btn-custom-cancel" onclick="EliminarDeduccion(${data})" />
                                <input type="button" value="Imprimir" class="btn btn-custom-cancel" style="background-color: yellow; border:
                                none; color:black;  padding: 7px 10px; border-radius: 5px; cursor: pointer;" onclick="ImprimirDeduccion(${data})" />
                                    `;
                        }
                    }
                ],
                language: {
                    decimal: ",",
                    thousands: ".",
                    processing: "Procesando...",
                    lengthMenu: "Mostrar _MENU_ entradas",
                    zeroRecords: "No se encontraron resultados",
                    emptyTable: "Ningún dato disponible en esta tabla",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    infoEmpty: "Mostrando 0 a 0 de 0 entradas",
                    infoFiltered: "(filtrado de un total de _MAX_ entradas)",
                    search: "Buscar:",
                    loadingRecords: "Cargando...",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente",
                        previous: "Anterior"
                    },
                    aria: {
                        sortAscending: ": activar para ordenar ascendente",
                        sortDescending: ": activar para ordenar descendente"
                    }
                }
            });

        } else {
            console.warn("No se recibieron datos válidos o la respuesta no fue exitosa:", r);
            $('#tableDeducciones').html('<div class="alert alert-warning">No se encontraron registros para los criterios seleccionados</div>');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
        $('#tableDeducciones').html('<div class="alert alert-danger">Error al cargar los datos</div>');
    });
}

function SearchPV_VentasByDateAndUser( fecha) {
    PostMVC('/VentaPublicoGeneral/SearchPV_VentasByDateAndUser', { fecha }, function (r, textStatus, jqXHR) {
        if (r.IsSuccess && Array.isArray(r.Response)) {
            const data = r.Response;
            const table = $('#tablePuntoVenta');

            // Destruir DataTable existente si existe
            if ($.fn.DataTable.isDataTable(table)) {
                table.DataTable().clear().destroy();
                table.empty(); // Limpiar la tabla para evitar duplicados
            }

            // Asegurar que la tabla tiene la estructura HTML correcta
            if (table.find('thead').length === 0) {
                table.append('<thead><tr></tr></thead>');
            }
            if (table.find('tbody').length === 0) {
                table.append('<tbody></tbody>');
            }

            // Configuración de DataTable
            table.DataTable({
                processing: true,
                paging: true,
                searching: true,
                order: [[0, 'desc']],
                data: data,
                columns: [
                    { data: "id", visible: false, title: "id" },
                    { data: "folio", title: "Folio" },
                    { data: "nombreTipoMaterial", title: "Material" },
                    { data: "nombreUbicacion", title: "Planta" },
                    {
                        data: "formaDePago",
                        visible: false,
                        title: "Forma de Pago",
                        render: function (data) {
                            const tiposPago = { "E": "Efectivo", "T": "Transferencia" };
                            return tiposPago[data] || "Vale";
                        }
                    },
                    {
                        data: "cantidadRecibida",
                        title: "Cantidad Recibida",
                        render: $.fn.dataTable.render.number(',', '.', 2, '$')
                    },
                    {
                        data: "totalPago",
                        title: "Total Pago",
                        render: $.fn.dataTable.render.number(',', '.', 2, '$')
                    },
                    { data: "transporte", title: "Transporte" },
                    { data: "placa", title: "Placa" },
                    {
                        data: "cantidad",
                        title: "Cantidad",
                        render: function (data) {
                            return parseFloat(data).toLocaleString('es-MX');
                        }
                    },
                    {
                        data: "precioUnidad",
                        visible: false,
                        title: "Precio por Unidad",
                        render: $.fn.dataTable.render.number(',', '.', 2, '$')
                    },
                    { data: "nombreUnidadMedida", title: "Unidad Medida", visible: false },
                    { data: "userName", title: "Vendedor"},
                    {
                        data: "fecha",
                        title: "Fecha",
                        render: function (data) {
                            if (!data) return "";
                            const date = new Date(data);
                            return date.toLocaleDateString('es-MX');
                        }
                    },
                    {
                        data: "estatus",
                        visible: false,
                        title: "Estatus",
                        render: function (data) {
                            return data == 1 ? "Activo" : "Inactivo";
                        }
                    },
                    {
                        data: "estatusVenta",
                        visible: false,
                        title: "Pago",
                        render: function (data) {
                            const estados = { "E": "Efectivo", "C": "Cancelada" };
                            return estados[data] || "Rechazada";
                        }
                    },
                    { data: "rfid", title: "RFID", visible: false },
                    { data: "nombreCliente", title: "Nombre Cliente" },
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
                    },
                    {
                        data: "id",
                        render: function (data, type, row, meta) {
                            return `
                        <button 
                            type="button"
                            onclick="printItem(${meta.row})"
                            style="background-color: yellow; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                            Imprimir
                        </button>
                    `;
                        }
                    },
                    {
                        data: "carga",
                        title: "Carga",
                        render: function (data, type, row) {  // Añade 'row' para acceder a todas las propiedades de la fila
                            if (data == 0) {
                                return `
                            <input type="button" value="Cargar" class="btn btn-success" onclick="Cargar(${row.id})" />
                        `;
                            } else if (data == 1) {
                                return `
                            <span style="display: inline-flex; align-items: center; gap: 5px;">
                              <span style="
                                display: inline-block;
                                width: 20px;
                                height: 20px;
                                background-color: red;
                                border-radius: 50%;
                              "></span> 
                              Ya cargado
                            </span>
                        `;
                            } else {
                                return '';
                            }
                        },
                        orderable: false,
                        searchable: false
                    }
                ],
                language: {
                    decimal: ",",
                    thousands: ".",
                    processing: '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>',
                    lengthMenu: "Mostrar _MENU_ registros",
                    zeroRecords: "No se encontraron resultados",
                    emptyTable: "No hay datos disponibles",
                    info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    infoEmpty: "Mostrando 0 registros",
                    infoFiltered: "(filtrado de _MAX_ registros totales)",
                    search: "Buscar:",
                    loadingRecords: "Cargando...",
                    paginate: {
                        first: "Primero",
                        last: "Último",
                        next: "Siguiente <i class='fas fa-chevron-right'></i>",
                        previous: "<i class='fas fa-chevron-left'></i> Anterior"
                    }
                },
                responsive: true,
                dom: '<"top"lf>rt<"bottom"ip><"clear">',
                initComplete: function () {
                    // Añadir clases CSS a los elementos de la tabla
                    $('.dataTables_filter input').addClass('form-control');
                    $('.dataTables_length select').addClass('form-select');
                }
            });
        } else {
            console.warn("No se recibieron datos válidos o la respuesta no fue exitosa:", r);
            // Mostrar mensaje al usuario
            $('#tablePuntoVenta').html('<div class="alert alert-warning">No se encontraron registros para los criterios seleccionados</div>');
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error en la solicitud AJAX:", textStatus, errorThrown);
        $('#tablePuntoVenta').html('<div class="alert alert-danger">Error al cargar los datos</div>');
    });
}

// Generar Tickets
function printItem(rowIndex) {
    var table = $('#tablePuntoVenta').DataTable();
    var rowData = table.row(rowIndex).data();

    var folio = rowData.folio;
    var nombrePlana = rowData.nombreUbicacion;
    var nombreMaterial = rowData.nombreTipoMaterial;
    var formaPago = rowData.formaDePago;
    //var cantidadRecibida = parseFloat(rowData.cantidadRecibida).toFixed(2);
    var totalPago = parseFloat(rowData.totalPago).toFixed(2);
    var transporte = rowData.transporte;
    var placa = rowData.placa;
    var cantidad = parseFloat(rowData.cantidad).toFixed(2);
    var precioUnidad = parseFloat(rowData.precioUnidad).toFixed(2);
    var vendedor = rowData.userName;
    var RFID = rowData.rfid;
    var nombreCliente = rowData.nombreCliente;

    var fechaOriginal = new Date(rowData.fecha);
    var fechaFormateada =
        String(fechaOriginal.getDate()).padStart(2, '0') + '/' +
        String(fechaOriginal.getMonth() + 1).padStart(2, '0') + '/' +
        fechaOriginal.getFullYear() + ' ' +
        String(fechaOriginal.getHours()).padStart(2, '0') + ':' +
        String(fechaOriginal.getMinutes()).padStart(2, '0');

    var formatoPagoFinal = formaPago === 'T' ? 'Transferencia'
        : formaPago === 'E' ? 'Efectivo'
            : 'Vale';

    const { jsPDF } = window.jspdf;

    const generarTicket = (tituloSecundario, nombreArchivo) => {
        const pdf = new jsPDF({
            unit: 'mm',
            format: [80, 150],
            orientation: 'portrait'
        });

        let y = 10;
        pdf.setFontSize(12);
        pdf.setFont("calibri", "bold");
        pdf.text("Ticket de Venta", 40, y, { align: 'center' });

        y += 6;
        pdf.text(tituloSecundario, 40, y, { align: 'center' });

        y += 6;
        pdf.setFontSize(8);
        pdf.setFont("calibri", "normal");
        pdf.text(`Fecha: ${fechaFormateada}`, 40, y, { align: 'center' });

        y += 4;
        pdf.line(10, y, 70, y); // línea separadora

        const addRow = (label, value) => {
            y += 5;
            pdf.setFont("calibri", "bold");
            pdf.text(`${label}:`, 10, y);
            pdf.setFont("calibri", "normal");
            pdf.text(String(value), 70, y, { align: 'right' });
        };

        addRow("Folio", folio);
        addRow("Planta", nombrePlana);
        addRow("Material", nombreMaterial);
        addRow("Cantidad", `${cantidad}`);
        addRow("Precio/Unidad", `$${precioUnidad}`);
        addRow("Total a Pagar", `$${totalPago}`);
        //addRow("Recibido", `$${cantidadRecibida}`);
        addRow("Forma de Pago", formatoPagoFinal);
        addRow("Transporte", transporte);
        addRow("Placa", placa);
        addRow("Vendedor", vendedor);
        addRow("RFID", RFID);
        addRow("Cliente", nombreCliente);

        y += 6;
        pdf.line(10, y, 70, y); // línea final
        y += 6;
        pdf.setFont("calibri", "italic");
        pdf.text("Gracias por su compra", 40, y, { align: 'center' });

        pdf.save(nombreArchivo);
    };

    // Generar dos PDFs independientes
    generarTicket("Vale de Carga en Planta", `ticket_folio_${folio}_carga.pdf`);
    generarTicket("Vale de Salida", `ticket_folio_${folio}_vale_salida.pdf`);
}

// Asociar Vehiculos CLiente
function AbrirModalVehiculoPublicoGeneral() {
    // Limpiar completamente el modal antes de cargar nuevo contenido
    $("#genericModal").removeData('b s.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Agregar Vehiculo a Cliente:");

    $("#boddyGeericModal").load("/VentaPublicoGeneral/PartialVehiculoClientesPublicoGeneral", function () {
        $("#genericModal").modal("show");
    });
}

function AbrirModalDeducciones() {
    // Limpiar completamente el modal antes de cargar nuevo contenido
    $("#genericModal").removeData('bs.modal');
    $("#titleGenerciModal").text("Deducciones");
    $("#boddyGeericModal").empty();
    $("#boddyGeericModal").load("/VentaPublicoGeneral/PartialDeducciones", function () {
        $("#genericModal").modal("show");
    });
}

function Cargar(id) {
    PostMVC('/VentaPublicoGeneral/UpdateCarga', { id: id }, function (r, textStatus, jqXHR) {
        location.reload();
    });
}

function EliminarDeduccion(id) {
    PostMVC('/VentaPublicoGeneral/DeleteDeducciones', { id: id }, function (r, textStatus, jqXHR) {
        location.reload();
    });
}
// Función para capitalizar el tipo de gasto
function formatearTipoGasto(nombreGasto) {
    if (!nombreGasto || typeof nombreGasto !== 'string' || nombreGasto.trim() === '') {
        return "Tipo de gasto no especificado";
    }

    return nombreGasto
        .toLowerCase()
        .split(' ')
        .map(p => p.charAt(0).toUpperCase() + p.slice(1))
        .join(' ');
}

async function ImprimirDeduccion(id) {
    const table = $("#tableDeducciones").DataTable();
    const data = table.rows().data().toArray().find(d => d.id === id);

    if (!data) {
        alert("No se encontró la deducción.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter"
    });

    const empresa = "PLANTA PROCESADORA DE MATERIALES PETREOS SAN MIGUEL, S.A. DE C.V.";
    const ubicacion = "Calimaya, Estado de Mexico";
    const folio = String(data.id).padStart(6, '0');
    const monto = Number(data.monto).toFixed(2);
    const tipoGasto = formatearTipoGasto(data.nombreGasto);
    const concepto = data.descripcion || "Sin concepto";
    const fecha = new Date(data.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-MX', {
        day: '2-digit', month: 'long', year: 'numeric'
    });

    // Definir límites de contenido para el rectángulo
    const margenX = 17.5;
    let topY = 20;
    let bottomY = 150;

    // Dibujar encabezado y contenido
    let y = 30;
    pdf.setFont("times", "bold");
    pdf.setFontSize(16);
    pdf.text("RECIBO DE DINERO", 105, y, { align: "center" });

    y += 15;
    pdf.setFontSize(12);
    pdf.setFont("times", "normal");
    pdf.text(`Recibo No. ${folio}`, 20, y);
    pdf.text(`Bueno por: $${monto}`, 160, y);

    y += 10;
    pdf.setFont("times", "bold");
    pdf.text("Recibi de:", 20, y);
    pdf.setFont("times", "normal");
    pdf.text(empresa, 40, y);

    y += 10;
    pdf.setFont("times", "bold");
    pdf.text("La cantidad de:", 20, y);
    pdf.setFont("times", "normal");
    pdf.text(`$${parseFloat(monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} M.N.`, 50, y);


    y += 10;
    pdf.setFont("times", "bold");
    pdf.text("Tipo de gasto:", 20, y);
    pdf.setFont("times", "normal");
    pdf.text(tipoGasto, 47, y);

    y += 10;
    pdf.setFont("times", "bold");
    pdf.text("Por concepto de:", 20, y);
    pdf.setFont("times", "normal");
    pdf.text(concepto, 52, y);

    y += 10;
    pdf.setFont("times", "italic");
    pdf.text(`${ubicacion} a: ${fechaFormateada}`, 20, y);

    // Calcular altura real del contenido
    bottomY = y + 35;

    // Dibujar el rectángulo con borde alrededor del contenido y firmas
    pdf.setLineWidth(0.35);
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margenX, topY, 180, bottomY - topY);

    // Firmas
    pdf.setLineWidth(0.5);
    y += 25;
    pdf.line(30, y, 80, y); // línea firma nombre
    pdf.line(130, y, 180, y); // línea firma quien recibe

    y += 5;
    pdf.setFontSize(10);
    pdf.setFont("times", "italic");
    pdf.text("Nombre", 50, y);
    pdf.text("Firma de quien recibe", 140, y);

    // Guardar PDF
    pdf.save(`ReciboDeduccion_${folio}.pdf`);

    // Redirigir después
    setTimeout(() => {
        window.location.href = '/VentaPublicoGeneral/Index';
    }, 500);
}
