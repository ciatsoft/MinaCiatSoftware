$(document).ready(function () {
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
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: null,
                title: 'Nombre Completo',
                render: (data, type, row) => `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`,
                // Agregar campo para ordenamiento por apellido paterno
                type: 'string',
                // Función para extraer el apellido paterno para ordenamiento
                render: function (data, type, row) {
                    if (type === 'sort') {
                        return row.apellidoPaterno; // Para ordenamiento, usar solo apellido paterno
                    }
                    return `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`; // Para display normal
                }
            },
            { data: 'nss', title: 'NSS' },
            { data: 'nombreDepartamento', title: 'Departamento' },
            { data: 'telefono', title: 'Telefono' },
            { data: 'email', title: 'Email', visible: false },
            { data: 'diaNomina', title: 'Dia Nomina', visible: false },
            { data: 'idDepartamento', title: 'IdDepartamento', visible: false },
            { data: 'comentario', title: 'Comentario', visible: false },
            {
                data: 'fechaContratacion',
                title: 'Fecha de Contratación',
                render: function (data) {
                    if (data) {
                        return data.split('T')[0]; // Extrae solo la parte de la fecha
                    }
                    return data;
                }
            },
            {
                data: null, // Accede a TODA la fila 
                title: "Acciones",
                render: function (data, type, row) {

                    var nombreCompleto = `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`; // Aqui se contruye el nombre completo

                    //Agregaremos Nombre aparte del Id SOLO para Eliminar
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarEmpleado(' + row.id + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarEmpleado(' + row.id + ', \'' + nombreCompleto + '\')"/>' + //Aqui se implementa ID y NOMBRECOMPLETO
                        ' <input type="button" value="Salarios" class="btn btn-success btn-lg-custom" onclick="AsignarSalario(' + row.id + ')"/>';
                }
            },
        ],
        // Orden inicial: primero por departamento (columna 3), luego por apellido paterno (columna 1)
        order: [[3, 'asc'], [1, 'asc']],
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

    // Configuración de validación del formulario
    $("#frmEmpleado").validate({
        rules: {
            nombre: "required",
            apellidoPaterno: "required",  // Asegúrate de que coincida con el nombre de la propiedad
            apellidoMaterno: "required",
            telefono: "required",
            email: "required",
            nss: "required",
            diaNomina: "required",
            comentario: "required",
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            apellidoPaterno: "Por favor ingrese el apellido",
            apellidoMaterno: "Por favor ingrese el apellido",
            telefono: "Por favor ingrese el telefono",
            email: "Por favor ingrese el email",
            nss: "Por favor ingrese el Numero de Seguro Social",
            diaNomina: "Por favor ingrese el dia de Nomina",
            comentario: "Por favor ingrese un Comentario"
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

function SaveOrupdateEmpleado() {
    if ($("#frmEmpleado").valid()) {
        // Validación adicional para la categoría
        if ($("#ddlDepartamento").val() === "") {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor seleccione un departamento',
                confirmButtonText: 'Aceptar'
            });
            return false;
        }

        var parametro = {
            id: $("#id").val(),
            nombre: $("#nombre").val(),
            apellidoPaterno: $("#apellidoPaterno").val(),
            apellidoMaterno: $("#apellidoMaterno").val(),
            telefono: $("#telefono").val(),
            email: $("#email").val(),
            nss: $("#nss").val(),
            diaNomina: $("#diaNomina").val(),
            idDepartamento: $("#ddlDepartamento").val(),
            NombreDepartamento: $("#nombreDepartamento").val(),
            comentario: $("#comentario").val(),
            FechaContratacion: $("#fechaContratacion").val(),
            Estatus: $("#estatus").val(),
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val(),
        };

        PostMVC('/Empleado/SaveOrupdateEmpleado', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                Swal.fire({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al guardar los datos: ' + r.ErrorMessage,
                    confirmButtonText: 'Aceptar'
                });
            }
        });
    }
}

function LimpiarFormulario() {
    $("#frmInventario")[0].reset();
    $("#ddlCategoriaInventario").val("").trigger("change");
}

function EditarEmpleado(id) {
    location.href = "/Empleado/AltaEdicion/" + id;
}

function EliminarEmpleado(id, nombreCompleto) {

    //Agregamos funciones para abrir el modal y mandar esos parametros

    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Baja de Empleado");

    // Enviar nombreCompleto como parámetro en la URL
    $("#boddyGeericModal").load("/Empleado/PartialBajaEmpleado/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

document.getElementById("btnGenerarPDF").addEventListener("click", function () {
    generarReportePDF();
});

// Función para generar el reporte PDF
function generarReportePDF() {
    var table = $('#tblEmpleados').DataTable();
    var datos = table.data().toArray();

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

    // Crear tabla HTML manualmente
    var tablaHTML = '<table border="1" cellpadding="5" cellspacing="0" style="width:100%;border-collapse:collapse;">';

    // Encabezados (excluyendo columnas ocultas y de acciones)
    tablaHTML += '<thead><tr>';
    tablaHTML += '<th>Nombre Completo</th>';
    tablaHTML += '<th>NSS</th>';
    tablaHTML += '<th>Departamento</th>';
    tablaHTML += '<th>Telefono</th>';
    tablaHTML += '<th>Fecha de Contratacion</th>';
    tablaHTML += '</tr></thead>';

    // Datos
    tablaHTML += '<tbody>';
    datos.forEach(function (item) {
        tablaHTML += '<tr>';
        // Nombre completo: apellidoPaterno + apellidoMaterno + nombre
        tablaHTML += '<td>' + (item.apellidoPaterno || '') + ' ' +
            (item.apellidoMaterno || '') + ' ' +
            (item.nombre || '') + '</td>';
        tablaHTML += '<td>' + (item.nss || '') + '</td>';
        // Departamento: usar nombreDepartamento en lugar de NombreDepartamento
        tablaHTML += '<td>' + (item.nombreDepartamento || '') + '</td>';
        tablaHTML += '<td>' + (item.telefono || '') + '</td>';
        // Fecha de contratación: extraer solo la parte de la fecha (antes de 'T')
        var fechaContratacion = item.fechaContratacion || '';
        if (fechaContratacion && fechaContratacion.includes('T')) {
            fechaContratacion = fechaContratacion.split('T')[0];
        }
        tablaHTML += '<td>' + fechaContratacion + '</td>';
        tablaHTML += '</tr>';
    });
    tablaHTML += '</tbody></table>';

    // Crear formulario y enviar
    var form = $('<form>', {
        method: 'POST',
        action: '/Pdf/GenerarReporteEmpleados'
    });

    $('<input>').attr({
        type: 'hidden',
        name: 'tablaHTML',
        value: tablaHTML
    }).appendTo(form);

    form.appendTo('body').submit().remove();
}

function AsignarSalario(trabajadorId) {
    $("#titleGenerciModal").text("Asignación de salario");
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

        // Fecha y hora actual en formato ISO (ESTÁNDAR RECOMENDADO)
        var fechaHoraActual = new Date().toISOString();

        var parametros = {
            Id: $("#idRegistro").val(),
            CreatedDt: fechaHoraActual,  // Fecha y hora actual
            UpdatedDt: fechaHoraActual,  // Fecha y hora actual
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
            }
            else {
                alert(r.Message);
            }
        });
    }
    else {
        alert("Faltan datos requeridos.");
    }
}

function CargarTablasalarios() {
    $("#tableSalario").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        //order: [[2, "asc"]],
        columns: [
            { data: "id", "visible": false, title: "Id" },
            {
                data: "fechaInicio", title: "Fecha Inicial", render: function (data) {
                    return formatDate(data);
                }
            },
            {
                data: "fechaFinal", title: "Fecha Termino", render: function (data) {
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

                        return `
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <svg width="16" height="16">
                                    <circle cx="8" cy="8" r="6" fill="${color}" />
                                </svg>
                                <span>${texto}</span>
                            </div>
                        `;
                    }
                    return data;
                }
            },
            {
                data: "id",
                render: function (data, type, row) {
                    // Convertir el objeto row a string JSON seguro para HTML
                    const rowData = encodeURIComponent(JSON.stringify(row));
                    return '<input type="button" value="Editar" class="btn btn-primary" onclick="EditarSalario(' + data + ', \'' + rowData + '\')" />';
                }
            }
        ]
    });
}

function EditarSalario(id, rowData) {
    try {
        // Decodificar y parsear el objeto
        const row = JSON.parse(decodeURIComponent(rowData));
        console.log("Editando registro ID:", id);
        console.log("Datos recibidos:", row);

        // Formatear fechas
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            try {
                return dateStr.split('T')[0];
            } catch {
                return '';
            }
        };

        // Llenar campos
        $('#idRegistro').val(id);
        $('#dtpFI').val(formatDate(row.fechaInicio));
        $('#drpFF').val(formatDate(row.fechaFinal));
        $('#txtMonto').val(row.monto || 0);

        // MANEJO DEL CHECKBOX - VARIAS OPCIONES
        const checkbox = $('#chbEsSalarioActual');

        // Opción 1: La más robusta
        let isChecked = false;

        // Verificar diferentes formatos posibles
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

        // Crear o actualizar campo hidden para el ID
        if ($('#currentEditId').length === 0) {
            $('<input type="hidden" id="currentEditId" />').appendTo('body');
        }
        $('#currentEditId').val(id);

        // Cambiar texto del botón si es necesario
        $('#btnGuardarSalario').val('Actualizar');

        // Ejecutar función onchange si existe
        if (typeof ChanegChebSalariOActual === 'function') {
            setTimeout(() => {
                ChanegChebSalariOActual();
            }, 100);
        }

    } catch (error) {
        alert('Error al cargar los datos para edición: ' + error.message);
    }
}

function GetSalarioByTrabajador() {
    var trabajadorId = $("#txtTrabajadorId").val();
    GetMVC("/Empleado/GetSalarioByTrabajador/" + trabajadorId, function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableSalario", r.Response);
        }
        else {
            alert("Error");
        }
    });
}

document.getElementById("btnDocumentosEmpleado").addEventListener("click", function () {
    var id = $("#id").val();
    AbrirModalDocumentosEmpleado(id);
});

function AbrirModalDocumentosEmpleado(id) {
    $("#genericModal").removeData('b s.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Lista de Documentos");

    $("#boddyGeericModal").load("/Empleado/PartialDocumentosEmpleado/" + id, function () {
        $("#genericModal").modal("show");
    });
}

