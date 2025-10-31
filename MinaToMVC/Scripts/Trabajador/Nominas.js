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
                data: null,  // Cambiado a null para acceder a toda la fila
                title: "Acciones",
                render: function (data, type, row) {
                    // Construir el nombre completo para pasar como parámetro
                    var nombreCompleto = `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`;

                    return '<input type="button" value="Agregar Concepto" class="btn btn-success btn-lg-custom" onclick="ConceptoEmpleado(' + row.id + ', \'' + nombreCompleto + '\')" />' +
                        ' <input type="button" value="Generar Nomina" class="btn btn-custom-clean" onclick="NominasEmpleado(' + row.id + ', \'' + nombreCompleto + '\')"/>' +
                        ' <input type="button" value="Historial de Nominas" class="btn btn-success btn-lg-custom" onclick="HistorialNominas(' + row.id + ', \'' + nombreCompleto + '\')" />';
                }
            },
        ],
        // Orden inicial: primero por departamento (columna 3), luego por apellido paterno (columna 1)
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
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar el Inventario: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function ConceptoEmpleado(id, nombreCompleto) {
    $("#genericModal").removeData('b s.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Agregar Conceptos");
    $("#boddyGeericModal").load("/RH/PartialConceptosEmpleado/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

function NominasEmpleado(id, nombreCompleto) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Nominas del Empleado");

    // Enviar nombreCompleto como parámetro en la URL
    $("#boddyGeericModal").load("/RH/PartialNominasEmpleado/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

function HistorialNominas(id, nombreCompleto) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Historial de Nominas");

    // Enviar nombreCompleto como parámetro en la URL
    $("#boddyGeericModal").load("/RH/PartialHistorialNominas/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    ReporteConceptos();
});

function ReporteConceptos() {
    var fechaInicio = $("#fechaInicio").val();
    var fechaFin = $("#fechaFin").val();

    // Validar que las fechas no estén vacías
    if (!fechaInicio || !fechaFin) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Por favor, seleccione ambas fechas',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Enviar los parámetros en la URL para método GET
    const url1 = `/RH/GetNomiasReporte?fechaInicio=${fechaInicio}&fechaFinal=${fechaFin}`;
    const url2 = `/RH/GetConceptosReporte?fechaInicio=${fechaInicio}&fechaFinal=${fechaFin}`;

    GetMVC(url1, function (r) {
        if (r.IsSuccess) {
            console.log("Nominas");
            console.log(r.Response);
            GetMVC(url2, function (r2) {
                if (r2.IsSuccess) {
                    console.log("Conceptos Generales");
                    console.log(r2.Response);

                    // Procesar y mostrar en consola los resultados solicitados
                    procesarYMostrarResultados(r.Response, r2.Response);

                    // Generar PDF automáticamente después de procesar
                    generarReportePDFConsolidado(r.Response, r2.Response);

                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Error al cargar los Conceptos Generales: ' + r2.Message,
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las Nominas pagadas: ' + r.Message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function procesarYMostrarResultados(nominas, conceptos) {
    // Función para formatear números como moneda mexicana
    function formatoMoneda(numero) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    console.log("=== RESULTADOS CONSOLIDADOS POR EMPLEADO ===");

    // Objeto para almacenar la información consolidada por empleado
    const empleadosConsolidados = {};

    // Objeto para almacenar la sumatoria total por concepto (sin importar empleado)
    const conceptosAgrupados = {};

    // Procesar nóminas - Sumar SalarioFinal por empleado
    nominas.forEach(nomina => {
        const idTrabajador = nomina.idTrabajador;

        if (!empleadosConsolidados[idTrabajador]) {
            empleadosConsolidados[idTrabajador] = {
                nombreEmpleado: nomina.nombreEmpleado,
                totalSalarioFinal: 0,
                conceptos: {}
            };
        }

        // Sumar salario final
        empleadosConsolidados[idTrabajador].totalSalarioFinal += parseFloat(nomina.salarioFinal) || 0;
    });

    // Procesar conceptos - Sumar cada concepto individual por empleado
    conceptos.forEach(concepto => {
        const idTrabajador = concepto.idTrabajador;
        const nombreConcepto = concepto.nombreConceptoEmpleado;
        const totalNeto = parseFloat(concepto.totalNeto) || (parseFloat(concepto.cantidad) * parseFloat(concepto.valor));

        // Si el empleado no existe en nóminas pero sí en conceptos, lo creamos
        if (!empleadosConsolidados[idTrabajador]) {
            empleadosConsolidados[idTrabajador] = {
                nombreEmpleado: 'Empleado ' + idTrabajador,
                totalSalarioFinal: 0,
                conceptos: {}
            };
        }

        // Sumar cada concepto individual por empleado
        if (!empleadosConsolidados[idTrabajador].conceptos[nombreConcepto]) {
            empleadosConsolidados[idTrabajador].conceptos[nombreConcepto] = 0;
        }
        empleadosConsolidados[idTrabajador].conceptos[nombreConcepto] += totalNeto;

        // Sumar para el agrupamiento total por concepto (sin importar empleado)
        if (!conceptosAgrupados[nombreConcepto]) {
            conceptosAgrupados[nombreConcepto] = 0;
        }
        conceptosAgrupados[nombreConcepto] += totalNeto;
    });

    // Mostrar resultados en consola por empleado
    Object.entries(empleadosConsolidados).forEach(([idTrabajador, empleado]) => {
        console.log(`\n EMPLEADO: ${empleado.nombreEmpleado} (ID: ${idTrabajador})`);
        console.log(` Concepto 1 - Total Salario Final: ${formatoMoneda(empleado.totalSalarioFinal)}`);

        // Mostrar sumatoria de cada concepto individual
        console.log(` Conceptos Individuales:`);
        Object.entries(empleado.conceptos).forEach(([concepto, total]) => {
            console.log(`   • ${concepto}: ${formatoMoneda(total)}`);
        });

        // Mostrar total de conceptos del empleado
        const totalConceptos = Object.values(empleado.conceptos).reduce((sum, total) => sum + total, 0);
        console.log(` Total Conceptos: ${formatoMoneda(totalConceptos)}`);
    });

    // Mostrar sumatoria final por concepto (agrupado sin empleados)
    console.log("\n=== SUMATORIA FINAL POR CONCEPTO ===");
    Object.entries(conceptosAgrupados).forEach(([concepto, total]) => {
        console.log(` ${concepto}: ${formatoMoneda(total)}`);
    });

    // Calcular total general de conceptos agrupados
    const totalConceptosAgrupados = Object.values(conceptosAgrupados).reduce((sum, total) => sum + total, 0);
    console.log(` TOTAL CONCEPTOS AGRUPADOS: ${formatoMoneda(totalConceptosAgrupados)}`);

    // Totales generales
    const totalGeneralSalarios = Object.values(empleadosConsolidados).reduce((sum, emp) => sum + emp.totalSalarioFinal, 0);
    const totalGeneralConceptos = Object.values(empleadosConsolidados).reduce((sum, emp) =>
        sum + Object.values(emp.conceptos).reduce((conceptSum, total) => conceptSum + total, 0), 0
    );

    console.log("\n=== TOTALES GENERALES ===");
    console.log(` Total General Salarios: ${formatoMoneda(totalGeneralSalarios)}`);
    console.log(` Total General Conceptos: ${formatoMoneda(totalGeneralConceptos)}`);
    console.log("==========================");

    // Retornar los datos procesados para usar en el PDF
    return {
        empleadosConsolidados: empleadosConsolidados,
        conceptosAgrupados: conceptosAgrupados,
        totalGeneralSalarios: totalGeneralSalarios,
        totalGeneralConceptos: totalGeneralConceptos
    };
}

function generarReportePDFConsolidado(nominas, conceptos) {
    // Primero procesamos los datos para obtener la estructura consolidada
    const resultados = procesarYMostrarResultados(nominas, conceptos);
    const { empleadosConsolidados, conceptosAgrupados, totalGeneralSalarios, totalGeneralConceptos } = resultados;

    // Función para formatear números como moneda mexicana
    function formatoMoneda(numero) {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numero);
    }

    // Mostrar loading por 3 segundos y luego éxito
    Swal.fire({
        title: "Generando reporte PDF...",
        text: "Por favor espere mientras se genera el documento",
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();

            // Cerrar después de 3 segundos y mostrar éxito
            setTimeout(() => {
                Swal.close();

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Reporte generado',
                    text: 'El PDF se ha creado correctamente',
                    timer: 3000,
                    showConfirmButton: false
                });
            }, 1000);
        }
    });

    // Crear tabla HTML para el reporte principal
    let tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:20px;">';

    // Encabezados
    tablaHTML += '<thead><tr style="background-color:#34495e;color:white;">';
    tablaHTML += '<th style="padding:10px;text-align:center;">Empleado</th>';
    tablaHTML += '<th style="padding:10px;text-align:center;">Total Salario Final</th>';

    // Agregar columnas para cada concepto único
    const todosConceptos = [...new Set(Object.values(empleadosConsolidados).flatMap(emp => Object.keys(emp.conceptos)))];
    todosConceptos.forEach(concepto => {
        tablaHTML += `<th style="padding:10px;text-align:center;">${concepto}</th>`;
    });

    tablaHTML += '<th style="padding:10px;text-align:center;">Total Conceptos</th>';
    tablaHTML += '<th style="padding:10px;text-align:center;">Total General</th>';
    tablaHTML += '</tr></thead>';

    // Datos de empleados
    tablaHTML += '<tbody>';
    Object.entries(empleadosConsolidados).forEach(([idTrabajador, empleado]) => {
        const totalConceptosEmpleado = Object.values(empleado.conceptos).reduce((sum, total) => sum + total, 0);
        const totalGeneralEmpleado = empleado.totalSalarioFinal + totalConceptosEmpleado;

        tablaHTML += '<tr>';
        tablaHTML += `<td style="padding:8px;">${empleado.nombreEmpleado}</td>`;
        tablaHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(empleado.totalSalarioFinal)}</td>`;

        // Datos de conceptos por empleado
        todosConceptos.forEach(concepto => {
            const valorConcepto = empleado.conceptos[concepto] || 0;
            tablaHTML += `<td style="padding:8px;text-align:right;">${valorConcepto > 0 ? formatoMoneda(valorConcepto) : '-'}</td>`;
        });

        tablaHTML += `<td style="padding:8px;text-align:right;">${formatoMoneda(totalConceptosEmpleado)}</td>`;
        tablaHTML += `<td style="padding:8px;text-align:right;font-weight:bold;">${formatoMoneda(totalGeneralEmpleado)}</td>`;
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    // Tabla de conceptos agrupados
    let tablaConceptosHTML = '<div style="margin-top:30px;"><h3 style="color:#2c3e50;">Resumen de Conceptos Agrupados</h3>';
    tablaConceptosHTML += '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:10px;">';
    tablaConceptosHTML += '<thead><tr style="background-color:#2c3e50;color:white;">';
    tablaConceptosHTML += '<th style="padding:10px;text-align:center;">Concepto</th>';
    tablaConceptosHTML += '<th style="padding:10px;text-align:center;">Total General</th>';
    tablaConceptosHTML += '</tr></thead><tbody>';

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

    // Sección de totales generales
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

    // Combinar todo el contenido HTML
    const contenidoCompleto = tablaHTML + tablaConceptosHTML + seccionTotales;

    // Crear formulario y enviar al controlador
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
}