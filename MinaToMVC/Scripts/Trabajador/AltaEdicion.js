$(document).ready(function () {

    // Cargar foto existente si estamos en modo edición
    var empleadoId = $("#id").val();
    if (empleadoId > 0) {
        cargarFotoExistente(empleadoId);
    }

    // Actualizar el TextBox cuando cambie la selección del DropDownList
    $("#ddlDepartamento").change(function () {
        var selectedText = $(this).find("option:selected").text();
        $("#nombreDepartamento").val(selectedText);

        // Si el usuario selecciona "Selecciona una categoria", limpiamos el TextBox
        if ($(this).val() === "") {
            $("#nombreDepartamento").val("");
        }
    });

    // También puedes inicializar el valor si ya hay una selección al cargar la página
    if ($("#ddlDepartamento").val() !== "") {
        var initialText = $("#ddlDepartamento option:selected").text();
        $("#nombreDepartamento").val(initialText);
    }

    // Configuración de DataTable
    $("#tblEmpleados").DataTable({
        data: [],
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: 'id', visible: false, title: 'ID' },
            {
                data: null,
                title: 'Nombre Completo',
                render: (data, type, row) => `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`,
                type: 'string',
                render: function (data, type, row) {
                    if (type === 'sort') {
                        return row.apellidoPaterno;
                    }
                    return `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`;
                }
            },
            { data: 'nss', title: 'NSS' },
            { data: 'nombreDepartamento', title: 'Departamento' },
            { data: 'telefono', title: 'Teléfono' },
            {
                data: 'fechaContratacion',
                title: 'Fecha de Contratación',
                render: function (data) {
                    if (data) {
                        return data.split('T')[0];
                    }
                    return data;
                }
            },
            {
                data: null,
                title: "Acciones",
                render: function (data, type, row) {
                    var nombreCompleto = `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`;
                    return '<button class="btn btn-sm btn-primary" onclick="EditarEmpleado(' + row.id + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarEmpleado(' + row.id + ', \'' + nombreCompleto.replace(/'/g, "\\'") + '\')">' +
                        '<i class="fa fa-trash"></i> Eliminar</button> ' +
                        '<button class="btn btn-sm btn-success" onclick="AsignarSalario(' + row.id + ')">' +
                        '<i class="fa fa-money"></i> Salarios</button>';
                }
            }
        ],
        order: [[3, 'asc'], [1, 'asc']],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": '<i class="fa fa-search"></i> Buscar:',
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i>',
                "last": '<i class="fa fa-fast-forward"></i>',
                "next": '<i class="fa fa-forward"></i>',
                "previous": '<i class="fa fa-backward"></i>'
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    // Configuración de validación del formulario
    $("#frmEmpleado").validate({
        rules: {
            nombre: "required",
            apellidoPaterno: "required",
            apellidoMaterno: "required",
            telefono: "required",
            email: "required",
            nss: "required",
            diaNomina: "required",
            comentario: "required",
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            apellidoPaterno: "Por favor ingrese el apellido paterno",
            apellidoMaterno: "Por favor ingrese el apellido materno",
            telefono: "Por favor ingrese el teléfono",
            email: "Por favor ingrese el email",
            nss: "Por favor ingrese el Número de Seguro Social",
            diaNomina: "Por favor ingrese el día de Nómina",
            comentario: "Por favor ingrese un Comentario"
        }
    });

    $("#btnGuardar").click(function () {
        SaveOrupdateEmpleado();
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
                text: "Error al cargar los empleados: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: 'OK'
            });
        }
    });
}

function cargarFotoExistente(empleadoId) {
    $.ajax({
        url: '/Empleado/ObtenerFotoEmpleado/' + empleadoId,
        type: 'GET',
        success: function (response) {
            if (response.success && response.fotoBase64) {
                $("#preview-image").attr("src", response.fotoBase64);
                $("#preview-container").show();
                $("#no-image-message").hide();
                window.tieneFotoExistente = true;
            }
        },
        error: function () {
            console.log("No se pudo cargar la foto existente");
        }
    });
}

function SaveOrupdateEmpleado() {
    if ($("#frmEmpleado").valid()) {
        // Validación adicional para la categoría
        if ($("#ddlDepartamento").val() === "") {
            swal({
                title: "Error",
                text: "Por favor seleccione un departamento",
                type: "error",
                confirmButtonText: 'OK'
            });
            return false;
        }

        var formData = new FormData();
        var fotoInput = document.getElementById('fotografia');
        var tieneFotoNueva = fotoInput && fotoInput.files && fotoInput.files[0];

        // Crear objeto empleado
        var empleadoData = {
            id: $("#id").val(),
            nombre: $("#nombre").val(),
            apellidoPaterno: $("#apellidoPaterno").val(),
            apellidoMaterno: $("#apellidoMaterno").val(),
            telefono: $("#telefono").val(),
            email: $("#email").val(),
            nss: $("#nss").val(),
            diaNomina: $("#diaNomina").val(),
            idDepartamento: $("#ddlDepartamento").val(),
            nombreDepartamento: $("#nombreDepartamento").val(),
            comentario: $("#comentario").val(),
            fechaContratacion: $("#fechaContratacion").val(),
            estatus: $("#estatus").val(),
            createdBy: $("#createdBy").val(),
            createdDt: $("#createdDt").val(),
            updatedBy: $("#updatedBy").val(),
            updatedDt: $("#updatedDt").val(),
            rutaFoto: "",
            gitFoto: ""
        };

        // Agregar el objeto empleado como JSON
        formData.append('empleadoData', JSON.stringify(empleadoData));

        // Agregar la foto solo si existe una NUEVA
        if (tieneFotoNueva) {
            formData.append('fotoEmpleado', fotoInput.files[0]);
        }

        // Enviar usando AJAX con FormData
        $.ajax({
            url: '/Empleado/SaveOrUpdateTrabajador',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {
                    swal({
                        title: "¡Registro guardado!",
                        text: response.message || "El registro se ha guardado correctamente.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Empleado/AltaEdicion/';
                    });
                } else {
                    swal({
                        title: "Error",
                        text: response.message || "Error al guardar los datos",
                        type: "error",
                        confirmButtonText: 'OK'
                    });
                }
            },
            error: function (xhr, status, error) {
                swal({
                    title: "Error",
                    text: "Error en la solicitud: " + error,
                    type: "error",
                    confirmButtonText: 'OK'
                });
            }
        });
    }
}

function EditarEmpleado(id) {
    location.href = "/Empleado/AltaEdicion/" + id;
}

function EliminarEmpleado(id, nombreCompleto) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();
    $("#titleGenerciModal").html('<span style="color: black;">Baja de Empleado</span>');
    $("#boddyGeericModal").load("/Empleado/PartialBajaEmpleado/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});

document.getElementById("btnGenerarExcel").addEventListener("click", function () {
    generarReporteExcelEmpleados();
});

// Función para generar el reporte PDF
function generarReportePDF() {
    var table = $('#tblEmpleados').DataTable();
    var datos = table.data().toArray();

    swal({
        title: "Generando reporte...",
        text: "Por favor espere mientras se genera el PDF",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    setTimeout(() => {
        swal.close();
        swal({
            title: "¡Reporte generado!",
            text: "El PDF se ha creado correctamente",
            type: "success",
            confirmButtonText: 'OK'
        });
    }, 4000);

    // Crear tabla HTML manualmente
    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    tablaHTML += '<thead><tr>';
    tablaHTML += '<th>Nombre Completo</th>';
    tablaHTML += '<th>NSS</th>';
    tablaHTML += '<th>Departamento</th>';
    tablaHTML += '<th>Teléfono</th>';
    tablaHTML += '<th>Fecha de Contratación</th>';
    tablaHTML += '</tr></thead><tbody>';
    datos.forEach(function (item) {
        tablaHTML += '<tr>';
        tablaHTML += '<td>' + (item.apellidoPaterno || '') + ' ' + (item.apellidoMaterno || '') + ' ' + (item.nombre || '') + '</td>';
        tablaHTML += '<td>' + (item.nss || '') + '</td>';
        tablaHTML += '<td>' + (item.nombreDepartamento || '') + '</td>';
        tablaHTML += '<td>' + (item.telefono || '') + '</td>';
        var fechaContratacion = item.fechaContratacion || '';
        if (fechaContratacion && fechaContratacion.includes('T')) {
            fechaContratacion = fechaContratacion.split('T')[0];
        }
        tablaHTML += '<td>' + fechaContratacion + '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    var form = $('<form>', { method: 'POST', action: '/Pdf/GenerarReporteEmpleados' });
    $('<input>').attr({ type: 'hidden', name: 'tablaHTML', value: tablaHTML }).appendTo(form);
    form.appendTo('body').submit().remove();
}

function generarReporteExcelEmpleados() {
    var table = $('#tblEmpleados').DataTable();
    var datos = table.data().toArray();

    if (datos.length === 0) {
        swal({
            title: "Tabla vacía",
            text: "No hay empleados para generar el reporte",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    swal({
        title: "Generando Excel...",
        text: "Por favor espere mientras se genera el archivo Excel",
        showConfirmButton: false,
        allowOutsideClick: false
    });

    setTimeout(() => {
        swal.close();
        swal({
            title: "¡Excel generado!",
            text: "El archivo Excel se ha creado correctamente",
            type: "success",
            confirmButtonText: 'OK'
        });
    }, 2000);

    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';
    tablaHTML += '<thead><tr>';
    tablaHTML += '<th>Nombre Completo</th>';
    tablaHTML += '<th>NSS</th>';
    tablaHTML += '<th>Departamento</th>';
    tablaHTML += '<th>Teléfono</th>';
    tablaHTML += '<th>Fecha de Contratación</th>';
    tablaHTML += '</tr></thead><tbody>';
    datos.forEach(function (item) {
        tablaHTML += '<tr>';
        var nombreCompleto = (item.apellidoPaterno || '') + ' ' + (item.apellidoMaterno || '') + ' ' + (item.nombre || '');
        tablaHTML += '<td>' + nombreCompleto.trim() + '</td>';
        tablaHTML += '<td>' + (item.nss || '') + '</td>';
        tablaHTML += '<td>' + (item.nombreDepartamento || '') + '</td>';
        tablaHTML += '<td>' + (item.telefono || '') + '</td>';
        var fechaContratacion = item.fechaContratacion || '';
        if (fechaContratacion && fechaContratacion.includes('T')) {
            fechaContratacion = fechaContratacion.split('T')[0];
            var fechaParts = fechaContratacion.split('-');
            if (fechaParts.length === 3) {
                fechaContratacion = fechaParts[2] + '/' + fechaParts[1] + '/' + fechaParts[0];
            }
        }
        tablaHTML += '<td>' + fechaContratacion + '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    var form = $('<form>', { method: 'POST', action: '/Excel/GenerarReporteEmpleados' });
    $('<input>').attr({ type: 'hidden', name: 'tablaHTML', value: tablaHTML }).appendTo(form);
    form.appendTo('body').submit().remove();
}

function AsignarSalario(trabajadorId) {
    $("#titleGenerciModal").html('<span style="color: black;">Asignación de salario</span>');
    $("#boddyGeericModal").empty().load("/Empleado/PartialCrudSalario/" + trabajadorId, function () {
        CargarTablasalarios();
        GetSalarioByTrabajador();
        $("#genericModal").modal("show");
    });
}

function SaveOrUpdateSalario() {
    if ($("#dtpFI").val() != '' && $("#txtMonto").val() != '' && (!$("#chbEsSalarioActual").is(':checked') ? ($("#drpFF").val() != '') : true)) {
        var dateI = new Date($("#dtpFI").val());
        var fi = ((dateI.getDate() > 9) ? dateI.getDate() : ('0' + dateI.getDate())) + '/' + ((dateI.getMonth() > 8) ? (dateI.getMonth() + 1) : ('0' + (dateI.getMonth() + 1))) + '/' + dateI.getFullYear();
        var dateF = new Date($("#drpFF").val());
        var ff = ((dateF.getDate() > 9) ? dateF.getDate() : ('0' + dateF.getDate())) + '/' + ((dateF.getMonth() > 8) ? (dateF.getMonth() + 1) : ('0' + (dateF.getMonth() + 1))) + '/' + dateF.getFullYear();

        var fechaHoraActual = new Date().toISOString();

        var parametros = {
            Id: $("#idRegistro").val(),
            CreatedDt: fechaHoraActual,
            UpdatedDt: fechaHoraActual,
            FechaInicio: fi,
            FechaFinal: ff,
            Monto: $("#txtMonto").val().replace(/[^\d.]/g, ''),
            EsSalarioActual: $("#chbEsSalarioActual").is(':checked'),
            Empleado: {
                Id: $("#txtTrabajadorId").val()
            }
        };

        PostMVC('/Empleado/SaveOrupdateSalario', parametros, function (r) {
            if (r.IsSuccess) {
                $("#genericModal").modal("hide");
            } else {
                swal({
                    title: "Error",
                    text: r.Message || "Error al guardar el salario",
                    type: "error",
                    confirmButtonText: 'OK'
                });
            }
        });
    } else {
        swal({
            title: "Campos incompletos",
            text: "Faltan datos requeridos.",
            type: "warning",
            confirmButtonText: 'OK'
        });
    }
}

function CargarTablasalarios() {
    $("#tableSalario").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            {
                data: "fechaInicio", title: "Fecha Inicial", render: function (data) {
                    return formatDate(data);
                }
            },
            {
                data: "fechaFinal", title: "Fecha Término", render: function (data) {
                    return formatDate(data);
                }
            },
            {
                data: "monto", title: "Monto", render: function (data) {
                    return formatMoney(data);
                }
            },
            {
                data: "esSalarioActual",
                title: "Salario Actual",
                render: function (data, type, row) {
                    if (type === 'display') {
                        const color = data === true || data === 'true' || data === 1 ? 'green' : 'red';
                        const texto = data === true || data === 'true' || data === 1 ? 'Sí' : 'No';
                        return `<div style="display: flex; align-items: center; gap: 8px;">
                                    <svg width="16" height="16"><circle cx="8" cy="8" r="6" fill="${color}" /></svg>
                                    <span>${texto}</span>
                                </div>`;
                    }
                    return data;
                }
            },
            {
                data: "id",
                render: function (data, type, row) {
                    const rowData = encodeURIComponent(JSON.stringify(row));
                    return '<button class="btn btn-sm btn-primary" onclick="EditarSalario(' + data + ', \'' + rowData + '\')">' +
                        '<i class="fa fa-edit"></i> Editar</button>';
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": '<i class="fa fa-search"></i> Buscar:',
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i>',
                "last": '<i class="fa fa-fast-forward"></i>',
                "next": '<i class="fa fa-forward"></i>',
                "previous": '<i class="fa fa-backward"></i>'
            }
        }
    });
}

function EditarSalario(id, rowData) {
    try {
        const row = JSON.parse(decodeURIComponent(rowData));
        console.log("Editando registro ID:", id);

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            try {
                return dateStr.split('T')[0];
            } catch {
                return '';
            }
        };

        $('#idRegistro').val(id);
        $('#dtpFI').val(formatDate(row.fechaInicio));
        $('#drpFF').val(formatDate(row.fechaFinal));
        $('#txtMonto').val(row.monto || 0);

        const checkbox = $('#chbEsSalarioActual');
        let isChecked = false;

        if (row.esSalarioActual !== undefined && row.esSalarioActual !== null) {
            if (typeof row.esSalarioActual === 'boolean') {
                isChecked = row.esSalarioActual;
            } else if (typeof row.esSalarioActual === 'string') {
                isChecked = row.esSalarioActual.toLowerCase() === 'true';
            } else if (typeof row.esSalarioActual === 'number') {
                isChecked = row.esSalarioActual === 1;
            }
        }
        checkbox.prop('checked', isChecked);

        if ($('#currentEditId').length === 0) {
            $('<input type="hidden" id="currentEditId" />').appendTo('body');
        }
        $('#currentEditId').val(id);
        $('#btnGuardarSalario').val('Actualizar');

        if (typeof ChanegChebSalariOActual === 'function') {
            setTimeout(() => {
                ChanegChebSalariOActual();
            }, 100);
        }

    } catch (error) {
        swal({
            title: "Error",
            text: "Error al cargar los datos para edición: " + error.message,
            type: "error",
            confirmButtonText: 'OK'
        });
    }
}

function GetSalarioByTrabajador() {
    var trabajadorId = $("#txtTrabajadorId").val();
    GetMVC("/Empleado/GetSalarioByTrabajador/" + trabajadorId, function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableSalario", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar los salarios",
                type: "error",
                confirmButtonText: 'OK'
            });
        }
    });
}

document.getElementById("btnDocumentosEmpleado").addEventListener("click", function () {
    var id = $("#id").val();
    AbrirModalDocumentosEmpleado(id);
});

function AbrirModalDocumentosEmpleado(id) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();
    $("#titleGenerciModal").html('<span style="color: black;">Lista de Documentos</span>');
    $("#boddyGeericModal").load("/Empleado/PartialDocumentosEmpleado/" + id, function () {
        $("#genericModal").modal("show");
    });
}

// Función para mostrar la vista previa de la imagen seleccionada
document.getElementById('fotografia').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const noImageMessage = document.getElementById('no-image-message');

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
            noImageMessage.style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.style.display = 'none';
        noImageMessage.style.display = 'block';
        noImageMessage.textContent = 'Por favor, selecciona una imagen válida';
        event.target.value = '';
    }
});

// Función para eliminar la foto seleccionada
function eliminarFoto() {
    const previewContainer = document.getElementById('preview-container');
    const previewImage = document.getElementById('preview-image');
    const noImageMessage = document.getElementById('no-image-message');
    const fileInput = document.getElementById('fotografia');

    previewImage.src = '';
    previewContainer.style.display = 'none';
    fileInput.value = '';
    noImageMessage.style.display = 'block';
    noImageMessage.textContent = 'No hay imagen seleccionada';
}