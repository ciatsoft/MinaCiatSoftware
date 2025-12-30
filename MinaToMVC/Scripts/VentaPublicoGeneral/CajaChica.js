$(document).ready(function () {

    function formatCurrencyInput(selector) {
        $(selector).on('input', function () {
            let input = $(this).val();
            let value = input.replace(/[^0-9.]/g, '');

            let parts = value.split('.');
            if (parts.length > 2) {
                value = parts[0] + '.' + parts.slice(1).join('');
            }

            if (parts.length > 1 && parts[1].length > 2) {
                value = parts[0] + '.' + parts[1].substring(0, 2);
            }


            $(this).val(value);
        }).on('blur', function () {
            let value = $(this).val();
            if (value && value.trim() !== '') {
                let num = parseFloat(value);
                if (!isNaN(num)) {
                    let formatted = '$ ' + num.toLocaleString('es-MX', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });
                    $(this).val(formatted);
                }
            }
        }).on('focus', function () {
            let value = $(this).val().replace(/[^0-9.]/g, '');
            $(this).val(value);
        });
    }

    // Inicializar para ambos campos
    formatCurrencyInput('#montotxt');

    // Para enviar al servidor
    $('form').on('submit', function (e) {
        $('#montotxt').each(function () {
            let rawValue = $(this).val().replace(/[^0-9.]/g, '');
            if (rawValue) {
                let num = parseFloat(rawValue);
                if (!isNaN(num)) {
                    $(this).val(num.toFixed(2));
                }
            }
        });
    });

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
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningún dato disponible en esta tabla",
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
