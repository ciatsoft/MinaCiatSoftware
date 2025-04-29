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