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

function SaveOrUpdateViajeinterno() {
    var date = new Date($("#dtpFechaViaje").val());
    var fc = ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + date.getFullYear();
    var parametros = {
        UbicacionOrigen: {
            Id: $("#ddlUOrigen").val()
        },
        UbicacionDestino: {
            Id: $("#ddlDestino").val()
        },
        TipoMaterial: {
            Id: $("#ddlTipoMaterial").val()
        },
        Chofer: {
            Id: $("#ddlTransportistas").val()
        },
        Vehiculo: {
            Id: $("#ddlVehiculo").val()
        },
        FechaViaje: fc,
        Observaciones: $("#txtObservaciones").val()
    };

    PostMVC('/Empleado/SaveOrupdateTrabajador', parametro, function (r) {
        if (r.IsSuccess) {
            location.href = "/Empleado/AltaEdicion";
        }
        else {
            //alert(r.Message);
        }
    });
}