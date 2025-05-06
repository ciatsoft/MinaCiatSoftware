$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmVentaCrud").validate({
        rules: {
            "Folio": {
                required: true
            },
            "Ubicacion_Id": {
                required: true
            }
            ,
            "TipoMaterial_Id": {
                required: true
            }
            ,
            "Transporte": {
                required: true
            }
            ,
            "Placa": {
                required: true
            }
        }
    });
});
$(document).ready(function () {

});

function CambioUbicacion() {
    var ubicacionSeleccionada = $("#Ubicacion_Id").val();

    GetMVC("/VentaPublicoGeneral/GetMaterialUbicacionByUbicacion/" + ubicacionSeleccionada, function (r) {
        if (r.IsSuccess) {
            $("#TipoMaterial_Id").empty();
            $.each(r.Response, function (index, item) {
                var templateoption = "<option value='" + item.material.id + "'>" + item.material.nombreTipoMaterial + "</option>";

                $("#TipoMaterial_Id").append(templateoption);
            });
        } else {
            console.log(r.response.ErrorMessage);
            window.Swal.fire('Error', 'No es posible obtener los materiales de esta ubicación: ', 'error');
        }
    });
}

