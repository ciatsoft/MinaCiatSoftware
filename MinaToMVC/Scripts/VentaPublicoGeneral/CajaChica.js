$(document).ready(function () {
    // Inicializa la tabla vacía al cargar la página
    $('#tblPV_CajaChica').DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'usuarioName', title: 'Usuario' },
            {
                data: 'monto',
                title: 'Monto',
                render: function (data) {
                    if (data === null || data === undefined) return '';
                    return `$${parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }).replace('$', '')}`;
                }
            },
            {
                data: 'fecha',
                title: 'Fecha',
                render: function (data) {
                    if (!data) return '';
                    return new Date(data).toLocaleString('es-MX');
                }
            },
            { data: 'comentarios', title: 'Comentarios' },
            { data: 'corte_Id', title: 'Corte Id' },
        ],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
        }
    });
});

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
    PostMVC('/VentaPublicoGeneral/SearchPV_VajaChicaByDateAndUser', { userName, fecha }, function (r, textStatus, jqXHR) {
        console.log("Respuesta objeto r:", r);
        if (r.IsSuccess) {
            const data = r.Response;

            // Destruye DataTable si ya existe (evita duplicados al hacer múltiples filtros)
            if ($.fn.DataTable.isDataTable('#tblPV_CajaChica')) {
                $('#tblPV_CajaChica').DataTable().clear().destroy();
            }

            // Mapea los datos al DataTable
            $('#tblPV_CajaChica').DataTable({
                data: data,
                columns: [
                    { data: 'id', title: 'ID' },
                    { data: 'usuarioName', title: 'Usuario' },
                    {
                        data: 'monto',
                        title: 'Monto',
                        render: function (data) {
                            return `$${parseFloat(data).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }).replace('$', '')}`;
                        }
                    },
                    {
                        data: 'fecha',
                        title: 'Fecha',
                        render: function (data) {
                            return new Date(data).toLocaleString('es-MX'); // muestra fecha + hora
                        }
                    },
                    { data: 'comentarios', title: 'Comentarios' },
                    { data: 'corte_Id', title: 'Corte Id' },
                ],
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
                }
            });
        } else {
            alert("Error al obtener registros. Ver consola para más detalles.");
        }
    });
}
