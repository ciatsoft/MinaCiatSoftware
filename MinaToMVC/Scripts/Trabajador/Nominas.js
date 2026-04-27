$(document).ready(function () {
    // Configuración de DataTable
    $("#tblEmpleados").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: null,
                title: 'Nombre Completo',
                render: function (data, type, row) {
                    if (type === 'sort') {
                        return row.apellidoPaterno;
                    }
                    return `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`;
                }
            },
            { data: 'nombreDepartamento', title: 'Departamento' },
            {
                data: null,
                title: "Acciones",
                render: function (data, type, row) {
                    var nombreCompleto = `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`;
                    return '<input type="button" value="Agregar Concepto" class="btn btn-success btn-lg-custom" onclick="ConceptoEmpleado(' + row.id + ', \'' + nombreCompleto + '\')" />' +
                        ' <input type="button" value="Generar Nomina" class="btn btn-custom-clean" onclick="NominasEmpleado(' + row.id + ', \'' + nombreCompleto + '\')"/>' +
                        ' <input type="button" value="Historial de Nominas" class="btn btn-success btn-lg-custom" onclick="HistorialNominas(' + row.id + ', \'' + nombreCompleto + '\')" />';
                }
            },
        ],
        order: [[2, 'asc'], [1, 'asc']],
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

    GetAllEmpleados();
});

function GetAllEmpleados() {
    GetMVC("/Empleado/GetAllEmpleados", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblEmpleados", r.Response);
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

function ConceptoEmpleado(id, nombreCompleto) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").html('<span style="color: black;">Agregar Conceptos</span>');
    $("#boddyGeericModal").load("/RH/PartialConceptosEmpleado/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

function NominasEmpleado(id, nombreCompleto) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").html('<span style="color: black;">Nominas del Empleado</span>');
    $("#boddyGeericModal").load("/RH/PartialNominasEmpleado/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

function HistorialNominas(id, nombreCompleto) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").html('<span style="color: black;">Historial de Nominas</span>');
    $("#boddyGeericModal").load("/RH/PartialHistorialNominas/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    ReporteConceptos('pdf');
});

document.getElementById("btnGenerarExcel").addEventListener("click", function () {
    ReporteConceptos('excel');
});

function ReporteConceptos(tipoReporte = 'pdf') {
    var fechaInicio = $("#fechaInicio").val();
    var fechaFin = $("#fechaFin").val();

    if (!fechaInicio || !fechaFin) {
        swal({
            title: "Advertencia",
            text: "Por favor, seleccione ambas fechas",
            type: "warning",
            confirmButtonText: "Aceptar"
        });
        return;
    }

    const url1 = `/RH/GetNomiasReporte?fechaInicio=${fechaInicio}&fechaFinal=${fechaFin}`;
    const url2 = `/RH/GetConceptosReporte?fechaInicio=${fechaInicio}&fechaFinal=${fechaFin}`;

    GetMVC(url1, function (r) {
        if (r.IsSuccess) {
            GetMVC(url2, function (r2) {
                if (r2.IsSuccess) {
                    const resultados = procesarYMostrarResultados(r.Response, r2.Response);
                    if (tipoReporte.toLowerCase() === 'excel') {
                        generarReporteExcelConsolidado(r.Response, r2.Response);
                    } else {
                        generarReportePDFConsolidado(r.Response, r2.Response);
                    }
                } else {
                    swal({
                        title: "Error",
                        text: "Error al cargar los Conceptos Generales: " + r2.Message,
                        type: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            });
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las Nominas pagadas: " + r.Message,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function procesarYMostrarResultados(nominas, conceptos) {
    function formatoMoneda(numero) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    console.log("=== RESULTADOS CONSOLIDADOS POR EMPLEADO ===");

    const empleadosConsolidados = {};
    const conceptosAgrupados = {};

    nominas.forEach(nomina => {
        const idTrabajador = nomina.idTrabajador;
        if (!empleadosConsolidados[idTrabajador]) {
            empleadosConsolidados[idTrabajador] = {
                nombreEmpleado: nomina.nombreEmpleado,
                totalSalarioFinal: 0,
                conceptos: {}
            };
        }
        empleadosConsolidados[idTrabajador].totalSalarioFinal += parseFloat(nomina.salarioFinal) || 0;
    });

    conceptos.forEach(concepto => {
        const idTrabajador = concepto.idTrabajador;
        const nombreConcepto = concepto.nombreConceptoEmpleado;
        const totalNeto = parseFloat(concepto.totalNeto) || (parseFloat(concepto.cantidad) * parseFloat(concepto.valor));

        if (!empleadosConsolidados[idTrabajador]) {
            empleadosConsolidados[idTrabajador] = {
                nombreEmpleado: 'Empleado ' + idTrabajador,
                totalSalarioFinal: 0,
                conceptos: {}
            };
        }

        if (!empleadosConsolidados[idTrabajador].conceptos[nombreConcepto]) {
            empleadosConsolidados[idTrabajador].conceptos[nombreConcepto] = 0;
        }
        empleadosConsolidados[idTrabajador].conceptos[nombreConcepto] += totalNeto;

        if (!conceptosAgrupados[nombreConcepto]) {
            conceptosAgrupados[nombreConcepto] = 0;
        }
        conceptosAgrupados[nombreConcepto] += totalNeto;
    });

    Object.entries(empleadosConsolidados).forEach(([idTrabajador, empleado]) => {
        console.log(`\n EMPLEADO: ${empleado.nombreEmpleado} (ID: ${idTrabajador})`);
        console.log(` Concepto 1 - Total Salario Final: ${formatoMoneda(empleado.totalSalarioFinal)}`);
        console.log(` Conceptos Individuales:`);
        Object.entries(empleado.conceptos).forEach(([concepto, total]) => {
            console.log(`   • ${concepto}: ${formatoMoneda(total)}`);
        });
        const totalConceptos = Object.values(empleado.conceptos).reduce((sum, total) => sum + total, 0);
        console.log(` Total Conceptos: ${formatoMoneda(totalConceptos)}`);
    });

    console.log("\n=== SUMATORIA FINAL POR CONCEPTO ===");
    Object.entries(conceptosAgrupados).forEach(([concepto, total]) => {
        console.log(` ${concepto}: ${formatoMoneda(total)}`);
    });

    const totalConceptosAgrupados = Object.values(conceptosAgrupados).reduce((sum, total) => sum + total, 0);
    console.log(` TOTAL CONCEPTOS AGRUPADOS: ${formatoMoneda(totalConceptosAgrupados)}`);

    const totalGeneralSalarios = Object.values(empleadosConsolidados).reduce((sum, emp) => sum + emp.totalSalarioFinal, 0);
    const totalGeneralConceptos = Object.values(empleadosConsolidados).reduce((sum, emp) =>
        sum + Object.values(emp.conceptos).reduce((conceptSum, total) => conceptSum + total, 0), 0
    );

    console.log("\n=== TOTALES GENERALES ===");
    console.log(` Total General Salarios: ${formatoMoneda(totalGeneralSalarios)}`);
    console.log(` Total General Conceptos: ${formatoMoneda(totalGeneralConceptos)}`);
    console.log("==========================");

    return {
        empleadosConsolidados: empleadosConsolidados,
        conceptosAgrupados: conceptosAgrupados,
        totalGeneralSalarios: totalGeneralSalarios,
        totalGeneralConceptos: totalGeneralConceptos
    };
}

function generarReportePDFConsolidado(nominas, conceptos) {
    const resultados = procesarYMostrarResultados(nominas, conceptos);
    const { empleadosConsolidados, conceptosAgrupados, totalGeneralSalarios, totalGeneralConceptos } = resultados;

    function formatoMoneda(numero) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    swal({
        title: "Generando reporte PDF...",
        text: "Por favor espere mientras se genera el documento",
        type: "info",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    setTimeout(function () {
        swal.close();

        let tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:20px;">';
        tablaHTML += '<thead><tr style="background-color:#34495e;color:white;">';
        tablaHTML += '<th style="padding:10px;text-align:center;">Empleado</th>';
        tablaHTML += '<th style="padding:10px;text-align:center;">Total Salario Final</th>';

        const todosConceptos = [...new Set(Object.values(empleadosConsolidados).flatMap(emp => Object.keys(emp.conceptos)))];
        todosConceptos.forEach(concepto => {
            tablaHTML += `<th style="padding:10px;text-align:center;">${concepto}</th>`;
        });

        tablaHTML += '<th style="padding:10px;text-align:center;">Total Conceptos</th>';
        tablaHTML += '<th style="padding:10px;text-align:center;">Total General</th>';
        tablaHTML += '</thead><tbody>';

        Object.entries(empleadosConsolidados).forEach(([idTrabajador, empleado]) => {
            const totalConceptosEmpleado = Object.values(empleado.conceptos).reduce((sum, total) => sum + total, 0);
            const totalGeneralEmpleado = empleado.totalSalarioFinal + totalConceptosEmpleado;

            tablaHTML += '<tr>';
            tablaHTML += `<td style="padding:8px;">${empleado.nombreEmpleado}</td>`;
            tablaHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(empleado.totalSalarioFinal)}</td>`;

            todosConceptos.forEach(concepto => {
                const valorConcepto = empleado.conceptos[concepto] || 0;
                tablaHTML += `<td style="padding:8px;text-align:right;">${valorConcepto > 0 ? formatoMoneda(valorConcepto) : '-'}</td>`;
            });

            tablaHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(totalConceptosEmpleado)}</td>`;
            tablaHTML += `<td style="padding:8px;text-align:right;font-weight:bold;">${formatoMoneda(totalGeneralEmpleado)}</td>`;
            tablaHTML += '</tr>';
        });
        tablaHTML += '</tbody></table>';

        let tablaConceptosHTML = '<div style="margin-top:30px;"><h3 style="color:#2c3e50;">Resumen de Conceptos Agrupados</h3>';
        tablaConceptosHTML += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:10px;">';
        tablaConceptosHTML += '<thead><tr style="background-color:#2c3e50;color:white;">';
        tablaConceptosHTML += '<th style="padding:10px;text-align:center;">Concepto</th>';
        tablaConceptosHTML += '<th style="padding:10px;text-align:center;">Total General</th>';
        tablaConceptosHTML += '</thead><tbody>';

        Object.entries(conceptosAgrupados).forEach(([concepto, total]) => {
            tablaConceptosHTML += '<tr>';
            tablaConceptosHTML += `<td style="padding:8px;">${concepto}</td>`;
            tablaConceptosHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(total)}</td>`;
            tablaConceptosHTML += '</tr>';
        });

        const totalConceptosAgrupados = Object.values(conceptosAgrupados).reduce((sum, total) => sum + total, 0);
        tablaConceptosHTML += '<tr style="background-color:#ecf0f1;font-weight:bold;">';
        tablaConceptosHTML += `<td style="padding:8px;">TOTAL CONCEPTOS AGRUPADOS</td>`;
        tablaConceptosHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(totalConceptosAgrupados)}</td>`;
        tablaConceptosHTML += '</tr></tbody></table></div>';

        const seccionTotales = `
        <div style="margin-top:30px; padding:15px; background-color:#f8f9fa; border:2px solid #dee2e6; border-radius:5px;">
            <h3 style="color:#2c3e50; text-align:center; margin-bottom:15px;">TOTALES GENERALES</h3>
            <table style="width:100%; font-size:14px;">
                <tr>
                    <td style="padding:10px; font-weight:bold; width:60%;">Total General Salarios:</td>
                    <td style="padding:10px; text-align:right; font-weight:bold; color:#27ae60;">${formatoMoneda(totalGeneralSalarios)}</td>
                </tr>
                <tr>
                    <td style="padding:10px; font-weight:bold;">Total General Conceptos:</td>
                    <td style="padding:10px; text-align:right; font-weight:bold; color:#2980b9;">${formatoMoneda(totalGeneralConceptos)}</td>
                </tr>
                <tr style="border-top:2px solid #2c3e50;">
                    <td style="padding:10px; font-weight:bold; font-size:16px;">TOTAL GENERAL:</td>
                    <td style="padding:10px; text-align:right; font-weight:bold; color:#c0392b; font-size:16px;">${formatoMoneda(totalGeneralSalarios + totalGeneralConceptos)}</td>
                </tr>
            </table>
        </div>`;

        const contenidoCompleto = tablaHTML + tablaConceptosHTML + seccionTotales;

        var form = $('<form>', {
            method: 'POST',
            action: '/Pdf/GenerarReporteConsolidado'
        });

        $('<input>').attr({
            type: 'hidden',
            name: 'tablaHTML',
            value: contenidoCompleto
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'totalGeneralSalarios',
            value: totalGeneralSalarios
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'totalGeneralConceptos',
            value: totalGeneralConceptos
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'fechaInicio',
            value: $("#fechaInicio").val()
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'fechaFin',
            value: $("#fechaFin").val()
        }).appendTo(form);

        form.appendTo('body').submit().remove();

        swal({
            title: "Reporte generado",
            text: "El PDF se ha creado correctamente",
            type: "success",
            timer: 3000,
            showConfirmButton: false
        });
    }, 1000);
}

function generarReporteExcelConsolidado(nominas, conceptos) {
    const resultados = procesarYMostrarResultados(nominas, conceptos);
    const { empleadosConsolidados, conceptosAgrupados, totalGeneralSalarios, totalGeneralConceptos } = resultados;

    function formatoMoneda(numero) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
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

        let tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:20px;">';
        tablaHTML += '<thead><tr style="background-color:#34495e;color:white;">';
        tablaHTML += '<th style="padding:10px;text-align:center;">Empleado</th>';
        tablaHTML += '<th style="padding:10px;text-align:center;">Total Salario Final</th>';

        const todosConceptos = [...new Set(Object.values(empleadosConsolidados).flatMap(emp => Object.keys(emp.conceptos)))];
        todosConceptos.forEach(concepto => {
            tablaHTML += `<th style="padding:10px;text-align:center;">${concepto}</th>`;
        });

        tablaHTML += '<th style="padding:10px;text-align:center;">Total Conceptos</th>';
        tablaHTML += '<th style="padding:10px;text-align:center;">Total General</th>';
        tablaHTML += '</thead><tbody>';

        Object.entries(empleadosConsolidados).forEach(([idTrabajador, empleado]) => {
            const totalConceptosEmpleado = Object.values(empleado.conceptos).reduce((sum, total) => sum + total, 0);
            const totalGeneralEmpleado = empleado.totalSalarioFinal + totalConceptosEmpleado;

            tablaHTML += '<tr>';
            tablaHTML += `<td style="padding:8px;">${empleado.nombreEmpleado}</td>`;
            tablaHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(empleado.totalSalarioFinal)}</td>`;

            todosConceptos.forEach(concepto => {
                const valorConcepto = empleado.conceptos[concepto] || 0;
                tablaHTML += `<td style="padding:8px;text-align:right;">${valorConcepto > 0 ? formatoMoneda(valorConcepto) : '-'}</td>`;
            });

            tablaHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(totalConceptosEmpleado)}</td>`;
            tablaHTML += `<td style="padding:8px;text-align:right;font-weight:bold;">${formatoMoneda(totalGeneralEmpleado)}</td>`;
            tablaHTML += '</tr>';
        });
        tablaHTML += '</tbody></table>';

        let tablaConceptosHTML = '<div style="margin-top:30px;"><h3 style="color:#2c3e50;">Resumen de Conceptos Agrupados</h3>';
        tablaConceptosHTML += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:10px;">';
        tablaConceptosHTML += '<thead><tr style="background-color:#2c3e50;color:white;">';
        tablaConceptosHTML += '<th style="padding:10px;text-align:center;">Concepto</th>';
        tablaConceptosHTML += '<th style="padding:10px;text-align:center;">Total General</th>';
        tablaConceptosHTML += '</thead><tbody>';

        Object.entries(conceptosAgrupados).forEach(([concepto, total]) => {
            tablaConceptosHTML += '<tr>';
            tablaConceptosHTML += `<td style="padding:8px;">${concepto}</td>`;
            tablaConceptosHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(total)}</td>`;
            tablaConceptosHTML += '</tr>';
        });

        const totalConceptosAgrupados = Object.values(conceptosAgrupados).reduce((sum, total) => sum + total, 0);
        tablaConceptosHTML += '<tr style="background-color:#ecf0f1;font-weight:bold;">';
        tablaConceptosHTML += `<td style="padding:8px;">TOTAL CONCEPTOS AGRUPADOS</td>`;
        tablaConceptosHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(totalConceptosAgrupados)}</td>`;
        tablaConceptosHTML += '</tr></tbody></table></div>';

        const seccionTotales = `
        <div style="margin-top:30px; padding:15px; background-color:#f8f9fa; border:2px solid #dee2e6; border-radius:5px;">
            <h3 style="color:#2c3e50; text-align:center; margin-bottom:15px;">TOTALES GENERALES</h3>
            <table style="width:100%; font-size:14px;">
                <tr>
                    <td style="padding:10px; font-weight:bold; width:60%;">Total General Salarios:</td>
                    <td style="padding:10px; text-align:right; font-weight:bold; color:#27ae60;">${formatoMoneda(totalGeneralSalarios)}</td>
                </tr>
                <tr>
                    <td style="padding:10px; font-weight:bold;">Total General Conceptos:</td>
                    <td style="padding:10px; text-align:right; font-weight:bold; color:#2980b9;">${formatoMoneda(totalGeneralConceptos)}</td>
                </tr>
                <tr style="border-top:2px solid #2c3e50;">
                    <td style="padding:10px; font-weight:bold; font-size:16px;">TOTAL GENERAL:</td>
                    <td style="padding:10px; text-align:right; font-weight:bold; color:#c0392b; font-size:16px;">${formatoMoneda(totalGeneralSalarios + totalGeneralConceptos)}</td>
                </tr>
            </table>
        </div>`;

        const contenidoCompleto = tablaHTML + tablaConceptosHTML + seccionTotales;

        var form = $('<form>', {
            method: 'POST',
            action: '/Excel/GenerarReporteConsolidado'
        });

        $('<input>').attr({
            type: 'hidden',
            name: 'tablaHTML',
            value: contenidoCompleto
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'totalGeneralSalarios',
            value: totalGeneralSalarios
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'totalGeneralConceptos',
            value: totalGeneralConceptos
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'fechaInicio',
            value: $("#fechaInicio").val()
        }).appendTo(form);

        $('<input>').attr({
            type: 'hidden',
            name: 'fechaFin',
            value: $("#fechaFin").val()
        }).appendTo(form);

        form.appendTo('body').submit().remove();

        swal({
            title: "Excel generado",
            text: "El archivo Excel se ha creado correctamente",
            type: "success",
            timer: 3000,
            showConfirmButton: false
        });
    }, 2000);
}