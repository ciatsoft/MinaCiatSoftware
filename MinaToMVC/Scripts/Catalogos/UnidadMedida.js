$(document).ready(function () {
    $("#tableUnidadMedida").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        //order: [[2, "asc"]],
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombre", title: "Unidad Medida" },
            { data: "descripcion", title: "Descripción" }
        ]
    });
    GetAllUnidadMedida();
});

function GetAllUnidadMedida() {
    GetMVC("/Catalog/GetAllUnidadmedida", function (r) {
        if (r.IsSuccess) {
            $('#tableUnidadMedida').dataTable().fnAddData(r.Response);
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error.',
                text: r.Message
            });
            //alert(r.Message);
        }
    });
}