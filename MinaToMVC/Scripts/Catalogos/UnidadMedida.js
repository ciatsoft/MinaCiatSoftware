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
    $.ajax({
        url: 'http://localhost:44382/api/UnidadMedida/List',
        cache: false,
        type: 'GET',
        dataType: 'json',
        contentType: "application/json;",
        success: function (r) {
            $('#tableUnidadMedida').dataTable().fnAddData(r.response);
        },
        error: function (e) {
            console.log(e);
        }
    });
}