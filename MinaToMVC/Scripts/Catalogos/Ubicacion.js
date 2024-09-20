$(document).ready(function () {
    if (UbicacionJson.Id != 0) {
        GetUbicacionById(UbicacionJson.Id);
    }
    $("#tableUbicacion").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        //order: [[2, "asc"]],
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombreUbicacion", title: "Nombre Ubicacion" },
            { data: "descripcionUbicacion", title: "Descripcion Ubicacion" },
            {
                data: "id", title: "Editar", render: function (data) {
                    return "<a href='/Catalog/Ubicacion/" + data + "' class='btn btn-primary'>Editar</a>";
                }
            }
        ]
    });
    GetAllUbicacion();
    $("#btnGuardarUbicacion").on("click", function () {
        SaveOrUpdateUbicacion();
    });

});

function GetAllUbicacion() {
    GetMVC("/Catalog/GetAllUbicacion", function (r) {
        if (r.IsSuccess) {
            $('#tableUbicacion').dataTable().fnAddData(r.Response);
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

function SaveOrUpdateUbicacion() {
    if ($("#frmubicacion").valid()) {
        var parametro = {
            Id: $("#txtIdUbicacion").val(),
            NombreUbicacion: $("#txtNombreUbicacion").val(),
            DescripcionUbicacion: $("#txtDescripcionUbicacion").val(),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdateBy").val(),
            UpdatedDt: $("#txtUpdateDt").val(),
            Estatus: $("#chbEstatus").is(':checked')
        };
        PostMVC(urlSaveOrUpdateUbicacion, parametro, function (success, response) {
            if (success) {
                location.href = "/Catalog/Ubicacion";
            }
            else {
                alert("Error")
                console.log(response);
            }
        });

    }
}


    function GetUbicacionById(id) {
        PostMVC(urlTipoMaterialPorId + "/" + id, function (success, response) {
            if (success) {
                $("#txtIdUbicacion").val(response.Id);
                $("#txtNombreUbicacion").val(response.NombreUbicacion);
                $("#txtDescripcionUbicacion").val(response.DescripcionUbicacion);
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