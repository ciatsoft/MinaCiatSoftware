$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmTrabajador").validate({
        rules: {
            "txtNombre": {
                lettersonly: true,
                required: true
            },
            "txtEmail": {
                email: true,
                required: true
            },
            "txtTelefono": "required",
            "dtpFechaContratacion": "required",
            "txtSeguro": {
                digits: true,
                required: true
            }
        },
        messages: {
            "txtNombre": {
                required: "El campo 'Nombre' es requerido.",
                lettersonly: "Este campo no acepta valores númericos."
            },
            "txtSeguro": {
                required: "El campo 'NSS' es requerido.",
                digits: "Este campo solo acepta números."
            }
        }
    });
});

$(document).ready(function () {
    $("#imgAddSalario").on("click", function () {
        $("#boddyGeericModal").empty().load("/Empleado/PartialCrudSalario", function () {
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
                    { data: "fechaFinal", title: "Fecha Termino" },
                    {
                        data: "monto", title: "Monto", render: function (data) {
                            return formatMoney(data);
                        }
                    },
                    { data: "esSalarioActual", title: "Salario Actual" },
                    {
                        data: "id", render: function (data) {
                            return '<input type="button" value="Editar" class="btn btn-primary" onclick="EditarTrabajador(' + data + ')" />';
                        }
                    }
                ]
            });

            $("#titleGenerciModal").text('Salarios del trabajador');
            $('#genericModal').modal('show');
        });

        GetSalarioByTrabajador();
    });

    $("#tblEmpleados").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        //order: [[2, "asc"]],
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "email", title: "Email" },
            { data: "telefono", title: "Teléfono" },
            { data: "seguro", title: "NSS" },
            {
                data: "turno", title: "Turno", render: function (data) {
                    var turnoString = "";
                    switch (data) {
                        case "M":
                            turnoString = "Matutino";
                            break;
                        case "V":
                            turnoString = "Vespertino";
                            break;
                        case "N":
                            turnoString = "Nocturno";
                            break;
                    }

                    return turnoString;
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-primary" onclick="EditarTrabajador(' + data + ')" />';
                }
            }
        ]
    });

    GetAllTrabajadores();

    if (trabajadorJson.Id != 0) {
        $("#txtTrabajadorId").val(trabajadorJson.Id);
        $("#txtNombre").val(trabajadorJson.Nombre);
        $("#txtEmail").val(trabajadorJson.Email);
        $("#txtTelefono").val(trabajadorJson.Telefono);
        $("#ddlAreaTrabajo").val(trabajadorJson.AreaTrabajo.Id);
        $("#txtSeguro").val(trabajadorJson.Seguro);
        $("#dtpFechaContratacion").val(trabajadorJson.FechaContratacion.substring(0, 10));
        $("#ddlTurno").val(trabajadorJson.Turno);
        $("#chbEstatus").prop('checked', trabajadorJson.Estatus);
    }
    else {
        $("#imgAddSalario").hide();
    }
});

function GetAllTrabajadores() {
    GetMVC("/Empleado/GetAllTrabajadores", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblEmpleados", r.Response);
        }
        else {
            alert("Error");
            //alert(r.Message);
        }
    });
}

function SaveOrupdateTrabajador() {
    if ($("#frmTrabajador").valid()) {
        var date = new Date($("#dtpFechaContratacion").val());
        var fc = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
        var parametro = {
            Id: $("#txtTrabajadorId").val(),
            Nombre: $("#txtNombre").val(),
            Email: $("#txtEmail").val(),
            Telefono: $("#txtTelefono").val(),
            AreaTrabajo: {
                Id: $("#ddlAreaTrabajo").val()
            },
            FechaContratacion: fc,
            Seguro: $("#txtSeguro").val(),
            Turno: $("#ddlTurno").val(),
            Estatus: $("#chbEstatus").is(':checked'),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val()
        };

        PostMVC('/Empleado/SaveOrupdateTrabajador', parametro, function (r) {
            if (r.IsSuccess) {
                location.href = "/Empleado/AltaEdicion";
            }
            else {
                //alert(r.Message);
            }
        });
    }
}

function EditarTrabajador(id) {
    location.href = "/Empleado/AltaEdicion/" + id;
}

function ChanegChebSalariOActual() {
    if ($("#chbEsSalarioActual").is(':checked')) {
        $("#drpFF").attr('disabled', 'disabled');
        $("#drpFF").val('');
    }
    else {
        $("#drpFF").removeAttr('disabled');
    }
}

function SaveOrUpdateSalario() {
    if ($("#dtpFI").val() != '' && $("#txtMonto").val() != '' && (!$("#chbEsSalarioActual").is(':checked') ? ($("#drpFF").val() != '') : true)) {
        var dateI = new Date($("#dtpFI").val());
        var fi = ((dateI.getDate() > 9) ? dateI.getDate() : ('0' + dateI.getDate())) + '/' + ((dateI.getMonth() > 8) ? (dateI.getMonth() + 1) : ('0' + (dateI.getMonth() + 1))) + '/' + dateI.getFullYear();
        var dateF = new Date($("#drpFF").val());
        var ff = ((dateF.getDate() > 9) ? dateF.getDate() : ('0' + dateF.getDate())) + '/' + ((dateF.getMonth() > 8) ? (dateF.getMonth() + 1) : ('0' + (dateF.getMonth() + 1))) + '/' + dateF.getFullYear();
        var parametros = {
            FechaInicial: fi,
            FechaFinal: ff,
            Monto: $("#txtMonto").val(),
            EsSalarioActual: $("#chbEsSalarioActual").is(':checked'),
            Empleado: {
                Id: $("#txtTrabajadorId").val()
            }
        };

        PostMVC('/Empleado/SaveOrupdateSalario', parametros, function (r) {
            if (r.IsSuccess) {
                location.href = "/Empleado/AltaEdicion";
            }
            else {
                //alert(r.Message);
            }
        });
    }
    else {
        alert("Faltan datos requeridos.");
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
            //alert(r.Message);
        }
    });
}