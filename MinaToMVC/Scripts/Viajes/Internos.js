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
                data: "fechaInicio", title: "Fecha Inicial", render: function (data) {
                    return formatDate(data);
                }
            },
            { data: "fechaFinal", title: "Fecha Termino" },
            {
                data: "monto", title: "Monto", render: function (data) {
                    return formatMoney(data);
                }
            },
            { data: "esSalarioActual", title: "Salario Actual" },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-primary" onclick="EditarTrabajador(' + data + ')" />';
                }
            }
        ]
    });
});