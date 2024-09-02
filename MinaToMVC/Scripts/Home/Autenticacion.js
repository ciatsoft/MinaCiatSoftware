$(document).ready(function () {
    $("#btnAutentication").on("click", function () {
        var parameters = {
            user: $("#email").val(),
            pass: $("#password").val()
        };

        PostMVC("/Home/FirstAutentication", parameters, function (r) {
            if (r.IsSuccess) {
                window.location = "/Home/Index";
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
    });
});