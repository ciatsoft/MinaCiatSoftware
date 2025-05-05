$(document).ready(function () {

});

function CambioPV_Precio() {
    var ubicacionSeleccionada = $("#Material_Id").val();

    GetMVC("/VentaPublicoGeneral/GetPV_PrecioByPV_Material/" + ubicacionSeleccionada, function (r) {
        if (r.IsSuccess) {
            $("#PVPrecio_Id").empty();
            $.each(r.Response, function (index, item) {
                var templateoption = "<option value='" + item.material.id + "'>" + item.material.nombreTipoMaterial + "</option>";

                $("#PVPrecio_Id").append(templateoption);
            });
        } else {
            console.log(r.response.ErrorMessage);
            window.Swal.fire('Error', 'No es posible obtener los materiales : ', 'error');
        }
    });
}