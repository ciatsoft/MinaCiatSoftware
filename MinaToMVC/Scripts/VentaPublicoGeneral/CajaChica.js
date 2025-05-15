document.addEventListener("DOMContentLoaded", function () {
    const drop = document.getElementById("usuarioDrop");
    const createdBy = document.getElementById("createdBy");
    const updatedBy = document.getElementById("updatedBy");
    const usuarioName = document.getElementById("usuarioName");
    const userName = document.getElementById("userName");

    function syncValues() {
        const selectedName = drop.options[drop.selectedIndex].text;

        createdBy.value = selectedName;
        updatedBy.value = selectedName;
        usuarioName.value = selectedName;
        userName.value = selectedName;
    }

    // Inicial
    syncValues();
    drop.addEventListener("change", syncValues);

    // Evento del botón
    document.getElementById("btnFiltrar").addEventListener("click", function () {
        const fecha = document.getElementById("fechaFiltro").value;
        const usuario = document.getElementById("userName").value;

        if (!usuario || !fecha) {
            alert("Por favor, seleccione un usuario y una fecha válida.");
            return;
        }

        // Llamada al método que consulta el API
        SearchPV_VajaChicaByDateAndUser(usuario, fecha);
    });
});


function SearchPV_VajaChicaByDateAndUser(userName, fecha) {
    PostMVC('/VentaPublicoGeneral/SearchPV_VajaChicaByDateAndUser', { userName, fecha }, function (r) {
        if (r.IsSuccess) {
            alert("Éxito!");
        } else {
            alert("Error al actualizar la venta. Ver consola para más detalles.");
        }
    });
}
