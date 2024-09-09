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