$(document).ready(function () {
    // Inicializa la tabla vacía SIN la columna corte_Id
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
            { data: 'comentarios', title: 'Comentarios' }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningun dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": "Buscar:",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
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
        if (r.IsSuccess) {
            const data = r.Response;

            // Destruye DataTable si ya existe
            if ($.fn.DataTable.isDataTable('#tblPV_CajaChica')) {
                $('#tblPV_CajaChica').DataTable().clear().destroy();
            }

            const existeCorteIdNoCero = data.some(item => {
                const valor = item.corte_Id;
                return valor !== 0 && valor !== null && valor !== undefined && valor !== '';
            });

            const columnas = [
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
                { data: 'comentarios', title: 'Comentarios' }
            ];

            if (existeCorteIdNoCero) {
                columnas.push({ data: 'corte_Id', title: 'Corte Id' });
            }

            // Inicializar DataTable con las columnas dinámicas
            $('#tblPV_CajaChica').DataTable({
                data: data,
                columns: columnas,
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
                }
            });
        } else {
            alert("Error al obtener registros. Ver consola para más detalles.");
        }
    });
}