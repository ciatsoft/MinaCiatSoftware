$(document).ready(function () {
    $("#btnAutentication").on("click", function () {
        var parameters = {
            user: $("#email").val(),
            pass: $("#password").val()
        };

        PostMVC("/Home/FirstAutentication", parameters, function (r) {
            if (r.IsSuccess) {
                swal({
                    title: "¡Éxito!",
                    text: "Autenticación exitosa",
                    type: "success",
                    confirmButtonText: "OK"
                }, function () {
                    window.location = "/Home/Index";
                });
            }
            else {
                swal("Error", "Usuario o Contraseña no correctos", "error");
            }
        });
    });
});