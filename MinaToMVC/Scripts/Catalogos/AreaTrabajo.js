$(document).ready(function () {
    if (areaTrabajoId.Id != 0) {
        GetAreaTrabajoById();
    }
    $("#tableareaTrabajo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        //order: [[2, "asc"]],
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombre", title: "Nombre de Area" },
            { data: "descripcion", title: "Descripción" },
            {
                data: "id", title: "Editar", render: function (data) {
                    return "<a href='/Catalogos/AreaTrabajo/" + data + "' class='btn btn-primary'>Editar</a>";
                }
            }
        ]
    });
        GetAllAreaTrabajo(); 
        $("#btnGuardarAreaTrabajo").on("click", function () {
            SaveOrUpdateAreaTrabajo();
        });

});

function GetAllAreaTrabajo() {
    GetMVC("/Catalog/GetAllAreaTrabajo", function (r) {
        if (r.IsSuccess) {
            $('#tableareaTrabajo').dataTable().fnAddData(r.Response);
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

function SaveOrUpdateAreaTrabajo() {
    if ($("#frmareaTrabajo").valid()) {
        var parametro = {
            Id: $("#txtIdAreaTrabajo").val(),
            Nombre: $("#txtNombre").val(),
            Descripcion: $("#txtDescripcion").val(),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdateBy").val(),
            UpdatedDt: $("#txtUpdateDt").val(),
            Estatus: $("#chbEstatus").is(':checked')
        };
        PostMVC(urlSaveOrUpdateAreaTrabajo, parametro, function (success, response) {
            if (success) {
                location.href = "/Catalogos/AreaTrabajo";
            }
            else {
                alert("Error")
                console.log(response);
            }
        });
    }
}

function GetAreaTrabajoById() {
    PostMVC(urlareaTrabajoPorId + "/" + areaTrabajoId, function (success, response) {
        if (success) {
            $("#txtIdAreaTrabajo").val(response.Id);
            $("#txtNombre").val(response.Nombre);
            $("#txtDescripcion").val(response.Descripcion);
            $("#txtCreatedBy").val(response.CreatedBy);
            $("#txtCreatedDt").val(response.CreatedDt);
            $("#txtUpdateBy").val(response.UpdatedBy);
            $("#txtUpdateDt").val(response.UpdatedDt);
        }

        else {

            console.log(response);
            alert("OCurrio un error");
        }
    });
}