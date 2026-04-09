var idRegistro;

$(document).ready(function () {
    $("#tblDineroCaja").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        responsive: true,
        scrollX: true,
        scrollCollapse: true,
        autoWidth: false,

        columnDefs: [
            {
                targets: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                responsivePriority: 2,
                visible: false
            },
            {
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 20],
                responsivePriority: 1,
            }
        ],

        initComplete: function () {
            this.api().table().container().style.width = '100%';
            this.api().table().container().style.overflowX = 'auto';
        },
        columns: [
            { data: "id", "visible": false, title: "id" },
            {
                data: "ventaVale",
                title: "Venta por Vales",
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
                data: "ventaTransferencia",
                title: "Venta por Transferencia",
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
                data: "ventaEfectivo",
                title: "Venta por Efectivo",
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
                render: function (data) {
                    return `
                        <input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRegistro(${data})" />
                        <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRegistro(${data})" />
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

    GetAllPV_CorteCaja();
});

$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmVentaCrud").validate({
        rules: {
            "Ingreso": { required: true },
            "Egreso": { required: true },
            "Comentario": { required: true },
            "Montototal": { required: true },
            "B500": { required: true },
            "B200": { required: true },
            "B100": { required: true },
            "B50": { required: true },
            "B20": { required: true },
            "M10": { required: true },
            "M5": { required: true },
            "M2": { required: true },
            "M1": { required: true },
            "M050": { required: true }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const drop = document.getElementById("usuarioDrop");
    const createdBy = document.getElementById("createdBy");
    const updatedBy = document.getElementById("updatedBy");
    const usuarioName = document.getElementById("usuarioName");
    const fecha = document.getElementById("fecha");

    function syncValues() {
        const selectedName = drop.options[drop.selectedIndex].text;
        createdBy.value = selectedName;
        updatedBy.value = selectedName;
        usuarioName.value = selectedName;
    }

    if (drop) {
        drop.addEventListener("change", syncValues);
    }
});

function GetAllPV_CorteCaja() {
    GetMVC("/VentaPublicoGeneral/GetAllPV_CorteCaja", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblDineroCaja", r.Response);
            LimpiarFormulario();
        } else {
            alert("Error al cargar las Ventas: " + r.ErrorMessage);
        }
    });
}

function limpiarFormatoMoneda(valor) {
    if (!valor) return "";
    if (typeof valor === 'string') {
        var limpio = valor.replace(/[$]/g, '').replace(/,/g, '').trim();
        return limpio;
    }
    return valor.toString();
}

// Función corregida con los IDs correctos de tu HTML
function EditarRegistro(id) {
    idRegistro = id;
    var table = $("#tblDineroCaja").DataTable();
    var row = table.row(function (idx, data, node) {
        return data.id == id;
    }).data();

    if (row) {
        
        // ID del corte
        $("#txtidcortecaja").val(row.id);

        // Fecha - el ID en tu HTML es "Fecha" (con mayúscula)
        if (row.fecha) {
            var fecha = new Date(row.fecha);
            var fechaFormateada = fecha.toISOString().split('T')[0];
            $("#Fecha").val(fechaFormateada);
        }

        // Dropdowns - estos son los nombres de los campos en tu HTML
        if (row.ventaVale != null) $("#VentaVale").val(row.ventaVale.toString());
        if (row.ventaTransferencia != null) $("#VentaTransferencia").val(row.ventaTransferencia.toString());
        if (row.ventaEfectivo != null) $("#VentaEfectivo").val(row.ventaEfectivo.toString());

        // Campos de texto - estos son los IDs correctos según tu HTML
        if (row.ingreso != null) $("#Ingreso").val(limpiarFormatoMoneda(row.ingreso));
        if (row.egreso != null) $("#Egreso").val(limpiarFormatoMoneda(row.egreso));
        if (row.totalUtilidad != null) $("#TotalUtilidad").val(limpiarFormatoMoneda(row.totalUtilidad));
        if (row.comentarios != null) $("#Comentarios").val(row.comentarios);
        if (row.montoTotal != null) $("#MontoTotal").val(limpiarFormatoMoneda(row.montoTotal));

        // Billetes
        if (row.b1000 != null) $("#B1000").val(row.b1000.toString());
        if (row.b500 != null) $("#B500").val(row.b500.toString());
        if (row.b200 != null) $("#B200").val(row.b200.toString());
        if (row.b100 != null) $("#B100").val(row.b100.toString());
        if (row.b50 != null) $("#B50").val(row.b50.toString());
        if (row.b20 != null) $("#B20").val(row.b20.toString());

        // Monedas
        if (row.m10 != null) $("#M10").val(row.m10.toString());
        if (row.m5 != null) $("#M5").val(row.m5.toString());
        if (row.m2 != null) $("#M2").val(row.m2.toString());
        if (row.m1 != null) $("#M1").val(row.m1.toString());
        if (row.m050 != null) $("#M050").val(row.m050.toString());

        // Campos ocultos
        if (row.estatus != null) $("#Estatus").val(row.estatus);
        if (row.createdBy != null) $("#createdBy").val(row.createdBy);
        if (row.updatedBy != null) $("#updatedBy").val(row.updatedBy);
        if (row.usuarioName != null) $("#usuarioName").val(row.usuarioName);
        if (row.usuario && row.usuario.id) $("#usuarioDrop").val(row.usuario.id);

        // Fechas de auditoría
        if (row.createdDt) {
            var createdDt = new Date(row.createdDt);
            $("#CreatedDt").val(createdDt.toISOString().slice(0, 16));
        }
        if (row.updatedDt) {
            var updatedDt = new Date(row.updatedDt);
            $("#UpdatedDt").val(updatedDt.toISOString().slice(0, 16));
        }

        // Cambiar texto del botón guardar
        $("input[type='submit']").val("Actualizar");

        // Habilitar y configurar botón eliminar
        $("#btnEliminar").prop("disabled", false);
        $("#btnEliminar").attr("onclick", `EliminarRegistro(${row.id})`);

        // Scroll al formulario
        $('html, body').animate({
            scrollTop: $(".rectangulos").offset().top - 100
        }, 500);

        if (typeof toastr !== 'undefined') {
            toastr.success("Registro cargado para editar", "Éxito");
        }

    } else {
        if (typeof toastr !== 'undefined') {
            toastr.error("No se encontró el registro", "Error");
        } else {
            alert("Error: No se encontró el registro");
        }
    }
}

function EliminarRegistro(id) {
    PostMVC('/VentaPublicoGeneral/DeletePV_CorteCaja', { id: id }, function (r, textStatus, jqXHR) {
        location.reload();
    });
}

function LimpiarFormulario() {
    $("#txtidcortecaja").val("0");

    // Limpiar todos los campos del formulario
    $("#Ingreso").val("");
    $("#Egreso").val("");
    $("#Comentarios").val("");
    $("#TotalUtilidad").val("");
    $("#MontoTotal").val("");

    // Resetear dropdowns
    $("#VentaVale").val("");
    $("#VentaTransferencia").val("");
    $("#VentaEfectivo").val("");
    $("#B1000").val("");
    $("#B500").val("");
    $("#B200").val("");
    $("#B100").val("");
    $("#B50").val("");
    $("#B20").val("");
    $("#M10").val("");
    $("#M5").val("");
    $("#M2").val("");
    $("#M1").val("");
    $("#M050").val("");

    // Resetear fecha
    var hoy = new Date();
    $("#Fecha").val(hoy.toISOString().split('T')[0]);

    // Resetear valores por defecto
    $("input[type='submit']").val("Guardar");
    $("#CreatedDt").val(hoy.toISOString().slice(0, 16));
    $("#UpdatedDt").val(hoy.toISOString().slice(0, 16));

    // Deshabilitar botón eliminar
    $("#btnEliminar").prop("disabled", true);
    $("#btnEliminar").attr("onclick", "");
}

// Manejar el envío del formulario
$(document).ready(function () {
    if ($("#frmPrecioMaterial").length) {
        $("#frmPrecioMaterial").on("submit", function (e) {
            var id = idRegistro
            if (id && id !== "0") {
                $(this).attr("action", "/VentaPublicoGeneral/SaveOrUpdatePV_CorteCaja");
                console.log("Enviando actualización para ID:", id);
            } else {
                $(this).attr("action", "/VentaPublicoGeneral/SaveOrUpdatePV_CorteCaja");
                console.log("Enviando nuevo registro");
            }
        });
    }
});