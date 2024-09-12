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
        //    "Customer": "El campo 'Cliente' es requerido.",
        //    "BeneficiaryString": "El campo 'Beneficiario' es requerido.",
        //    "Concept_Id": "El campo 'Concepto' es requerido.",
        //    "ConceptDescription": {
        //        required: "El campo 'Comentarios del concepto' es requerido.",
        //        maxlength: "El campo no puede superar los 249 caracteres."
        //    },
        //    "Amount": {
        //        required: "El campo 'Importe' es requerido.",
        //        notOnlyZero: 'El importe debe ser diferente de cero'
        //    },
        //    "TransferCLABE": "El campo 'Cuenta CLABE' es requerido."
        }
    });
});

$(document).ready(function () {
    $("#imgAddSalario").on("click", function () {
        $("#boddyGeericModal").empty().load("/Empleado/PartialCrudSalario", function () {
            $('#genericModal').modal('show');
        });
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
            { data: "telefono", title: "Teléfono" }
        ]
    });

    GetAllTrabajadores();
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