$(document).ready(function () {
    if (tipoMaterialUbicacionJson.Id != 0) {
        GetTipoMaterialUbicacionById(tipoMaterialUbicacionJson.Id);
    }
    $("#tableTipodematerial").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        //order: [[2, "asc"]],
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombreTipoMaterial", title: "Nombre Material" },
            { data: "descripcionTipoMaterial", title: "Tipo Material" },
            { data: "dtoUbicacion.nombreUbicacion", title: "Ubicacion" },
            { data: "unidadMedida.nombre", title: "UnidadMedida" },
            {
                data: "id", title: "Editar", render: function (data) {
                    return "<a href='/Catalog/TipoMaterialUbicacion/" + data + "' class='btn btn-primary'>Editar</a>";
                }
            }
        ]
    });

    GetAllTipoMaterialUbicacion();
    $("#btnGuardarTipodeMaterial").on("click", function () {
        SaveOrUpdateTipoMaterialUbicacion();
    });

});

function GetAllTipoMaterialUbicacion() {
    GetMVC("/Catalog/GetAllTipoMaterialUbicacion", function (r) {
        if (r.IsSuccess) {
            $('#tableTipodematerial').dataTable().fnAddData(r.Response);
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

function SaveOrUpdateTipoMaterialUbicacion() {
    if ($("#frmTipoMaterialUbicacion").valid()) {
        var parametro = {
            Id: $("#txtidtipomaterial").val(),
            NombreTipoMaterial: $("#txtNombreTipoMaterial").val(),
            DescripcionTipoMaterial: $("#txtDescripcionTipoMaterial").val(),
            DtoUbicacion: {
                Id: $("#ddlUbicacion").val(),
            },
                
            UnidadMedida: {
                Id: $("#ddlUnidadDeMedida").val(),
            },
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdateBy").val(),
            UpdatedDt: $("#txtUpdateDt").val(),
            Estatus: $("#chbEstatus").is(':checked')
        };
        PostMVC(urlSaveOrUpdateTipoMaterial, parametro, function (success, response) {
            if (success) {
                location.href = "/Catalog/TipoMaterialUbicacion";
            }
            else {
                alert("Error")
                console.log(response);
            }
        });
    }
}

function GetTipoMaterialUbicacionById(id) {
    PostMVC(urlTipoMaterialPorId + "/" + id, function (success, response) {
        if (success) {
            $("#txtidtipomaterial").val(response.Id);
            $("#txtNombreTipoMaterial").val(response.NombreTipoMaterial);
            $("#txtDescripcionTipoMaterial").val(response.DescripcionTipoMaterial);
            $("#ddlDtoUbicacion").val(response.UnidadMedida);
            $("#ddlUbicacion").val(response.DtoUbicacion);
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