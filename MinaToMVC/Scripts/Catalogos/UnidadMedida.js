$(document).ready(function () {

    if (unidadMedidaJson.Id != 0) {
        GetUnidadMedidaById(unidadMedidaJson.Id);
    }
    $("#tableUnidadMedida").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        //order: [[2, "asc"]],
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripción" },
            {
                data: "id", title: "Editar", render: function (data) {
                    return "<a href='/Catalog/UnidadMedida/" + data + "' class='btn btn-primary'>Editar</a>";
                }
            }
        ]
    });
    GetAllUnidadmedida();
    $("#btnGuardarUnidadMedida").on("click", function () {
        SaveOrUpdateUnidadMedida();
    });

});

function GetAllUnidadmedida() {
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
            Id: $("#txtunidadmedida").val(),
            Nombre: $("#txtNombre").val(),
            Descripcion: $("#txtDescripcion").val(),
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
            $("#txtunidadmedida").val(response.Id);
            $("#txtNombre").val(response.Nombre);
            $("#txtDescripcion").val(response.Descripcion);
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
//le habias puesto un parentesis de más
//te falta aquí el método de saveorupdate que llame al controlador