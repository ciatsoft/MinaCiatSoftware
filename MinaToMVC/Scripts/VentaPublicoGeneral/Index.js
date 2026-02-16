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

    // Función para manejar la búsqueda por nombre
    $('#nombreCliente').on('input', function () {
        const nombreCliente = $(this).val().trim();
        buscarClienteYVehiculos({ nombre: nombreCliente }, 'nombre');
    });

    // Función para manejar la búsqueda por RFID
    $('#rfid').on('input', function () {
        const valorRFID = $(this).val().trim();
        buscarClienteYVehiculos({ rfid: valorRFID }, 'rfid');
    });

    // Función genérica para buscar cliente y vehículos
    function buscarClienteYVehiculos(parametrosBusqueda, tipoBusqueda) {
        const $nombreCliente = $('#nombreCliente');
        const $rfid = $('#rfid');
        const $descripcionVehiculo = $('#descripcionVehiculo');
        const $placa = $('#placa');
        const $cantidadRecibida = $('#cantidadRecibida');
        const $dropdown = $('#vehiculosDropdown');

        // Determinar qué campo estamos buscando
        const urlBusqueda = tipoBusqueda === 'nombre'
            ? '/VentaPublicoGeneral/SearchClienteByNombre'
            : '/VentaPublicoGeneral/SearchClienteByRFID';

        // Limpiar si no hay valor
        if (!Object.values(parametrosBusqueda)[0]) {
            limpiarCamposClienteYVehiculos();
            return;
        }

        $.ajax({
            url: urlBusqueda,
            type: 'GET',
            data: parametrosBusqueda,
            dataType: 'json',
            success: function (respuesta) {
                if (respuesta.IsSuccess && respuesta.Response && Object.keys(respuesta.Response).length > 0) {
                    const cliente = respuesta.Response;

                    // Actualizar campos según el tipo de búsqueda
                    if (tipoBusqueda === 'nombre') {
                        $rfid.val(cliente.rfid || '');
                    } else {
                        $nombreCliente.val(cliente.nombre || '');
                    }

                    // Buscar vehículos del cliente
                    obtenerVehiculosCliente(cliente.id);
                } else {
                    limpiarCamposClienteYVehiculos();
                    $dropdown.empty().append('<option value="">No se encontró cliente</option>');
                }
            },
            error: function () {
                console.error("Error en la solicitud AJAX");
                // No limpiamos campos en error de conexión
            }
        });

        function obtenerVehiculosCliente(idCliente) {
            $.ajax({
                url: '/VentaPublicoGeneral/GetVehiculosPublicoGralByIdCliente',
                type: 'GET',
                data: { id: idCliente },
                dataType: 'json',
                success: function (respuesta2) {
                    $dropdown.empty();

                    if (respuesta2.IsSuccess && respuesta2.Response) {
                        const vehiculosArray = Array.isArray(respuesta2.Response) ?
                            respuesta2.Response : [respuesta2.Response];

                        if (vehiculosArray.length > 0) {
                            $dropdown.append('<option value="">Seleccione un vehículo</option>');

                            vehiculosArray.forEach(vehiculo => {
                                $dropdown.append($('<option></option>')
                                    .val(vehiculo.nombre)
                                    .text(vehiculo.nombre)
                                    .data('placa', vehiculo.placa)
                                    .data('capacidad', vehiculo.capacidad));
                            });

                            // Configurar evento change del dropdown
                            configurarEventoDropdown($dropdown, $descripcionVehiculo, $placa);

                            if (vehiculosArray.length === 1) {
                                $dropdown.val(vehiculosArray[0].nombre).trigger('change');
                            }
                        } else {
                            $dropdown.append('<option value="">No hay vehículos</option>');
                            // Limpiar campos de vehículo pero mantener cliente
                            $descripcionVehiculo.val('');
                            $placa.val('');
                        }
                    } else {
                        $dropdown.append('<option value="">Error al cargar vehículos</option>');
                        $descripcionVehiculo.val('');
                        $placa.val('');
                    }
                },
                error: function () {
                    $dropdown.append('<option value="">Error al cargar vehículos</option>');
                    $descripcionVehiculo.val('');
                    $placa.val('');
                }
            });
        }
    }

    // Función para limpiar campos
    function limpiarCamposClienteYVehiculos() {
        $('#nombreCliente').val('');
        $('#rfid').val('');
        $('#descripcionVehiculo').val('');
        $('#placa').val('');
        $('#cantidadRecibida').val('');
        $('#vehiculosDropdown').empty().append('<option value="">Seleccione un vehículo</option>');
    }

    // Función para configurar evento del dropdown
    function configurarEventoDropdown($dropdown, $descripcionVehiculo, $placa) {
        $dropdown.off('change').on('change', function () {
            const selected = $(this).find('option:selected');
            if (selected.val()) {
                $descripcionVehiculo.val(selected.val());
                $placa.val(selected.data('placa'));
            } else {
                $descripcionVehiculo.val('');
                $placa.val('');
            }
        });
    }

    $("#tablePuntoVenta").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        order: [[0, 'desc']],
        scrollX: true,  // Agrega scroll horizontal
        responsive: true,  // Hace la tabla responsiva
        autoWidth: false,  // Mejor control del ancho de columnas
        columnDefs: [
            { targets: '_all', className: 'dt-body-center dt-head-center' }  // Centra contenido
        ],
        columns: [
            { data: "id", "visible": false, title: "id" },
            { data: "folio", title: "Folio" },
            { data: "nombreTipoMaterial", title: "Material" },
            { data: "nombreUbicacion", title: "Planta" },
            {
                data: "formaDePago",
                "visible": true,
                title: "Forma de Pago",
                render: function (data, type, row) {
                    if (data === "E") {
                        return "Efectivo";
                    }
                    else if (data == "T") {
                        return "Transferencia";
                    }
                    else if (data == "P") {
                        return "Prepago";
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
            { data: "userName", title: "Vendedor" },
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

    //$("#tableDeducciones").DataTable({
    //    processing: true,
    //    destroy: true,
    //    paging: true,
    //    order: [[0, 'desc']],
    //    searching: true,
    //    columns: [
    //        { data: "id", visible: true, title: "Id" },
    //        { data: "nombreGasto", title: "Tipo Gasto" },
    //        { data: "descripcion", title: "Descripcion de la Deduccion" },
    //        { data: "usuarioName", title: "Encargado" },
    //        {
    //            data: "monto",
    //            title: "Monto",
    //            render: function (data) {
    //                return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data);
    //            }
    //        },
    //        {
    //            data: "fecha",
    //            title: "Fecha",
    //            render: function (data) {
    //                return new Date(data).toLocaleDateString('es-MX');
    //            }
    //        },
    //        {
    //            data: "id",
    //            title: "Acciones",
    //            render: function (data) {
    //                return `
    //                <input type="button" value="Cancelar" class="btn btn-custom-cancel" onclick="EliminarDeduccion(${data})" />
    //                 <input type="button" value="Imprimir" class="btn btn-custom-cancel" style="background-color: yellow; border:
    //                 none; color:black;  padding: 7px 10px; border-radius: 5px; cursor: pointer;" onclick="ImprimirDeduccion(${data})" />
    //                 <input type="button" value="Editar" class="btn btn-custom-clean" style="width: 80px;" onclick="AbrirModalDeduccion(${data})" />
    //            `;
    //            }
    //        }
    //    ],
    //    language: {
    //        decimal: ",",
    //        thousands: ".",
    //        processing: "Procesando...",
    //        lengthMenu: "Mostrar _MENU_ entradas",
    //        zeroRecords: "No se encontraron resultados",
    //        emptyTable: "Ningun dato disponible en esta tabla",
    //        info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
    //        infoEmpty: "Mostrando 0 a 0 de 0 entradas",
    //        infoFiltered: "(filtrado de un total de _MAX_ entradas)",
    //        search: "Buscar:",
    //        loadingRecords: "Cargando...",
    //        paginate: {
    //            first: "Primero",
    //            last: "Último",
    //            next: "Siguiente",
    //            previous: "Anterior"
    //        },
    //        aria: {
    //            sortAscending: ": activar para ordenar ascendente",
    //            sortDescending: ": activar para ordenar descendente"
    //        }
    //    }

    //});

    GetAllPV_Ventas();
});

$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmVentaCrud").validate({
        rules: {
            "RFID": {
                required: true
            },
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
            },
            "Cantidad": {
                required: true
            },
            "CantidadRecibida": {
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
        $("#btnGuardar").prop("disabled", true); // Bloquear el botón
    } else {
        $("#cambio").text("Cambio: " + formatMoney(cambio)).css("color", "green");
        $("#btnGuardar").prop("disabled", false); // Asegurarse que el botón esté habilitado
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

    SearchPV_VentasByDate(fecha);
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
                    { data: "descripcion", title: "Descripcion de la Deduccion" },
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
                    emptyTable: "Ningun dato disponible en esta tabla",
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

function SearchPV_VentasByDate(fecha) {
    PostMVC('/VentaPublicoGeneral/SearchPV_VentasByDate', { fecha }, function (r, textStatus, jqXHR) {
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
                scrollX: true,  // Agrega scroll horizontal
                responsive: true,  // Hace la tabla responsiva
                autoWidth: false,  // Mejor control del ancho de columnas
                data: data,
                columnDefs: [
                    { targets: '_all', className: 'dt-body-center dt-head-center' }  // Centra contenido
                ],
                columns: [
                    { data: "id", visible: false, title: "id" },
                    { data: "folio", title: "Folio" },
                    { data: "nombreTipoMaterial", title: "Material" },
                    { data: "nombreUbicacion", title: "Planta" },
                    {
                        data: "formaDePago",
                        visible: true,
                        title: "Forma de Pago",
                        render: function (data) {
                            const tiposPago = { "E": "Efectivo", "T": "Transferencia", "P": "Prepago" };
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
                    { data: "userName", title: "Vendedor" },
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
async function printItem(rowIndex) {
    var table = $('#tablePuntoVenta').DataTable();
    var rowData = table.row(rowIndex).data();

    // Datos comunes del ticket
    var id = rowData.id;
    var folio = rowData.folio;
    var nombrePlanta = rowData.nombreUbicacion;
    var nombreMaterial = rowData.nombreTipoMaterial;
    var formaPago = rowData.formaDePago === 'T' ? 'Transferencia'
        : rowData.formaDePago === 'E' ? 'Efectivo'
            : rowData.formaDePago === 'P' ? 'Prepago'
                : 'Vale';
    var totalPago = parseFloat(rowData.totalPago).toFixed(2);
    var transporte = rowData.transporte;
    var placa = rowData.placa;
    var cantidad = parseFloat(rowData.cantidad).toFixed(2);
    var precioUnidad = parseFloat(rowData.precioUnidad).toFixed(2);
    var vendedor = rowData.userName;

    // LIMPIAR RFID AQUÍ
    var RFID = cleanRfidData(rowData.rfid);

    var nombreCliente = rowData.nombreCliente;
    var fecha = new Date(rowData.fecha).toLocaleString("es-MX");

    // Función para limpiar RFID
    function cleanRfidData(rfidValue) {
        if (!rfidValue) return rfidValue;

        // Eliminar prefijo '1Q' si existe
        if (rfidValue.startsWith('1Q')) {
            return rfidValue.substring(2);
        }

        // Eliminar cualquier otro prefijo común
        const prefixes = ['1Q', '1q', 'IQ', 'iq', 'RF', 'rf'];
        for (let prefix of prefixes) {
            if (rfidValue.startsWith(prefix)) {
                return rfidValue.substring(prefix.length);
            }
        }

        // Si no hay prefijo conocido, eliminar cualquier carácter no hexadecimal al inicio
        return rfidValue.replace(/^[^A-F0-9]+/i, '');
    }

    // Función para enviar datos a Python
    async function enviarAPython(tituloSecundario) {
        const ticketData = {
            Folio: folio,
            NombrePlanta: nombrePlanta,
            NombreMaterial: nombreMaterial,
            FormaPago: formaPago,
            TotalPago: totalPago,
            Transporte: transporte,
            Placa: placa,
            Cantidad: cantidad,
            PrecioUnidad: precioUnidad,
            Vendedor: vendedor,
            RFID: RFID,  // Aquí ya está limpio
            NombreCliente: nombreCliente,
            Fecha: fecha,
            TituloSecundario: tituloSecundario,
            GitTicket: id + folio
        };

        // Mostrar en consola para verificar
        console.log('Datos enviados:', ticketData);

        const response = await fetch(`http://localhost:5000/imprimir-ticket`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData)
        });

        if (!response.ok) {
            Swal.fire({
                icon: 'warning',
                title: 'Error de Configuracion',
                text: 'Por favor verifica la configuracion de la Impresora Termica',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#f27474',
                showCancelButton: false,
                allowOutsideClick: false
            });
        }
    }

    try {
        // Enviar los 2 tickets
        await enviarAPython("Vale de Carga en Planta");
        await enviarAPython("Vale de Salida");
    } catch (err) {
        console.error("Error al enviar a Python:", err);
        Swal.fire({
            icon: 'error',
            title: 'Error al imprimir',
            text: 'El aplicativo de Impresora no esta ejecutandose.',
            confirmButtonText: 'Aceptar'
        });
    }
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

// Modal de Prepago para generar Valera
function AbrirModalPrepago() {
    // Limpiar completamente el modal antes de cargar nuevo contenido
    $("#genericModal").removeData('b s.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Generar Valera para Prepago:");

    $("#boddyGeericModal").load("/VentaPublicoGeneral/PartialPrepago", function () {
        $("#genericModal").modal("show");
    });
}

function AbrirModalDeduccion(id = 0) {
    const titulo = id !== 0 ? "Editar Deducción" : "Nueva Deducción";
    $("#titleGenerciModal").text(titulo);
    $("#boddyGeericModal").html('<p class="text-center">Cargando...</p>');

    // Carga la vista parcial desde el backend
    $("#boddyGeericModal").load(`/VentaPublicoGeneral/PartialDeducciones?id=${id}`, function () {
        $("#genericModal").modal("show");
    });
}

function AbrirModalCanjeo() {
    // Limpiar completamente el modal antes de cargar nuevo contenido
    $("#genericModal").removeData('b s.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Canjear Vale de Prepago:");

    $("#boddyGeericModal").load("/VentaPublicoGeneral/PartialCanjeo", function () {
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

    // Formatear datos
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

    // Crear contenido HTML manteniendo la estructura exacta de tu diseño
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Recibo de Deducción ${folio}</title>
            <style>
                @page {
                    margin: 0;
                    size: letter portrait;
                }
                body {
                    font-family: 'Times New Roman', Times, serif;
                    margin: 0;
                    padding: 20mm;
                    font-size: 12pt;
                    position: relative;
                    width: 216mm;
                    height: 279mm;
                }
                .border-rectangle {
                    position: absolute;
                    top: 20mm;
                    left: 17.5mm;
                    width: 235mm;
                    height: 130mm;
                    border: 0.35mm solid #000000;
                    box-sizing: border-box;
                }
                .header {
                    text-align: center;
                    margin-top: 10mm;
                    margin-bottom: 15mm;
                }
                .header h1 {
                    font-family: 'Times New Roman', Times, serif;
                    font-size: 25pt;
                    font-weight: bold;
                    margin: 0;
                }
                .folio {
                    position: absolute;
                    top: 30mm;
                    left: 20mm;
                    font-size: 16pt;
                    font-family: 'Times New Roman', Times, serif;
                    font-style: normal;
                }
                .monto {
                    position: absolute;
                    top: 30mm;
                    right: 20mm;
                    font-size: 12pt;
                    font-family: 'Times New Roman', Times, serif;
                    font-style: normal;
                    text-align: right;
                }
                .content-line {
                    position: absolute;
                    left: 20mm;
                    font-family: 'Times New Roman', Times, serif;
                }
                .label-bold {
                    font-weight: bold;
                }
                .firma-line {
                    position: absolute;
                    height: 0.5mm;
                    background-color: #000000;
                }
                .firma-text {
                    position: absolute;
                    font-family: 'Times New Roman', Times, serif;
                    font-style: italic;
                    font-size: 10pt;
                    text-align: center;
                }
                .fecha-text {
                    position: absolute;
                    font-family: 'Times New Roman', Times, serif;
                    font-style: italic;
                    font-size: 12pt;
                }
            </style>
        </head>
        <body>
            <!-- Rectángulo de borde -->
            <div class="border-rectangle"></div>

            <!-- Encabezado -->
            <div class="header">
                <h1>RECIBO DE DINERO</h1>
            </div>

            <!-- Folio y Monto -->
            <div class="folio">Recibo No. ${folio}</div>

            <!-- Contenido -->
            <div class="content-line" style="top: 60mm;">
                <span class="label-bold">Recibi de:</span> ${empresa}
            </div>

            <div class="content-line" style="top: 70mm;">
                <span class="label-bold">La cantidad de:</span> $${parseFloat(monto).toLocaleString('es-MX', { minimumFractionDigits: 2 })} M.N.
            </div>

            <div class="content-line" style="top: 80mm;">
                <span class="label-bold">Tipo de gasto:</span> ${tipoGasto}
            </div>

            <div class="content-line" style="top: 90mm;">
                <span class="label-bold">Por concepto de:</span> ${concepto}
            </div>

            <!-- Fecha -->
            <div class="fecha-text" style="top: 100mm; left: 20mm;">
                ${ubicacion} a: ${fechaFormateada}
            </div>

            <!-- Líneas de firma -->
            <div class="firma-line" style="top: 125mm; left: 50mm; width: 50mm;"></div>
            <div class="firma-line" style="top: 125mm; left: 170mm; width: 50mm;"></div>

            <!-- Textos de firma -->
            <div class="firma-text" style="top: 130mm; left: 70mm;">Nombre</div>
            <div class="firma-text" style="top: 130mm; left: 180mm;">Firma de quien recibe</div>
        </body>
        </html>
    `;

    // Enviar al servidor para generar PDF
    try {
        const formData = new FormData();
        formData.append('htmlContent', htmlContent);
        formData.append('fileName', `ReciboDeduccion_${folio}.pdf`);

        const response = await fetch('/Pdf/GenerarReciboDeduccion', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ReciboDeduccion_${folio}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } else {
            throw new Error('Error en la generación del PDF');
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al generar el recibo',
            confirmButtonText: 'Entendido'
        });
    }
}

// Función auxiliar para formatear tipo de gasto
function formatearTipoGasto(tipo) {
    // Mantén tu lógica actual de formateo
    return tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase();
}