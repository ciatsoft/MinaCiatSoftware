$(document).ready(function () {

    $("#ddlTipoCliente2").change(function () {
        var selectedId = $(this).val();

        // Limpiar dropdown de clientes Y direcciones
        $("#ddlCliente").empty().append($('<option></option>')
            .val("")
            .text("Selecciona una opcion")
            .prop('disabled', true)
            .prop('selected', true));

        $("#ddlDireccionesCliente").empty().append($('<option></option>')
            .val("")
            .text("Selecciona una opcion")
            .prop('disabled', true)
            .prop('selected', true));

        ObtenerTipoCliente(selectedId);
    });

    $("#ddlCliente").change(function () {
        var selectedId = $(this).val();
        ObtenerDireccionCliente(selectedId);
    });

    // Inicialización de la tabla de viajes locales con formato
    $("#tblVentasGenerales").dataTable({
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
            { data: "transportista.nombre", title: "Transportista" },
            { data: "vehiculo.placa", title: "Vehiculo" },
            { data: "ubicacionOrigen.nombreUbicacion", title: "Origen" },
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },
            { data: "kilometrosRecorridos", title: "Kilometros Recorridos" },
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

    // Inicialización de la tabla de viajes locales con formato FILTRADO
    $("#tblVentasGeneralesFiltradas").dataTable({
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
            { data: "transportista.nombre", title: "Transportista" },
            { data: "vehiculo.placa", title: "Vehiculo" },
            { data: "ubicacionOrigen.nombreUbicacion", title: "Origen" },
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },
            { data: "kilometrosRecorridos", title: "Kilometros Recorridos" },
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

    GetAllViajeLocal();
});

function GetAllViajeLocal() {
    GetMVC("/Viajes/GetAllViajeLocal", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblVentasGenerales", r.Response);
        } else {
            alert("Error al cargar los viajes: " + r.ErrorMessage);
        }
    });
}

function GetAllViajeLocalByDates(fecha1, fecha2, tipoCliente) {
    if (!fecha1 || !fecha2) {
        alert("Por favor, seleccione una fecha válida.");
        return;
    }

    // Usar GET con parámetros en la URL
    GetMVC(`/Viajes/GetAllViajeLocalByDates?fecha1=${fecha1}&fecha2=${fecha2}&tipoCliente=${tipoCliente}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblVentasGenerales", r.Response);
        } else {
            alert("Error al cargar los viajes: " + r.ErrorMessage);
        }
    });
}
function GetAllViajeLocalByDatesClientDireccion(fecha1, fecha2, clienteId, direccionId) {
    
    // Usar GET con parámetros en la URL
    GetMVC(`/Viajes/GetAllViajeLocalByDatesClientDireccion?fecha1=${fecha1}&fecha2=${fecha2}&idCliente=${clienteId}&idDireccion=${direccionId}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblVentasGeneralesFiltradas", r.Response);
        } else {
            alert("Error al cargar los viajes: " + r.ErrorMessage);
        }
    });
}

function ObtenerTipoCliente(id) {
    var dropdownCliente = $("#ddlCliente");
    var dropdownDireccion = $("#ddlDireccionesCliente");

    // Limpiar ambos dropdowns
    dropdownCliente.empty().append($('<option></option>')
        .val("")
        .text("Selecciona una opcion")
        .prop('disabled', true)
        .prop('selected', true));

    dropdownDireccion.empty().append($('<option></option>')
        .val("")
        .text("Selecciona una opcion")
        .prop('disabled', true)
        .prop('selected', true));

    if (!id) {
        return;
    }

    GetMVC(`/Administracion/GetAllTipoCliente?id=${id}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            if (r.Response && r.Response.length > 0) {
                $.each(r.Response, function (index, cliente) {
                    var texto = `${cliente.nombre}`;
                    var option = $('<option></option>')
                        .val(cliente.id)
                        .text(texto);
                    dropdownCliente.append(option);
                });
            } else {
                dropdownCliente.append($('<option></option>')
                    .val("")
                    .text("No hay clientes disponibles"));
            }
        } else {
            alert("Error al cargar los clientes: " + r.ErrorMessage);
            dropdownCliente.append($('<option></option>')
                .val("")
                .text("Error al cargar clientes"));
        }
    });
}

function ObtenerDireccionCliente(id) {
    var dropdown = $("#ddlDireccionesCliente");

    // Limpiar dropdown completamente
    dropdown.empty();

    // Agregar opción por defecto
    dropdown.append($('<option></option>')
        .val("")
        .text("Selecciona una opcion")
        .prop('disabled', true)
        .prop('selected', true));

    if (!id) {
        return;
    }

    GetMVC(`/Viajes/ObtenerDireccionCliente?id=${id}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            // Verificar si hay direcciones
            if (r.Response && r.Response.length > 0) {
                // Agregar cada dirección como opción
                $.each(r.Response, function (index, direccion) {
                    var texto = `${direccion.calle}, ${direccion.municipio}, ${direccion.estado}`;
                    var option = $('<option></option>')
                        .val(direccion.id)
                        .text(texto);
                    dropdown.append(option);
                });
            } else {
                dropdown.append($('<option></option>')
                    .val("")
                    .text("No hay direcciones disponibles"));
            }
        } else {
            alert("Error al cargar las direcciones del cliente: " + r.ErrorMessage);
            dropdown.append($('<option></option>')
                .val("")
                .text("Error al cargar direcciones"));
        }
    });
}

// Filtro 1

document.getElementById("btnFiltrar1").addEventListener("click", function () {
    var fecha1 = $("#fechaFiltro1").val();
    var fecha2 = $("#fechaFiltro2").val();
    var cliente = $("#ddlTipoCliente1").val();

    // Convertir a objetos Date para comparación
    var date1 = new Date(fecha1);
    var date2 = new Date(fecha2);

    // Validar que ambas fechas tengan valor
    if (!fecha1 || !fecha2) {
        alert("Filtrado inválido: Ambas fechas son requeridas.");
        return;
    }

    // Validar que fecha2 no sea menor que fecha1
    if (date2 < date1) {
        alert("Filtrado invalido: La fecha final no puede ser menor que la fecha inicial.");
        return;
    }

    // Validar que se haya seleccionado un cliente
    if (cliente == null || cliente === "") {
        alert("Filtrado invalido: Por favor selecciona un tipo de cliente.");
        return;
    }

    // CORRECCIÓN PRINCIPAL: Usar la variable correcta 'cliente' en lugar de 'tipoCliente'
    var tipoClienteFiltrado = cliente; // Renombrar para evitar confusión

    if (tipoClienteFiltrado === "0") {
        tipoClienteFiltrado = 'C';
    } else if (tipoClienteFiltrado === "1") {
        tipoClienteFiltrado = 'A';
    }

    // Llamar a la función con los parámetros correctos
    GetAllViajeLocalByDates(fecha1, fecha2, tipoClienteFiltrado);
});

// Filtro 2
document.getElementById("btnFiltrar2").addEventListener("click", function () {
    var fechaInicio = $("#fechaFiltro3").val();
    var fechaFinal = $("#fechaFiltro4").val();
    var clienteId = $("#ddlCliente").val();
    var direccionId = $("#ddlDireccionesCliente").val();

    if (!clienteId) {
        alert("Por favor, seleccione un cliente.");
        return;
    }
    if (!fechaInicio || !fechaFinal) {
        alert("Por favor, seleccione ambas fechas.");
        return;
    }
    if (!direccionId) {
        alert("Por favor, seleccione una direccion.");
        return;
    }
    // Convertir a objetos Date para comparación
    var date1 = new Date(fechaInicio);
    var date2 = new Date(fechaFinal);

    // Validar que fecha2 no sea menor que fecha1
    if (date2 < date1) {
        alert("Filtrado invalido: La fecha final no puede ser menor que la fecha inicial.");
        return;
    }

    GetAllViajeLocalByDatesClientDireccion(fechaInicio, fechaFinal, clienteId, direccionId);
});

// Reportes

document.getElementById("btnGenerarPDFVentasGenerales").addEventListener("click", function () {
    btnGenerarPDFVentasGenerales();
});
document.getElementById("btnVentasGeneralesFiltradas").addEventListener("click", function () {
    btnGenerarPDFVentasGeneralesFiltradas();
});

function btnGenerarPDFVentasGenerales() {
    var table = $('#tblVentasGenerales').DataTable();
    var datos = table.data().toArray();

    // Tomar solo los primeros 30 registros
    var primeros30 = datos.slice(0, 30);

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
                    title: 'Reporte generado',
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
    tablaHTML += '<th>Folio</th>';
    tablaHTML += '<th>Fecha de transporte</th>';
    tablaHTML += '<th>Cliente</th>';
    tablaHTML += '<th>Transportista</th>';
    tablaHTML += '<th>Vehiculo</th>';
    tablaHTML += '<th>Origen</th>';
    tablaHTML += '<th>Material</th>';
    tablaHTML += '<th>Metraje</th>';
    tablaHTML += '<th>Importe</th>';
    tablaHTML += '</tr></thead>';

    // Datos - usar solo los primeros 30 registros
    tablaHTML += '<tbody>';
    primeros30.forEach(function (item) {
        tablaHTML += '<tr>';
        tablaHTML += '<td>' + (item.folio || '') + '</td>';
        tablaHTML += '<td>' + (item.fechaViaje ? (() => {
            const d = new Date(item.fechaViaje);
            return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
        })() : '') + '</td>';
        tablaHTML += '<td>' + (item.cliente.nombre || '') + '</td>';
        tablaHTML += '<td>' + (item.transportista.nombre || '') + '</td>';
        tablaHTML += '<td>' + (item.vehiculo.placa || '') + '</td>';
        tablaHTML += '<td>' + (item.ubicacionOrigen.nombreUbicacion || '') + '</td>';
        tablaHTML += '<td>' + (item.tipoMaterial.nombreTipoMaterial || '') + '</td>';
        tablaHTML += '<td>' + (item.kilometrosRecorridos || '') + '</td>';
        tablaHTML += '<td>' +
            (item.totalImporte
                ? parseFloat(item.totalImporte).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
                : '$0.00'
            ) +
            '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    // Crear formulario y enviar
    var form = $('<form>', {
        method: 'POST',
        action: '/Pdf/GenerarReporteVentasGenerales'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaHTML',
        value: tablaHTML
    }).appendTo(form);

    form.appendTo('body').submit().remove();
}

function btnGenerarPDFVentasGeneralesFiltradas() {
    var table = $('#tblVentasGeneralesFiltradas').DataTable();
    var datos = table.data().toArray();

    // Verificar si la tabla está vacía
    if (datos.length === 0) {
        alert("La tabla esta vacia, no se puede proceder");
        return;
    }

    // Tomar solo los primeros 30 registros
    var primeros30 = datos.slice(0, 30);

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
                    title: 'Reporte generado',
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
    tablaHTML += '<th>Folio</th>';
    tablaHTML += '<th>Fecha de transporte</th>';
    tablaHTML += '<th>Cliente</th>';
    tablaHTML += '<th>Transportista</th>';
    tablaHTML += '<th>Vehiculo</th>';
    tablaHTML += '<th>Origen</th>';
    tablaHTML += '<th>Material</th>';
    tablaHTML += '<th>Metraje</th>';
    tablaHTML += '<th>Importe</th>';
    tablaHTML += '</tr></thead>';

    // Datos - usar solo los primeros 30 registros
    tablaHTML += '<tbody>';
    primeros30.forEach(function (item) {
        tablaHTML += '<tr>';
        tablaHTML += '<td>' + (item.folio || '') + '</td>';
        tablaHTML += '<td>' + (item.fechaViaje ? (() => {
            const d = new Date(item.fechaViaje);
            return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
        })() : '') + '</td>';
        tablaHTML += '<td>' + (item.cliente.nombre || '') + '</td>';
        tablaHTML += '<td>' + (item.transportista.nombre || '') + '</td>';
        tablaHTML += '<td>' + (item.vehiculo.placa || '') + '</td>';
        tablaHTML += '<td>' + (item.ubicacionOrigen.nombreUbicacion || '') + '</td>';
        tablaHTML += '<td>' + (item.tipoMaterial.nombreTipoMaterial || '') + '</td>';
        tablaHTML += '<td>' + (item.kilometrosRecorridos || '') + '</td>';
        tablaHTML += '<td>' +
            (item.totalImporte
                ? parseFloat(item.totalImporte).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
                : '$0.00'
            ) +
            '</td>';

        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    // Crear formulario y enviar
    var form = $('<form>', {
        method: 'POST',
        action: '/Pdf/GenerarReporteVentasGenerales'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaHTML',
        value: tablaHTML
    }).appendTo(form);

    form.appendTo('body').submit().remove();
}