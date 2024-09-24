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
            { data: "nombreUbicacion", title: "NombreUbicacion" },
            { data: "descripcionUbicacion", title: "DescripcionUbicacion" },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-primary" onclick="EditarUbicacion(' + data + ')" />';
                }
            }
        ]

    });
    GetAllUbicacion();
    $("#btnGuardarUbicacion").on("click", function () {
        //SaveOrUpdateUbicacion();
    });
   
     GetAllUbicacion();//if (UbicacionJson.Id != 0) {
    //    GetUbicacionById(UbicacionJson.Id);
    //    //se te fueron bien feo las cabras al monte heee

    //}

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
    //esta mal implememntado tu código ino
    GetMVC(urlUbicacionPorId + "/" + id, function (response) {
        if (response.IsSuccess) {
            $("#txtIdUbicacion").val(response.Response.id);
            $("#txtNombreUbicacion").val(response.Response.NombreUbicacion);
            $("#txtDescripcionUbicacion").val(response.Response.DescripcionUbicacion);
            $("#txtCreatedBy").val(response.Response.CreatedBy);
            $("#txtCreatedDt").val(response.Response.CreatedDt);
            $("#txtUpdateBy").val(response.Response.UpdatedBy);
            $("#txtUpdateDt").val(response.Response.UpdatedDt);
        }

        else {

            console.log(response);
            alert("OCurrio un error");
        }
    });
}

function EditarUbicacion(id) {
    location.href = "/Catalog/Ubicacion/" + id;
}
