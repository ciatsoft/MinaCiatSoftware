$(document).ready(function () {
    $("#tblViajesLocales").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        //order: [[2, "asc"]],
        columns: [
            { data: "id", "visible": false, title: "Id" },
            {
                data: "fechaInicio", title: "Origen", render: function (data) {
                    return formatDate(data);
                }
            },
            { data: "fechaFinal", title: "Destino" },
            {
                data: "monto", title: "Material a transportar", render: function (data) {
                    return formatMoney(data);
                }
            },
            { data: "esSalarioActual", title: "Transportista" },
            { data: "esSalarioActual", title: "Vehículo" },
            { data: "esSalarioActual", title: "Fecha de transporte" },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-primary" onclick="EditarTrabajador(' + data + ')" />';
                }
            }
        ]
    });
});