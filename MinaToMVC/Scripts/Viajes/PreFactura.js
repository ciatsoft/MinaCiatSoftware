$(document).ready(function () {

    $("#tblPreFactura").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "folio", "visible": true, title: "Folio" },
            {
                data: "fechaViaje",
                title: "Fecha de transporte",
                render: function (data, type, row) {
                    if (data) {
                        var date = new Date(data);
                        var day = ("0" + date.getDate()).slice(-2);
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    }
                    return "";
                }
            },
            { data: "cliente.nombre", title: "Cliente" },
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },
            {
                data: "facturado",
                title: "Facturado",
                orderable: false,
                render: function (data, type, row) {
                    var isChecked = data === true || data === 1 || data === '1' || data === 'true';
                    return '<input type="checkbox" class="completado-checkbox" ' +
                        (isChecked ? 'checked' : '') +
                        ' data-id="' + row.id + '">';
                }
            },
            {
                data: "totalImporte",
                title: "Importe",
                render: function (data, type, row) {
                    if (data == null || data === "") return "$0.00";
                    return data.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                }
            }
        ],
        order: [0, 'desc'],
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

    // Event handler para capturar los cambios en los checkboxes
    $(document).on('change', '.completado-checkbox', function () {
        var id = $(this).data('id');
        var isChecked = $(this).is(':checked');

        console.log('Checkbox cambiado - ID:', id, 'Completado:', isChecked);

        guardarEstadoCheckbox(id, isChecked);
    });

    function guardarEstadoCheckbox(id, facturado) {
        $.ajax({
            url: '/Viajes/CheckPreFactura',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: id,
                facturado: facturado
            }),
            success: function (response) {
                console.log('Estado guardado correctamente');
            },
            error: function (xhr, status, error) {
                console.error('Error al guardar estado:', error);
            }
        });
    }
});

document.getElementById("btnFiltrar2").addEventListener("click", function () {
    var fecha1 = $("#fechaFiltro1").val();
    var fecha2 = $("#fechaFiltro2").val();
    if (!fecha1 || !fecha2) {
        swal("Error", "Por favor, seleccione una fecha válida.", "error");
        return;
    }
    var date1 = new Date(fecha1);
    var date2 = new Date(fecha2);

    if (date2 < date1) {
        swal("Error en fechas", "Filtrado invalido: La fecha final no puede ser menor que la fecha inicial.", "error");
        return;
    }
    GetAllViajeLocalByDatesFacturado(fecha1, fecha2);
});

function GetAllViajeLocalByDatesFacturado(fecha1, fecha2) {
    GetMVC(`/Viajes/GetAllViajeLocalByDatesFacturado?fecha1=${fecha1}&fecha2=${fecha2}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            console.log(r.Response);
            MapingPropertiesDataTable("tblPreFactura", r.Response);
        } else {
            swal("Error", "Error al cargar los viajes: " + r.ErrorMessage, "error");
        }
    });
}

document.getElementById("btnPreFacturaNoFacturados").addEventListener("click", function () {
    var fecha1 = $("#fechaFiltro1").val();
    var fecha2 = $("#fechaFiltro2").val();
    if (!fecha1 || !fecha2) {
        swal("Error", "Por favor, seleccione una fecha válida.", "error");
        return;
    }
    var date1 = new Date(fecha1);
    var date2 = new Date(fecha2);

    if (date2 < date1) {
        swal("Error", "Filtrado invalido: La fecha final no puede ser menor que la fecha inicial.", "error");
        return;
    }

    GetMVC(`/Viajes/GetAllViajeLocalByDatesFacturado?fecha1=${fecha1}&fecha2=${fecha2}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            const datosFiltrados = r.Response.filter(item => item.facturado === false || item.facturado === 0);
            GenerarPDFPreFacturas(datosFiltrados, 0);
        } else {
            swal("Error", "Error al cargar los viajes: " + r.ErrorMessage, "error");
        }
    });
});

document.getElementById("btnPreFacturaSiFacturados").addEventListener("click", function () {
    var fecha1 = $("#fechaFiltro1").val();
    var fecha2 = $("#fechaFiltro2").val();
    if (!fecha1 || !fecha2) {
        swal("Error", "Por favor, seleccione una fecha válida.", "error");
        return;
    }
    var date1 = new Date(fecha1);
    var date2 = new Date(fecha2);

    if (date2 < date1) {
        swal("Error", "Filtrado invalido: La fecha final no puede ser menor que la fecha inicial.", "error");
        return;
    }

    GetMVC(`/Viajes/GetAllViajeLocalByDatesFacturado?fecha1=${fecha1}&fecha2=${fecha2}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            const datosFiltrados = r.Response.filter(item => item.facturado === true || item.facturado === 1);
            GenerarPDFPreFacturas(datosFiltrados, 1);
        } else {
            swal("Error", "Error al cargar los viajes: " + r.ErrorMessage, "error");
        }
    });
});

function GenerarPDFPreFacturas(data, bandera) {
    if (bandera == 1) {
        if (data.length === 0) {
            swal("Sin datos", "No existen vales facturados", "warning");
            return;
        }
    } else if (bandera == 0) {
        if (data.length === 0) {
            swal("Sin datos", "No existen vales pendientes", "warning");
            return;
        }
    }

    var sumatoriaTotal = 0;
    data.forEach(function (item) {
        if (item.totalImporte) {
            sumatoriaTotal += parseFloat(item.totalImporte);
        }
    });

    // Mostrar loading
    swal({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    tablaHTML += '<thead><tr>';
    tablaHTML += '<th>Folio</th>';
    tablaHTML += '<th>Fecha de transporte</th>';
    tablaHTML += '<th>Cliente</th>';
    tablaHTML += '<th>Material</th>';
    tablaHTML += '<th>Importe</th>';
    tablaHTML += '</tr></thead><tbody>';

    data.forEach(function (item) {
        tablaHTML += '<tr>';
        tablaHTML += '<td>' + (item.folio || '') + '</td>';
        tablaHTML += '<td>' + (item.fechaViaje ? (() => {
            const d = new Date(item.fechaViaje);
            return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
        })() : '') + '</td>';
        tablaHTML += '<td>' + (item.cliente.nombre || '') + '</td>';
        tablaHTML += '<td>' + (item.tipoMaterial.nombreTipoMaterial || '') + '</td>';
        tablaHTML += '<td>' + (item.totalImporte ? parseFloat(item.totalImporte).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) : '$0.00') + '</td>';
        tablaHTML += '</tr>';
    });

    tablaHTML += '<tr style="font-weight: bold; background-color: #f0f0f0;">';
    tablaHTML += '<td colspan="4" style="text-align: right;">TOTAL:</td>';
    tablaHTML += '<td>' + sumatoriaTotal.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) + '</td>';
    tablaHTML += '</tr>';
    tablaHTML += '</tbody></table>';

    var endpoint = bandera === 1 ? '/Pdf/GenerarPDFPreFacturas1' : '/Pdf/GenerarPDFPreFacturas2';

    var form = $('<form>', {
        method: 'POST',
        action: endpoint
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaHTML',
        value: tablaHTML
    }).appendTo(form);

    form.appendTo('body').submit().remove();

    // Cerrar el loading después de enviar
    setTimeout(() => {
        swal.close();
        swal("Éxito", "El PDF se ha generado correctamente", "success");
    }, 2000);
}

document.getElementById("btnExcelNoFacturados").addEventListener("click", function () {
    generarExcel(0);
});

document.getElementById("btnExcelSiFacturados").addEventListener("click", function () {
    generarExcel(1);
});

function generarExcel(bandera) {
    var fecha1 = $("#fechaFiltro1").val();
    var fecha2 = $("#fechaFiltro2").val();

    if (!fecha1 || !fecha2) {
        swal("Error", "Por favor, seleccione ambas fechas.", "error");
        return;
    }

    var date1 = new Date(fecha1);
    var date2 = new Date(fecha2);

    if (date2 < date1) {
        swal("Error", "La fecha final no puede ser menor que la fecha inicial.", "error");
        return;
    }

    GetMVC(`/Viajes/GetAllViajeLocalByDatesFacturado?fecha1=${fecha1}&fecha2=${fecha2}`, function (r) {
        if (r.IsSuccess) {
            var datosFiltrados;
            var titulo;

            if (bandera === 1) {
                datosFiltrados = r.Response.filter(item => item.facturado === true || item.facturado === 1);
                titulo = "FACTURADOS";
            } else {
                datosFiltrados = r.Response.filter(item => item.facturado === false || item.facturado === 0);
                titulo = "NO FACTURADOS";
            }

            if (datosFiltrados.length === 0) {
                swal("Sin datos", `No existen vales ${titulo.toLowerCase()} para el periodo seleccionado.`, "warning");
                return;
            }

            crearYEnviarExcel(datosFiltrados, titulo, fecha1, fecha2);
        } else {
            swal("Error", "Error al cargar los viajes: " + r.ErrorMessage, "error");
        }
    });
}

function crearYEnviarExcel(datos, titulo, fechaInicio, fechaFin) {
    var total = 0;
    datos.forEach(function (item) {
        if (item.totalImporte) {
            total += parseFloat(item.totalImporte);
        }
    });

    swal({
        title: "Generando Excel...",
        text: "Por favor espere",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    tablaHTML += '<thead><tr>';
    tablaHTML += '<th>Folio</th>';
    tablaHTML += '<th>Fecha de transporte</th>';
    tablaHTML += '<th>Cliente</th>';
    tablaHTML += '<th>Material</th>';
    tablaHTML += '<th>Importe</th>';
    tablaHTML += '</tr></thead><tbody>';

    datos.forEach(function (item) {
        tablaHTML += '<tr>';
        tablaHTML += '<td>' + (item.folio || '') + '</td>';

        var fechaFormateada = '';
        if (item.fechaViaje) {
            var d = new Date(item.fechaViaje);
            fechaFormateada = d.getDate().toString().padStart(2, '0') + '-' +
                (d.getMonth() + 1).toString().padStart(2, '0') + '-' +
                d.getFullYear();
        }
        tablaHTML += '<td>' + fechaFormateada + '</td>';
        tablaHTML += '<td>' + (item.cliente ? item.cliente.nombre || '' : '') + '</td>';
        tablaHTML += '<td>' + (item.tipoMaterial ? item.tipoMaterial.nombreTipoMaterial || '' : '') + '</td>';
        tablaHTML += '<td>' + (item.totalImporte ? parseFloat(item.totalImporte).toFixed(2) : '0.00') + '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    var endpoint = (titulo === "FACTURADOS") ? '/Excel/GenerarExcelPreFacturas1' : '/Excel/GenerarExcelPreFacturas2';

    var form = document.createElement('form');
    form.method = 'POST';
    form.action = endpoint;
    form.style.display = 'none';

    function agregarCampo(nombre, valor) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = nombre;
        input.value = valor;
        form.appendChild(input);
    }

    agregarCampo('tablaHTML', tablaHTML);
    agregarCampo('titulo', titulo);
    agregarCampo('fechaInicio', fechaInicio);
    agregarCampo('fechaFin', fechaFin);
    agregarCampo('total', total.toFixed(2));

    var token = document.querySelector('input[name="__RequestVerificationToken"]');
    if (token) {
        var tokenInput = document.createElement('input');
        tokenInput.type = 'hidden';
        tokenInput.name = '__RequestVerificationToken';
        tokenInput.value = token.value;
        form.appendChild(tokenInput);
    }

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setTimeout(() => {
        swal.close();
        swal("Éxito", "El archivo Excel se está descargando", "success");
    }, 1500);
}