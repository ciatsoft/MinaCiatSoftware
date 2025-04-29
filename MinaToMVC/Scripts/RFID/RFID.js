$(document).ready(function () {
    $("#frmRFID").validate({
        rules: {
            "txtRFID": "required",
            "txtNombreUsuario": "required"
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
    }
});

function SaveOrUpdateRFID() {
    if ($("#frmRFID").valid()) {
        var parametro = {
            Id: $("#txtRFID").val(),
            IdUsuario: $("#txtNombreUsuario").val()
        };
        windows.location.href = '/RFID/RFID';
        // Llamada al servidor para guardar o actualiza los datos
        PostMVC('/RFID/SaveOrUpdateRFID', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                alert("Datos guardados exitosamente.");
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}

function EliminarRFID(id, boton) {
    // Obtener la fila correspondiente al botòn de eliminacion
    var row = $(boton).closest("tr");

    // Obtener los valores de la fila y almacenarlos en variables
    var RFID = row.find("td:eq(0)").text(); //RFID
    var usuario = row.find("td:eq(1)").text();  //IdUsuario

    // Confirmacion de eliminacion
    if (confirm("¿Usted desea eliminar el siguiente RFID? \nRFID: " + RFID + "\nIdUsuario: " + IdUsuario)) {
        //Actualiza eñ estatus a "Inactivo" (0) y preparamos el parametro
        var parametro = {
            Id: id,
            RFID: RFID,
            idUsuario: idUsuario,
            Estatus: 0,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),  // Asignamos el valor de quien está actualizando
            UpdatedDt: new Date().toISOString()  // Asignamos la fecha y hora actual como fecha de actualización
        };

        window.location.href = '/RFID/RFID';
        // Llama para guardar o actualizar 
        PostMVC('/SaveOrUpdateRFID', parametro, function (r) {
            if (r.IsSuccess) {
                alert("RFID eliminada exitosamente");
            } else {
                alert("Error al eliminar el RFID: " + r.ErrorMessage);
            }
        });
    }
}

function EditarRFID(id) {
    location.href = '/RFID/RFID';
}

function GetAllRFID() {
    GetMVC("/RFID/GetAllRFID", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableRFID", r.Response);
        } else {
            alert("Error al cargar los RFID: " + r.ErrorMessage);
        }
    });
}

// Funcion para limpiar el formulario
function LimpiarFormulario() {
    $("#txtRFID").val('');
    $("#txtNombreUsuario").val('');
}