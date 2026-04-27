$(document).ready(function () {
    $("#frmVehiculoPublicoGral").validate({
        rules: {
            "Nombre": "required",
            "Capacidad": "required",
            "ClienteID": "required",
            "Color": "required",
            "Placa": "required",
        }
    });

    if ($("#id").val() != "0") {
        $("#chbestatus").prop('checked', $("#estatus").val() == "1");
    }

    $("#tblVehiculosPublicoGral").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "nombre", title: "Descripcion" },
            { data: "capacidad", title: "Capacidad (m3)" },
            { data: "clienteID.nombre", title: "Nombre del Cliente" },
            { data: "color", title: "Color" },
            { data: "placa", title: "Placa" },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return '<button class="btn btn-sm btn-primary" onclick="EditarVehiculoPublicoGral(' + data + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarVehiculoPublicoGral(' + data + ')">' +
                        '<i class="fa fa-trash"></i> Eliminar</button>';
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningun dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": '<i class="fa fa-search"></i> Buscar:',
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i>',
                "last": '<i class="fa fa-fast-forward"></i>',
                "next": '<i class="fa fa-forward"></i>',
                "previous": '<i class="fa fa-backward"></i>'
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    GetAllVehiculosPublicoGral();

    if (typeof VehiculoPubligoGralJson !== "undefined" && VehiculoPubligoGralJson && VehiculoPubligoGralJson.Id != 0) {
        console.log("Precargando datos: ", VehiculoPubligoGralJson);

        $("#id").val(VehiculoPubligoGralJson.Id);
        $("#nombre").val(VehiculoPubligoGralJson.Nombre);
        $("#capacidad").val(VehiculoPubligoGralJson.Capacidad);
        $("#color").val(VehiculoPubligoGralJson.Color);
        $("#placa").val(VehiculoPubligoGralJson.Placa);
        $("#chbestatus").prop('checked', VehiculoPubligoGralJson.Estatus === 1);

        if (VehiculoPubligoGralJson.ClienteID && VehiculoPubligoGralJson.ClienteID.Id) {
            $("#ddlClientes").val(VehiculoPubligoGralJson.ClienteID.Id);
        }
    } else {
        $("#btnEliminaru").hide();
        $("#btnGuardaru").show();
    }
});

function GetAllVehiculosPublicoGral() {
    GetMVC("/Catalog/GetAllVehiculosPublicoGral", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblVehiculosPublicoGral", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar los vehículos: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: 'OK'
            });
        }
    });
}

function SaveOrUpdateVehiculosPublicoGral() {

    if (!$("#frmVehiculoPublicoGral").valid()) {
        swal("Advertencia", "Complete todos los campos obligatorios.", "warning");
        return;
    }

    var parametro = {
        Id: $("#id").val() || 0,
        Nombre: $("#nombre").val(),
        Capacidad: $("#capacidad").val(),
        ClienteID: { Id: $("#ddlClientes").val() },
        Color: $("#color").val(),
        Placa: $("#placa").val(),
        Estatus: 1,
        CreatedBy: $("#createdBy").val(),
        UpdatedBy: $("#updatedBy").val(),
        CreatedDt: $("#CreatedDt").val(),
        UpdatedDt: $("#UpdatedDt").val(),
    };

    PostMVC("/Catalog/SaveOrUpdateVehiculosPublicoGral", parametro, function (r) {

        if (r.IsSuccess) {

            swal({
                title: "¡Registro guardado!",
                text: "El vehiculo fue guardado correctamente.",
                type: "success"
            }, function () {
                window.location.href = '/Catalog/VehiculosPublicoGeneral';
            });

        } else {
            swal("Error", r.ErrorMessage, "error");
        }

    });
}

function EditarVehiculoPublicoGral(id) {
    console.log("Editar ID recibido:", id);
    window.location.href = "/Catalog/VehiculosPublicoGeneral/" + id;
}

function EliminarVehiculoPublicoGral(id) {
    swal({
        title: '¿Estas seguro?',
        text: "Esta accion eliminara el vehiculo del cliente.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            swal({
                title: "¡Eliminado!",
                text: "El vehiculo del cliente ha sido eliminado correctamente.",
                type: "success",
                confirmButtonText: 'OK'
            }, function () {
                window.location.href = '/Catalog/VehiculosPublicoGeneral';
            });
            window.location.href = '/Catalog/VehiculosPublicoGeneral';
            PostMVC('/Catalog/DeleteVehiculosPublicoGral', { id: id }, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "¡Eliminado!",
                        text: "El vehículo del cliente ha sido eliminado correctamente.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/VehiculosPublicoGeneral';
                    });
                } else {
                    swal({
                        title: "Error",
                        text: "No se pudo eliminar: " + r.ErrorMessage,
                        type: "error",
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });
}