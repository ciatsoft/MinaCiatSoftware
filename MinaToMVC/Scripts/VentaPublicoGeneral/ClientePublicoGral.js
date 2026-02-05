$(document).ready(function () {
    $("#frmClientePublicoGral").validate({
        rules: {
            "Nombre": "required",
            "Telefono": "required",
            "Email": {
                required: true,
                email: true
            },
            "RFC": "required",
            "RazonSocial": "required",
            "Comentarios": "required"
        },
        messages: {
            "Nombre": "El nombre es obligatorio.",
            "Telefono": "El teléfono es obligatorio.",
            "Email": {
                required: "El correo electrónico es obligatorio.",
                email: "El formato del correo no es válido."
            },
            "RFC": "El RFC es obligatorio.",
            "RazonSocial": "La razón social es obligatoria.",
            "Comentarios": "El comentario es obligatorio."
        }
    });

    $("#tblClientesPGral").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: true, title: "Id" },
            { data: "rfid", visible: true, title: "RFID" },
            { data: "nombre", title: "Nombre" },
            { data: "telefono", title: "Telefono" },
            { data: "email", title: "Email" },
            { data: "rfc", title: "RFC" },
            { data: "razonSocial", title: "Razon Social" },
            { data: "comentarios", title: "Comentario" },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return `
                        <input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarClientePublicoGral(${data})" />
                        <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarClientePublicoGral(${data})" />
                    `;
                }
            }
        ],
        language: {
            decimal: ",",
            thousands: ".",
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ entradas",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningun dato disponible en esta tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de un total de _MAX_ entradas)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            aria: {
                sortAscending: ": activar para ordenar ascendente",
                sortDescending: ": activar para ordenar descendente"
            }
        }
    });

    GetAllClientePublicoGral();

    if (typeof ClientePublicoGralJson !== "undefined" && ClientePublicoGralJson && ClientePublicoGralJson.Id != 0) {
        console.log("Precargando datos: ", ClientePublicoGralJson);

        $("#id").val(ClientePublicoGralJson.Id);
        $("#nombre").val(ClientePublicoGralJson.Nombre);
        $("#telefono").val(ClientePublicoGralJson.Telefono);
        $("#email").val(ClientePublicoGralJson.Email);
        $("#rfc").val(ClientePublicoGralJson.RFC);
        $("#razonSocial").val(ClientePublicoGralJson.RazonSocial);
        $("#comentarios").val(ClientePublicoGralJson.Comentarios);
        
    } else {
        $("#btnEliminaru").hide();
        $("#btnGuardaru").show();
    }
});

function GetAllClientePublicoGral() {
    GetMVC("/VentaPublicoGeneral/GetAllClientePublicoGral", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblClientesPGral", r.Response);
        } else {
            Swal.fire("Error", "Error al cargar los Clientes Venta Publico General: " + r.ErrorMessage, "error");
        }
    });
}

function SaveOrUpdateClientePublicoGral() {
    if ($("#frmClientePublicoGral").valid()) {
        var parametro = {
            Id: $("#id").val(),
            RFID: $("#RFID").val(),
            nombre: $("#nombre").val(),
            telefono: $("#telefono").val(),
            email: $("#email").val(),
            rfc: $("#rfc").val(),
            razonSocial: $("#razonSocial").val(),
            comentarios: $("#comentarios").val(),
            Estatus: 1,
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#fecha").val(),
            UpdatedBy: $("#createdBy").val(),
            UpdatedDt: $("#fecha").val()
        };

        var isUpdating = parametro.Id && parametro.Id != 0;
        Swal.fire({
            title: isUpdating ? 'Actualizar el registro' : 'Guardar nuevo registro',
            html: `<strong>Id:</strong> ${parametro.Id}<br/>
                   <strong>RFID:</strong> ${parametro.RFID}<br/>
                   <strong>Nombre:</strong> ${parametro.nombre}<br/> 
                   <strong>Telefono:</strong> ${parametro.telefono}<br/> 
                   <strong>Email:</strong> ${parametro.email}<br/> 
                   <strong>RFC:</strong> ${parametro.rfc}<br/> 
                   <strong>Razon Social:</strong> ${parametro.razonSocial}<br/>
                   <strong>Comentario:</strong> ${parametro.comentarios}<br/> `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: isUpdating ? 'Actualizar' : 'Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                GetMVC("/VentaPublicoGeneral/GetClientePublicoGralById/" + parametro.Id, function (r) {
                    if (r.IsSuccess) {
                        var data = r.Response;
                        if (parametro.RFID == data.rfid) {
                            PostMVC("/VentaPublicoGeneral/SaveOrUpdateClientePublicoGral", parametro, function (success, response) {
                                if (success) {
                                    Swal.fire('Exito', isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.', 'success')
                                        .then(() => window.location.href = '/VentaPublicoGeneral/ClientePublicoGeneral');
                                } else {
                                    Swal.fire('Error', 'Error al guardar los datos: ' + response.ErrorMessage, 'error');
                                }
                            });
                        }
                        else {
                            var objeto = {
                                Id: 0,
                                IdCliente: parametro.Id,
                                RFID_Anterior: data.rfid,
                                RFID_Nuevo: $("#RFID").val(),
                                Fecha_Cambio: $("#fecha").val(),
                                Estatus: 1,
                                CreatedBy: $("#createdBy").val(),
                                CreatedDt: $("#fecha").val(),
                                UpdatedBy: $("#createdBy").val(),
                                UpdatedDt: $("#fecha").val()
                            }
                            PostMVC("/VentaPublicoGeneral/SaveOrUpdateHistoricoRFID", objeto, function (success, response) {
                                if (success) {
                                    GetMVC("/VentaPublicoGeneral/TotalHistoricoRFIDByIdCliente/" + parametro.Id, function (r) {
                                        if (r.IsSuccess) {
                                            var datosCliente = r.Response;
                                            PostMVC("/VentaPublicoGeneral/SaveOrUpdateClientePublicoGral", parametro, function (success, response) {
                                                Swal.fire({
                                                    title: 'Exito',
                                                    html: `${isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.'}<br>
                                                            Se han actualizado <strong>${datosCliente.totalRegistros}</strong> veces la tarjeta RFID`,
                                                    icon: 'success'
                                                }).then(() => window.location.href = '/VentaPublicoGeneral/ClientePublicoGeneral');
                                            });
                                        }
                                        else {
                                            Swal.fire('Error', 'Error al guardar los datos: ' + response.ErrorMessage, 'error');
                                        }
                                    });
                                } else {
                                    Swal.fire('Error', 'Error al guardar los datos: ' + response.ErrorMessage, 'error');
                                }
                            });
                        }
                    } else {
                        Swal.fire("Error", "Error al cargar los Datos del Clientes Venta Publico General: " + r.ErrorMessage, "error");
                    }
                });
            }
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios.', 'warning');
    }
}

function EditarClientePublicoGral(id) {
    window.location.href = "/VentaPublicoGeneral/ClientePublicoGeneral/" + id;
}

function EliminarClientePublicoGral(id) {
    Swal.fire({
        title: 'Eliminar registro',
        text: "Esta acción eliminara el Cliente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            PostMVC('/VentaPublicoGeneral/DeleteClientePublicoGral', { id: id }, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El Cliente ha sido eliminado.', 'success')
                        .then(() => window.location.href = '/VentaPublicoGeneral/ClientePublicoGeneral');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}

