    $(document).ready(function () {
        $("#frmVehiculoPublicoGral").validate({
            rules: {
                "nombre": "required",
                "capacidad": "required",
                "ddlClientes": "required",
                "color": "required",
                "placa": "required",
            },
            messages: {
                "nombre": "El nombre es obligatorio.",
                "capacidad": "La capacidad es obligatoria",
                "ddlClientes": "Selecciona un Cliente",
                "color": "El color es obligatorio",
                "placa": "La placa es obligatoria",
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
            columns: [
                { data: "id", visible: true, title: "Id" },
                { data: "nombre", title: "Nombre" },
                { data: "capacidad", title: "Capacidad" },
                { data: "clienteID.nombre", title: "Nombre del Cliente" },
                { data: "color", title: "Color" },
                { data: "placa", title: "Placa" },
                {
                    data: "id",
                    title: "Acciones",
                    render: function (data) {
                        return `
                    <input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarVehiculoPublicoGral(${data})" />
                    <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarVehiculoPublicoGral(${data})" />
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
                emptyTable: "Ningún dato disponible en esta tabla",
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
            Swal.fire("Error", "Error al cargar los préstamos: " + r.ErrorMessage, "error");
        }
    });
}

function SaveOrUpdateVehiculosPublicoGral() {
    if ($("#frmVehiculoPublicoGral").valid()) {
        var parametro = {
            Id: $("#id").val(),
            nombre: $("#nombre").val(),
            capacidad: $("#capacidad").val(),
            ClienteID: { Id: $("#ddlClientes").val() },
            color: $("#color").val(),
            placa: $("#placa").val(),
            Estatus: 1,
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#CreatedDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#UpdatedDt").val()
        };

        var isUpdating = parametro.Id && parametro.Id != 0;
        Swal.fire({
            title: isUpdating ? '¿Desea actualizar el registro?' : '¿Desea guardar el nuevo registro?',
            html: `<strong>Id:</strong> ${parametro.Id}<br/>
                   <strong>Nombre:</strong> ${parametro.nombre}<br/> 
                   <strong>Capacidad:</strong> ${parametro.capacidad}<br/> 
                   <strong>Cliente:</strong> ${parametro.ClienteID.Id}<br/> 
                   <strong>Color:</strong> ${parametro.color}<br/>
                   <strong>Placa:</strong> ${parametro.placa}<br/>`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: isUpdating ? 'Actualizar' : 'Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                PostMVC("/Catalog/SaveOrUpdateVehiculosPublicoGral", parametro, function (success, response) {
                    if (success) {
                        Swal.fire('Éxito', isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.', 'success')
                            .then(() => window.location.href = '/Catalog/VehiculosPublicoGeneral');
                    } else {
                        Swal.fire('Error', 'Error al guardar los datos: ' + response.ErrorMessage, 'error');
                    }
                });
            }
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios.', 'warning');
    }
}

function EditarVehiculoPublicoGral(id) {
    window.location.href = "/Catalog/VehiculosPublicoGeneral/" + id;
}

function EliminarVehiculoPublicoGral(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el vehiculo del cliente.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            PostMVC('/Catalog/DeleteVehiculosPublicoGral', { id: id }, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('¡Eliminado!', 'El vehiculo del cliente ha sido eliminado.', 'success')
                        .then(() => window.location.href = '/Catalog/VehiculosPublicoGeneral');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}
