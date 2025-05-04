$(document).ready(function () {

    CargarTrabajadores(function () {
        // Solo selecciona si ya hay datos cargados (modo edición)
        if (typeof rfidJson !== "undefined" && rfidJson?.Id) {
            $("#txtRFID").val(rfidJson.Id);
            $("#txtNombreUsuario").val(rfidJson.txtNombreUsuario); // Asegúrate que este valor sea el ID del trabajador
        }
    });

    $("#frmRFID").validate({
        rules: {
            "txtRFID": "required",
            "txtNombreUsuario": "required"
        }
    });

    // Inicialización de la tabla
    $("#tableRFID").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: false, title: "id" },
            { data: "rfid", title: "RFID" },
            { data: "idUsuario", title: "IdTrabajador", visible: false },
            { data: "nombreUsuario", title: "Nombre Trabajador" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id",
                render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRFID(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRFID(' + data + ', this)" />';
                }
            }
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

    GetAllRfid();

    if (typeof rfidJson !== "undefined" && rfidJson?.Id) {
        $("#txtRFID").val(rfidJson.Id);
        $("#txtNombreUsuario").val(rfidJson.txtNombreUsuario);
    }
});

function SaveOrUpdateRFID() {
    if ($("#frmRFID").valid()) {
        // Obtener el id y nombre del trabajador seleccionado
        var idUsuario = $("#txtNombreUsuario").val();
        var nombreUsuario = $("#txtNombreUsuario option:selected").text();

        var parametro = {
            id: $("#txtIdRfid").val(),
            rfid: $("#txtRFID").val(),
            idUsuario: idUsuario,
            nombreUsuario: nombreUsuario, // Agregado
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedDt: $("#txtUpdatedDt").val(),
            CreatedBy: $("#txtCreatedBy").val(),
            UpdatedBy: $("#txtUpdatedBy").val()
        };

        PostMVC('/RFID/SaveOrUpdateRFID', parametro, function (r) {
            if (r.IsSuccess) {
                alert("Datos guardados exitosamente.");
                location.reload(); // Recarga la página completa
            } else {
                alert("Error al guardar los datos: " + r.ErrorMessage);
            }
        });
    }
}


function EliminarRFID(id, boton) {
    var row = $(boton).closest("tr");
    var RFID = row.find("td:eq(1)").text();       // RFID
    var rfid = row.find("td:eq(0)").text();       // RFID
    var usuario = row.find("td:eq(2)").text();    // idUsuario

    if (confirm("¿Usted desea eliminar el siguiente RFID? \nIdRFID: " + id + "\nRFID: " + rfid + "\nIdUsuario: " + RFID)) {
        var parametro = {
            Id: id,
            RFID: RFID,
            idUsuario: usuario,
            Estatus: 0,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: new Date().toISOString()
        };

        PostMVC('/RFID/DeleteRFID', parametro, function (r) {
            if (r.IsSuccess) {
                alert("RFID eliminado exitosamente.");
                location.reload(); // Recarga la página completa
            } else {
                alert("Error al eliminar el RFID: " + r.ErrorMessage);
            }
        });
    }
}

function EditarRFID(id) {
    console.log("Iniciando EditarRFID para ID:", id);

    $.ajax({
        url: '/RFID/RFID?id=' + id,
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            console.log("Respuesta completa del servidor:", JSON.parse(JSON.stringify(response)));

            if (response && response.IsSuccess && response.Response) {
                var rfidData = response.Response;
                console.log("Datos del RFID a cargar:", rfidData);

                // Asigna los valores a los campos
                $("#txtRFID").val(rfidData.rfid || '');
                $("#txtIdRfid").val(rfidData.Id || 0);

                // Debug: Verifica que el valor se está asignando
                console.log("Valor asignado a txtIdRfid:", $("#txtIdRfid").val());

                // Para el select, asegúrate de que existe la opción
                if (rfidData.idUsuario) {
                    $("#txtNombreUsuario").val(rfidData.idUsuario).trigger('change');
                    console.log("Valor asignado a txtNombreUsuario:", rfidData.idUsuario);
                }

                console.log("Datos cargados correctamente");

                // Debug adicional para verificar todos los campos
                console.log("Estado actual del formulario:", {
                    txtIdRfid: $("#txtIdRfid").val(),
                    txtRFID: $("#txtRFID").val(),
                    txtNombreUsuario: $("#txtNombreUsuario").val()
                });
            } else {
                var errorMsg = response?.ErrorMessage || "Error desconocido";
                console.error("Error en la respuesta:", errorMsg);
                alert("Error al obtener datos: " + errorMsg);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la petición:", status, error);
            alert("Error al conectar con el servidor: " + error);
        }
    });
}

// Asegúrate de cargar los trabajadores primero
$(document).ready(function () {
    CargarTrabajadores(function () {
        // Si hay un ID en la URL, carga los datos automáticamente
        var urlParams = new URLSearchParams(window.location.search);
        var id = urlParams.get('id');
        if (id) {
            EditarRFID(id);
        }
    });
});

function GetAllRfid() {
    GetMVC("/RFID/GetAllRfid", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tableRFID", r.Response);
        } else {
            alert("Error al cargar los RFID: " + r.ErrorMessage);
        }
    });
}

function LimpiarFormulario() {
    $("#txtRFID").val('');
    $("#txtNombreUsuario").val('');
}

function CargarTrabajadores(callback) {
    GetMVC('/RFID/GetAllTrabajadores', function (r) {
        if (r.IsSuccess) {
            let trabajadores = r.Response; // Asegúrate que sea un array
            let $select = $('#txtNombreUsuario');
            $select.empty();
            $select.append('<option value="">Selecciona un trabajador</option>');
            trabajadores.forEach(function (t) {
                $select.append(`<option value="${t.id}">${t.nombre}</option>`);
            });

            if (typeof callback === "function") {
                callback(); // Para casos donde se necesite seleccionar un valor después de cargar
            }
        } else {
            alert("Error al cargar trabajadores: " + r.ErrorMessage);
        }
    });
}