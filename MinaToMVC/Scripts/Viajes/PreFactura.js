$(document).ready(function () {

    $("#tblPreFactura").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "folio", "visible": true, title: "Folio" },
            {
                data: "fechaViaje",
                title: "Fecha de transporte",
                render: function (data, type, row) {
                    if (data) {
                        var date = new Date(data);
                        var day = ("0" + date.getDate()).slice(-2);
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    }
                    return "";
                }
            },
            { data: "cliente.nombre", title: "Cliente" },
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },
            {
                data: "facturado", // Asumiendo que tu modelo tiene esta propiedad
                title: "Facturado",
                orderable: false,
                render: function (data, type, row) {
                    // Si el dato viene como 1/0, true/false, o string
                    var isChecked = data === true || data === 1 || data === '1' || data === 'true';
                    return '<input type="checkbox" class="completado-checkbox form-control" ' +
                        (isChecked ? 'checked' : '') +
                        ' data-id="' + row.id + '">';
                }
            }
        ],
        order: [0, 'desc'],
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

    // Event handler para capturar los cambios en los checkboxes
    $(document).on('change', '.completado-checkbox', function () {
        var id = $(this).data('id');
        var isChecked = $(this).is(':checked');

        console.log('Checkbox cambiado - ID:', id, 'Completado:', isChecked);

        guardarEstadoCheckbox(id, isChecked);
    });

    function guardarEstadoCheckbox(id, facturado) {
        $.ajax({
            url: '/Viajes/CheckPreFactura',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: id,
                facturado: facturado
            }),
            success: function (response) {
                console.log('Estado guardado correctamente');
            },
            error: function (xhr, status, error) {
                console.error('Error al guardar estado:', error);
            }
        });
    }
});

document.getElementById("btnFiltrar2").addEventListener("click", function () {
    var fecha1 = $("#fechaFiltro1").val();
    var fecha2 = $("#fechaFiltro2").val();
    if (!fecha1 || !fecha2) {
        alert("Por favor, seleccione una fecha válida.");
        return;
    }
    // Convertir a objetos Date para comparación
    var date1 = new Date(fecha1);
    var date2 = new Date(fecha2);

    // Validar que fecha2 no sea menor que fecha1
    if (date2 < date1) {
        alert("Filtrado invalido: La fecha final no puede ser menor que la fecha inicial.");
        return;
    }
    GetAllViajeLocalByDatesFacturado(fecha1, fecha2);
});

function GetAllViajeLocalByDatesFacturado(fecha1, fecha2) {
    // Usar GET con parámetros en la URL
    GetMVC(`/Viajes/GetAllViajeLocalByDatesFacturado?fecha1=${fecha1}&fecha2=${fecha2}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            console.log(r.Response);
            MapingPropertiesDataTable("tblPreFactura", r.Response);
        } else {
            alert("Error al cargar los viajes: " + r.ErrorMessage);
        }
    });
}