$(document).ready(function () {
    // Declarar dataTable en un alcance global para que sea accesible
    window.dataTable = null;

    function formatCurrencyInput(selector) {
        $(selector).on('input', function () {
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
                    let formatted = '$ ' + num.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    $(this).val(formatted);
                }
            }
        }).on('focus', function () {
            let value = $(this).val().replace(/[^0-9.]/g, '');
            $(this).val(value);
        });
    }

    // Inicializar para ambos campos
    formatCurrencyInput('#ingresotxt, #egresotxt, #totalUtilidadtxt, #montoTotaltxt');

    // Para enviar al servidor
    $('form').on('submit', function (e) {
        $('#ingresotxt, #egresotxt, #totalUtilidadtxt, #montoTotaltxt').each(function () {
            let rawValue = $(this).val().replace(/[^0-9.]/g, '');
            if (rawValue) {
                let num = parseFloat(rawValue);
                if (!isNaN(num)) {
                    $(this).val(num.toFixed(2));
                }
            }
        });
    });

    // Inicializar DataTable
    window.dataTable = $("#tblDineroCaja").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        scrollY: false,
        scrollCollapse: true,
        fixedHeader: true,
        autoWidth: false,
        ajax: {
            url: '/VentaPublicoGeneral/GetAllPV_CorteCaja', // Asegúrate que esta ruta sea correcta
            type: 'GET',
            dataSrc: function (response) {
                // Si tu respuesta tiene una estructura diferente, ajústala aquí
                if (response.IsSuccess) {
                    return response.Response;
                } else {
                    alert("Error al cargar los datos: " + response.ErrorMessage);
                    return [];
                }
            }
        },
        columns: [
            { data: "id", "visible": false, title: "id" },
            { data: "ventaVale", title: "Venta por Vales" },
            { data: "ventaTransferencia", title: "Venta por Transferencia" },
            { data: "ventaEfectivo", title: "Venta por Efectivo" },
            {
                data: "totalUtilidad",
                title: "Total Unidad",
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
                data: "montoTotal",
                title: "Monto Total",
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
                data: "ingreso",
                title: "Ingreso",
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
                data: "egreso",
                title: "Egreso",
                render: function (data, type, row) {
                    if (data == null || data === "") return "$0.00";
                    return parseFloat(data).toLocaleString('es-MX', {
                        style: 'currency',
                        currency: 'MXN',
                        minimumFractionDigits: 2
                    });
                }
            },
            { data: "comentarios", title: "Comentario" },
            { data: "b1000", title: "Billetes de 1000" },
            { data: "b500", title: "Billetes de 500" },
            { data: "b200", title: "Billetes de 200" },
            { data: "b100", title: "Billetes de 100" },
            { data: "b50", title: "Billetes de 50" },
            { data: "b20", title: "Billetes de 20" },
            { data: "m10", title: "Monedas de 10" },
            { data: "m5", title: "Monedas de 5" },
            { data: "m2", title: "Monedas de 2" },
            { data: "m1", title: "Monedas de 1" },
            { data: "m050", title: "Monedas de 0.50c" },
            {
                data: "fecha",
                title: "Fecha",
                render: function (data, type, row) {
                    if (!data) return "";
                    let date = new Date(data);
                    let day = String(date.getDate()).padStart(2, '0');
                    let month = String(date.getMonth() + 1).padStart(2, '0');
                    let year = date.getFullYear();
                    return `${day}/${month}/${year}`;
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data, type, row) {
                    return `
                        <button type="button" class="btn btn-custom-clean btn-editar" data-id="${data}">
                            Editar
                        </button>
                    `;
                }
            }
        ],
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

    // Evento delegado para capturar clics en botones de editar
    // Debe estar dentro del document.ready y usar el selector correcto
    $('#tblDineroCaja').on('click', '.btn-editar', function () {
        // Obtener la fila completa
        let tr = $(this).closest('tr');
        let row = window.dataTable.row(tr);
        let rowData = row.data();

        // Llamar a la función para precargar el formulario
        precargarFormulario(rowData);

        // Opcional: Hacer scroll al formulario
        $('html, body').animate({
            scrollTop: $("#frmPrecioMaterial").offset().top
        }, 500);
    });

    // Función para precargar el formulario
    window.precargarFormulario = function (data) {

        // Precargar el campo ID - VERIFICA ESTE SELECTOR
        $('#txtidcortecaja').val(data.id || 0);

        // Para depuración, verifica si el campo existe
        if ($('#txtidcortecaja').length === 0) {
            // Intenta con otro selector
            $('input[name="idcortecaja"]').val(data.id || 0);
        }

        // También intenta con el selector por nombre
        $('input[name="idcortecaja"]').val(data.id || 0);

        // Precargar campos de fecha
        if (data.fecha) {
            let fecha = new Date(data.fecha);
            let fechaFormateada = fecha.toISOString().split('T')[0];
            $('#Fecha').val(fechaFormateada);
        } else {
            let fechaActual = new Date().toISOString().split('T')[0];
            $('#Fecha').val(fechaActual);
        }

        // Precargar campos de ventas
        $('#VentaVale').val(data.ventaVale || '');
        $('#VentaTransferencia').val(data.ventaTransferencia || '');
        $('#VentaEfectivo').val(data.ventaEfectivo || '');

        // Precargar campos numéricos - Asegurar que sean números
        let ingresoTxt = parseFloat(data.ingreso) || 0;
        let egresoTxt = parseFloat(data.egreso) || 0;
        let totalUtilidadTxt = parseFloat(data.totalUtilidad) || 0;
        let montoTotalTxt = parseFloat(data.montoTotal) || 0;

        // Id
        $('#idtxt').val(data.id);

        // Aplicar formato de moneda
        $('#ingresotxt').val(ingresoTxt.toFixed(2));
        $('#egresotxt').val(egresoTxt.toFixed(2));
        $('#totalUtilidadtxt').val(totalUtilidadTxt.toFixed(2));
        $('#montoTotaltxt').val(montoTotalTxt.toFixed(2));
        $('#Comentarios').val(data.comentarios || '');

        // Precargar campos de billetes y monedas
        $('#B1000').val(data.b1000 || '');
        $('#B500').val(data.b500 || '');
        $('#B200').val(data.b200 || '');
        $('#B100').val(data.b100 || '');
        $('#B50').val(data.b50 || '');
        $('#B20').val(data.b20 || '');
        $('#M10').val(data.m10 || '');
        $('#M5').val(data.m5 || '');
        $('#M2').val(data.m2 || '');
        $('#M1').val(data.m1 || '');
        $('#M050').val(data.m050 || '');

        // Habilitar botón de eliminar si hay un ID
        if (data.id && data.id > 0) {
            $('#btnEliminar').prop('disabled', false);
        } else {
            $('#btnEliminar').prop('disabled', true);
        }

        // Cambiar texto del botón de guardar
        $('input[type="submit"][value="Guardar"]').val('Actualizar');

        // Forzar actualización del formato de moneda
        $('#ingresotxt, #egresotxt, #totalUtilidadtxt, #montoTotaltxt').trigger('blur');
    };

    // Función para limpiar el formulario
    window.limpiarFormulario = function () {

        // Limpiar campos ocultos
        $('#txtidcortecaja').val('0');

        // Restablecer fecha actual
        let fechaActual = new Date().toISOString().split('T')[0];
        $('#Fecha').val(fechaActual);

        // Limpiar selects
        $('#VentaVale').val('');
        $('#VentaTransferencia').val('');
        $('#VentaEfectivo').val('');
        $('#B1000').val('');
        $('#B500').val('');
        $('#B200').val('');
        $('#B100').val('');
        $('#B50').val('');
        $('#B20').val('');
        $('#M10').val('');
        $('#M5').val('');
        $('#M2').val('');
        $('#M1').val('');
        $('#M050').val('');

        // Limpiar campos de texto
        $('#ingresotxt').val('0.00');
        $('#egresotxt').val('0.00');
        $('#totalUtilidadtxt').val('0.00');
        $('#montoTotaltxt').val('0.00');
        $('#Comentarios').val('');

        // Deshabilitar botón de eliminar
        $('#btnEliminar').prop('disabled', true);

        // Cambiar texto del botón de guardar
        $('input[type="submit"][value="Actualizar"]').val('Guardar');

        console.log("Formulario limpiado exitosamente");
    };

    // Evento para el botón Cancelar
    $('.btn-custom-cancel').click(function (e) {
        window.location.href = "/VentaPublicoGeneral/DineroCaja";
    });

    $('#btnEliminar').click(function () {
        var id = $('#idtxt').val();

        PostMVC('/VentaPublicoGeneral/DeletePV_CorteCaja', { id: parseInt(id) }, function (r) {
            if (r.IsSuccess) {
                Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success')
                    .then(() => window.location.href = '/VentaPublicoGeneral/DineroCaja');
            } else {
                Swal.fire('Error', 'No se pudo eliminar: ' + r.ErrorMessage, 'error');
            }
        });
    });
});

// Configuración de validación (mantener fuera si es necesario)
$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmVentaCrud").validate({
        rules: {
            "Ingreso": {
                required: true
            },
            "Egreso": {
                required: true
            },
            "Comentario": {
                required: true
            },
            "Montototal": {
                required: true
            },
            "B500": {
                required: true
            },
            "B200": {
                required: true
            },
            "B100": {
                required: true
            },
            "B50": {
                required: true
            },
            "B20": {
                required: true
            },
            "M10": {
                required: true
            },
            "M5": {
                required: true
            },
            "M2": {
                required: true
            },
            "M1": {
                required: true
            },
            "M050": {
                required: true
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const drop = document.getElementById("usuarioDrop");
    const createdBy = document.getElementById("createdBy");
    const updatedBy = document.getElementById("updatedBy");
    const usuarioName = document.getElementById("usuarioName");

    function syncValues() {
        if (drop) {
            const selectedName = drop.options[drop.selectedIndex].text;
            if (createdBy) createdBy.value = selectedName;
            if (updatedBy) updatedBy.value = selectedName;
            if (usuarioName) usuarioName.value = selectedName;
        }
    }

    if (drop) {
        drop.addEventListener('change', syncValues);
        // Sincronizar valores iniciales
        syncValues();
    }
});

// Si necesitas mantener la función GetAllPV_CorteCaja para otras cosas
function GetAllPV_CorteCaja() {
    GetMVC("/VentaPublicoGeneral/GetAllPV_CorteCaja", function (r) {
        if (r.IsSuccess) {
            // Ya no necesitas MapingPropertiesDataTable porque DataTable maneja los datos
            console.log("Datos cargados:", r.Response);
        } else {
            alert("Error al cargar las Ventas: " + r.ErrorMessage);
        }
    });
}