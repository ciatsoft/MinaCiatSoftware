$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmVentaCrud").validate({
        rules: {
            "Ingreso": {
                required: true
            },
            "Egreso": {
                required: true
            }
            ,
            "Comentario": {
                required: true
            }
            ,
            "Montototal": {
                required: true
            }
            ,
            "B500": {
                required: true
            }
            ,
            "B200": {
                required: true
            }
            ,
            "B100": {
                required: true
            }
            ,
            "B50": {
                required: true
            }
            ,
            "B20": {
                required: true
            }
            ,
            "M10": {
                required: true
            }
            ,
            "M5": {
                required: true
            }
            ,
            "M2": {
                required: true
            }
            ,
            "M1": {
                required: true
            }
            ,
            "M050": {
                required: true
            }
            
        }
    });
});
$(document).ready(function () {

});