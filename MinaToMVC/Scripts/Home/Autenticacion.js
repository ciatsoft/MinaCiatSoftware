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
                console.log("Respuesta:", r);

                if (r.IsSuccess === true) {
                    swal({
                        title: "¡Éxito!",
                        text: r.Message || "Autenticación exitosa",
                        type: "success",
                        confirmButtonText: "OK"
                    }, function () {
                        window.location.href = "/Home/Index";
                    });
                }
                else {
                    swal("Error", r.Message || "Error desconocido", "error");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error AJAX:", error);
                swal("Error", "Error en la comunicación con el servidor", "error");
            }
        });
    });
});