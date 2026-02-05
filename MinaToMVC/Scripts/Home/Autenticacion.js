$(document).ready(function () {
    $("#btnAutentication").on("click", function () {
        var parameters = {
            user: $("#email").val().trim(),
            pass: $("#password").val()
        };

        // Validación básica
        if (!parameters.user || !parameters.pass) {
            swal("Advertencia", "Por favor ingrese usuario y contraseña", "warning");
            return;
        }

        $.ajax({
            url: "/Home/FirstAutentication",
            type: "POST",
            data: parameters,
            dataType: "json",
            success: function (r) {
                if (r.IsSuccess === true) {
                    window.location.href = "/Home/Index";
                }
                else {
                    swal("Error", r.Message || "Error desconocido", "error");
                }
            },
            error: function (xhr, status, error) {
                swal("Error", "Error en la comunicación con el servidor", "error");
            }
        });
    });
});