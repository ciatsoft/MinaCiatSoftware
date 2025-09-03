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
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarEmpleado(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarEmpleado(' + data + ')"/>';
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

function EliminarEmpleado(id) {
    Swal.fire({
        title: '¿Estas seguro?',
        text: "¿Desea eliminar el siguiente registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/Empleado/DeleteEmpleadoById', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El Empleado ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                } else {
                    Swal.fire('Eliminado', 'El Empleado ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                }
            });
        }
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



//$(function () {
//    jQuery.validator.addMethod("lettersonly", function (value, element) {
//        return this.optional(element) || /^[a-z\s]+$/i.test(value);
//    }, "Only alphabetical characters");

//    $("#frmTrabajador").validate({
//        rules: {
//            "txtNombre": {
//                lettersonly: true,
//                required: true
//            },
//            "txtEmail": {
//                email: true,
//                required: true
//            },
//            "txtTelefono": "required",
//            "dtpFechaContratacion": "required",
//            "txtSeguro": {
//                digits: true,
//                required: true
//            }
//        },
//        messages: {
//            "txtNombre": {
//                required: "El campo 'Nombre' es requerido.",
//                lettersonly: "Este campo no acepta valores númericos."
//            },
//            "txtSeguro": {
//                required: "El campo 'NSS' es requerido.",
//                digits: "Este campo solo acepta números."
//            }
//        }
//    });
//});

//$(document).ready(function () {
//    $("#imgAddSalario").on("click", function () {
//        $("#boddyGeericModal").empty().load("/Empleado/PartialCrudSalario", function () {
//            $("#tableSalario").dataTable({
//                processing: true,
//                destroy: true,
//                paging: true,
//                searching: true,
//                //order: [[2, "asc"]],
//                columns: [
//                    { data: "id", "visible": false, title: "Id" },
//                    {
//                        data: "fechaInicio", title: "Fecha Inicial", render: function (data) {
//                            return formatDate(data);
//                        }
//                    },
//                    { data: "fechaFinal", title: "Fecha Termino" },
//                    {
//                        data: "monto", title: "Monto", render: function (data) {
//                            return formatMoney(data);
//                        }
//                    },
//                    { data: "esSalarioActual", title: "Salario Actual" },
//                    {
//                        data: "id", render: function (data) {
//                            return '<input type="button" value="Editar" class="btn btn-primary" onclick="EditarTrabajador(' + data + ')" />';
//                        }
//                    }
//                ]
//            });

//            $("#titleGenerciModal").text('Salarios del trabajador');
//            $('#genericModal').modal('show');
//        });

//        GetSalarioByTrabajador();
//    });

//    $("#tblEmpleados").dataTable({
//        processing: true,
//        destroy: true,
//        paging: true,
//        searching: true,
//        //order: [[2, "asc"]],
//        columns: [
//            { data: "id", "visible": false, title: "Id" },
//            { data: "nombre", title: "Nombre" },
//            { data: "email", title: "Email" },
//            { data: "telefono", title: "Teléfono" },
//            { data: "seguro", title: "NSS" },
//            { data: "areadeTrabajo.nombre", title: "Area de Trabajo" },
//            { data: "roles.nombre", title: "Rol" },
//            {
//                data: "turno", title: "Turno", render: function (data) {
//                    var turnoString = "";
//                    switch (data) {
//                        case "M":
//                            turnoString = "Matutino";
//                            break;
//                        case "V":
//                            turnoString = "Vespertino";
//                            break;
//                        case "N":
//                            turnoString = "Nocturno";
//                            break;
//                    }

//                    return turnoString;
//                }
//            },
//            {
//                data: "id", render: function (data) {
//                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarTrabajador(' + data + ')" />';
//                }
//            }
//        ],
//        language: {
//            "decimal": ",",
//            "thousands": ".",
//            "processing": "Procesando...",
//            "lengthMenu": "Mostrar _MENU_ entradas",
//            "zeroRecords": "No se encontraron resultados",
//            "emptyTable": "Ningún dato disponible en esta tabla",
//            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
//            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
//            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
//            "search": "Buscar:",
//            "loadingRecords": "Cargando...",
//            "paginate": {
//                "first": "Primero",
//                "last": "Último",
//                "next": "Siguiente",
//                "previous": "Anterior"
//            },
//            "aria": {
//                "sortAscending": ": activar para ordenar la columna de manera ascendente",
//                "sortDescending": ": activar para ordenar la columna de manera descendente"
//            }
//        }
//    });

//    GetAllTrabajadores();

//    if (trabajadorJson.Id != 0) {
//        $("#txtTrabajadorId").val(trabajadorJson.Id);
//        $("#txtNombre").val(trabajadorJson.Nombre);
//        $("#txtEmail").val(trabajadorJson.Email);
//        $("#txtTelefono").val(trabajadorJson.Telefono);
//        $("#ddlAreaTrabajo").val(trabajadorJson.AreadeTrabajo.Id);
//        $("#ddlRoll").val(trabajadorJson.Roles.Id);
//        $("#txtSeguro").val(trabajadorJson.Seguro);
//        $("#dtpFechaContratacion").val(trabajadorJson.FechaContratacion.substring(0, 10));
//        $("#ddlTurno").val(trabajadorJson.Turno);
//        $("#chbEstatus").prop('checked', trabajadorJson.Estatus);

//        GetSalarioActualTrabajador();
//        $("#btnEliminar").show();
//        $("#btnGuardar").show();
//    }
//    else {
//        $("#imgAddSalario").hide();
//        $("#btnEliminar").hide();
//        $("#btnGuardar").show();
//    }
//});

//function GetAllTrabajadores() {
//    GetMVC("/Empleado/GetAllTrabajadores", function (r) {
//        if (r.IsSuccess) {
//            MapingPropertiesDataTable("tblEmpleados", r.Response);
//        }
//        else { 
//            alert("Error: " + r.Message);
//        }
//    });
//}

//function SaveOrupdateTrabajador() {
//    if ($("#frmTrabajador").valid()) {
//        var date = new Date($("#dtpFechaContratacion").val());
//        var fc = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
//        var parametro = {
//            Id: $("#txtTrabajadorId").val(),
//            Nombre: $("#txtNombre").val(),
//            Email: $("#txtEmail").val(),
//            Telefono: $("#txtTelefono").val(),
//            AreadeTrabajo: {
//                Id: $("#ddlAreaTrabajo").val()
//            },
//            Roles: {
//                Id: $("#ddlRoll").val()
//            },
//            FechaContratacion: fc,
//            Seguro: $("#txtSeguro").val(),
//            Turno: $("#ddlTurno").val(),
//            Estatus: $("#chbEstatus").is(':checked'),
//            CreatedBy: $("#txtCreatedBy").val(),
//            CreatedDt: $("#txtCreatedDt").val()
//        };

//        PostMVC('/Empleado/SaveOrupdateTrabajador', parametro, function (r) {
//            if (r.IsSuccess) {
//                location.href = "/Empleado/AltaEdicion";
//            }
//            else {
//                //alert(r.Message);
//            }
//        });
//    }
//}

//function EditarTrabajador(id) {
//    location.href = "/Empleado/AltaEdicion/" + id;
//}

//function ChanegChebSalariOActual() {
//    if ($("#chbEsSalarioActual").is(':checked')) {
//        $("#drpFF").attr('disabled', 'disabled');
//        $("#drpFF").val('');
//    }
//    else {
//        $("#drpFF").removeAttr('disabled');
//    }
//}

//function SaveOrUpdateSalario() {
//    if ($("#dtpFI").val() != '' && $("#txtMonto").val() != '' && (!$("#chbEsSalarioActual").is(':checked') ? ($("#drpFF").val() != '') : true)) {
//        var dateI = new Date($("#dtpFI").val());
//        var fi = ((dateI.getDate() > 9) ? dateI.getDate() : ('0' + dateI.getDate())) + '/' + ((dateI.getMonth() > 8) ? (dateI.getMonth() + 1) : ('0' + (dateI.getMonth() + 1))) + '/' + dateI.getFullYear();
//        var dateF = new Date($("#drpFF").val());
//        var ff = ((dateF.getDate() > 9) ? dateF.getDate() : ('0' + dateF.getDate())) + '/' + ((dateF.getMonth() > 8) ? (dateF.getMonth() + 1) : ('0' + (dateF.getMonth() + 1))) + '/' + dateF.getFullYear();
//        var parametros = {
//            FechaInicial: fi,
//            FechaFinal: ff,
//            Monto: $("#txtMonto").val(),
//            EsSalarioActual: $("#chbEsSalarioActual").is(':checked'),
//            Empleado: {
//                Id: $("#txtTrabajadorId").val()
//            }
//        };

//        PostMVC('/Empleado/SaveOrupdateSalario', parametros, function (r) {
//            if (r.IsSuccess) {
//                location.href = "/Empleado/AltaEdicion";
//            }
//            else {
//                //alert(r.Message);
//            }
//        });
//    }
//    else {
//        alert("Faltan datos requeridos.");
//    }
//}

//function GetSalarioByTrabajador() {
//    var trabajadorId = $("#txtTrabajadorId").val();
//    GetMVC("/Empleado/GetSalarioByTrabajador/" + trabajadorId, function (r) {
//        if (r.IsSuccess) {
//            MapingPropertiesDataTable("tableSalario", r.Response);
//        }
//        else {
//            alert("Error");
//        }
//    });
//}

//function GetSalarioActualTrabajador() {
//    var trabajadorId = $("#txtTrabajadorId").val();
//    GetMVC("/Empleado/GetSalarioByTrabajador/" + trabajadorId, function (r) {
//        if (r.IsSuccess) {
//            $.each(r.Response, function (i, v) {
//                if (v.esSalarioActual) {
//                    $("#txtSalarioTexto").val(formatMoney(v.monto));
//                }
//            });
//        }
//        else {
//            alert("Error");
//        }
//    });
//}