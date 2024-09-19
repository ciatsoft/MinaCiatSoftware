$(document).ready(function () {

    if (unidadMedidaId.Id != 0){
        GetUnidadMedidaById();
    }
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
            Descripcion: $("#txtdescripcion").val(),
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

function GetUnidadMedidaById() {
    PostMVC(urlUnidadmedidaPorId) + "/" + unidadMedidaId, function (success, response) {
        if (success) {
            $("#txtIdUnidadMedida").val(response.Id);
            $("#txtnombreUnidadmedida").val(response.Nombre);
            $("#txtdescripcion").val(response.Descripcion);
            $("#txtCreatedBy").val(response.CreatedBy);
            $("#txtCreatedDt").val(response.CreatedDt);
            $("#txtUpdateBy").val(response..UpdatedBy);
            $("#txtUpdateDt").val(response.UpdatedDt);
        }
    
        else {

            console.log(response);
            alert("OCurrio un error");
        }
    });
}
//te falta aquí el método de saveorupdate que llame al controlador