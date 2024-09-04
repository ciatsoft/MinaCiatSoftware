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


function SaveOrUpdateUnidadMedida()
{
    if ($("#frmUnidadMedida").valid()) {
        var parametro = {
            Id: $("#txtIdUnidadMedida").val(),
            Nombre: $("#txtnombreUnidadmedida").val(),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdateBy").val(),
            UpdatedDt: $("#txtUpdateDt").val()
        };
        PostMVC(urlUnidadMedida, parametro, function (success, response) {
            if (success) {
                location.href = "/Catalogos/UnidadMedida";
            }
            else {
                alert("Error")
                console.log(response);
            }
        });
    }
}
//te falta aquí el método de saveorupdate que llame al controlador