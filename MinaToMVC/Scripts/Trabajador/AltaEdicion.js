$(function () {
    $("#frmTrabajador").validate({
        rules: {
            "txtNombre": "required",
            "txtEmail": "required",
            "txtTelefono": "required",
            "dtpFechaContratacion": "required",
            "txtSeguro": "required"
        }//,
        //messages: {
        //    "AmountString": "El campo 'Importe en letras' es requerido.",
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
        //}
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
            { data: "Id", "visible": false, title: "Id" },
            { data: "Nombre", title: "Nombre" },
            { data: "Email", title: "Email" },
            { data: "Telefono", title: "Teléfono" }
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
            FechaContratacion: $("#dtpFechaContratacion").val(),
            Seguro: $("#txtSeguro").val(),
            Turno: $("#ddlTurno").val(),
            Estatus: $("#chbEstatus").is(':checked'),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val()
        };

        PostMVC('/Empleado/SaveOrupdateTrabajador', parametro, function (r) {
            if (r.IsSuccess) {
                location.href = "/Empleado/AltaEdicion" + r.Response.id;
            }
            else {
                //alert(r.Message);
            }
        });
    }
}