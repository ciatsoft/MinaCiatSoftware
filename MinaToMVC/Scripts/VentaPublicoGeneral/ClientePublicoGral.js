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

    $("#tblHistoricoRFIDCliente").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        responsive: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "rfiD_Anterior", visible: true, title: "RFID Anterior" },
            { data: "rfiD_Nuevo", title: "RFID Nuevo" },
            {
                data: "fecha_Cambio",
                title: "Fecha de Cambio",
                render: function (data) {
                    if (data) {
                        var fecha = new Date(data);
                        // Formato: dd/mm/yyyy HH:MM
                        return fecha.toLocaleDateString('es-ES') + ', Hora: ' + fecha.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    }
                    return '';
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return `
                        <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarHistoricoRFID(${data})" />
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

        GetAllHistoricoRFIDByIdCliente(ClientePublicoGralJson.Id);
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

function GetAllHistoricoRFIDByIdCliente(id) {
    GetMVC("/VentaPublicoGeneral/GetAllHistoricoRFIDByIdCliente/" + id, function (r) {
        if (r.IsSuccess) {
            var data = r.Response;
            MapingPropertiesDataTable("tblHistoricoRFIDCliente", r.Response);
            console.log(data);
        } else {
            Swal.fire("Error", "Error al cargar los Datos del Clientes Venta Publico General: " + r.ErrorMessage, "error");
        }
    });
}

function EliminarHistoricoRFID(id) {
    PostMVC('/VentaPublicoGeneral/DeleteHistoricoRFID', { id: id }, function (r) {
        Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success')
            .then(() => window.location.reload());
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

        // Si es NUEVO cliente (Id = 0 o vacío), guardar directamente sin verificar histórico
        if (!isUpdating) {
            Swal.fire({
                title: 'Guardar nuevo registro',
                html: `<strong>RFID:</strong> ${parametro.RFID}<br/>
                       <strong>Nombre:</strong> ${parametro.nombre}<br/> 
                       <strong>Telefono:</strong> ${parametro.telefono}<br/> 
                       <strong>Email:</strong> ${parametro.email}<br/> 
                       <strong>RFC:</strong> ${parametro.rfc}<br/> 
                       <strong>Razon Social:</strong> ${parametro.razonSocial}<br/>
                       <strong>Comentario:</strong> ${parametro.comentarios}<br/> `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Guardar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    PostMVC("/VentaPublicoGeneral/SaveOrUpdateClientePublicoGral", parametro, function (success, response) {
                        if (success) {
                            Swal.fire('Exito', 'Datos guardados exitosamente.', 'success')
                                .then(() => window.location.href = '/VentaPublicoGeneral/ClientePublicoGeneral');
                        } else {
                            Swal.fire('Error', 'Error al guardar los datos: ' + response.ErrorMessage, 'error');
                        }
                    });
                }
            });
            return;
        }

        // Si es ACTUALIZACIÓN (Id existe)
        Swal.fire({
            title: 'Actualizar el registro',
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
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                GetMVC("/VentaPublicoGeneral/GetClientePublicoGralById/" + parametro.Id, function (r) {
                    if (r.IsSuccess) {
                        var data = r.Response;
                        console.log("Datos del cliente existente:", data);

                        // Validar si data es null (no debería pasar en actualización, pero por seguridad)
                        if (!data) {
                            Swal.fire('Error', 'No se encontró el cliente a actualizar.', 'error');
                            return;
                        }

                        // Comparar RFID actual con el nuevo
                        if (parametro.RFID == data.rfid) {
                            // Mismo RFID - solo actualizar datos del cliente
                            PostMVC("/VentaPublicoGeneral/SaveOrUpdateClientePublicoGral", parametro, function (success, response) {
                                if (success) {
                                    Swal.fire('Exito', 'Datos actualizados exitosamente.', 'success')
                                        .then(() => window.location.href = '/VentaPublicoGeneral/ClientePublicoGeneral');
                                } else {
                                    Swal.fire('Error', 'Error al guardar los datos: ' + response.ErrorMessage, 'error');
                                }
                            });
                        }
                        else {
                            // RFID diferente - guardar en histórico y luego actualizar
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
                            };

                            PostMVC("/VentaPublicoGeneral/SaveOrUpdateHistoricoRFID", objeto, function (success, response) {
                                if (success) {
                                    GetMVC("/VentaPublicoGeneral/TotalHistoricoRFIDByIdCliente/" + parametro.Id, function (r2) {
                                        if (r2.IsSuccess) {
                                            var datosCliente = r2.Response;
                                            PostMVC("/VentaPublicoGeneral/SaveOrUpdateClientePublicoGral", parametro, function (success2, response2) {
                                                if (success2) {
                                                    Swal.fire({
                                                        title: 'Registro Guardado!',
                                                        html: `Datos actualizados exitosamente.<br>
                                                               Se han actualizado <strong>${datosCliente.totalRegistros || 0}</strong> veces la tarjeta RFID`,
                                                        icon: 'success'
                                                    }).then(() => window.location.href = '/VentaPublicoGeneral/ClientePublicoGeneral');
                                                } else {
                                                    Swal.fire('Error', 'Error al guardar los datos: ' + response2.ErrorMessage, 'error');
                                                }
                                            });
                                        } else {
                                            Swal.fire('Error', 'Error al obtener total de cambios RFID: ' + r2.ErrorMessage, 'error');
                                        }
                                    });
                                } else {
                                    Swal.fire('Error', 'Error al guardar el histórico RFID: ' + response.ErrorMessage, 'error');
                                }
                            });
                        }
                    } else {
                        Swal.fire("Error", "Error al cargar los Datos del Cliente: " + r.ErrorMessage, "error");
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