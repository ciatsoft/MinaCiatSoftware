$(document).ready(function () {
    $("#frmRFID").validate({
        rules: {
            "txtRFID": "required",
            "txtNombreUsuario": "required",
            "txtArea": "required",
        }
    });

    // Inicializacion de tabla de RFIDS registrados
    $("#tableRFID").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "id" },
            { data: "rfid", title: "RFID" },
            { data: "idUsuario", title: "IdUsuario" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRFID(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRFID(' + data + ', this)" />'; // 'this' se pasa para obtener la fila
                }
            }
        ]
        ,
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

    GetAllRFID();

    if (typeof rfidJson.Id != 0) {
        $("#txtRFID").val(rfidJson.Id);
        $("#txtNombreUsuario").val(rfidJson.txtNombreUsuario);
        $("#txtArea").val(rfidJson.txtArea);
    }
});

function SaveOrUpdateRFID() {
    if ($("#frmRFID").valid()) {
        var parametro = {
            Id: $("#txtRFID").val(),
            IdUsuario: $("#")
        }
    }
}