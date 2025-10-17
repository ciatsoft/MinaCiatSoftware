let preservandoSelecciones = false;

$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmViajesInternos").validate({
        rules: {
            "dtpFechaViaje": {
                required: true
            },
            "txtObservaciones": {
                required: true
            }
        },
        messages: {
            "dtpFechaViaje": {
                required: "El campo 'Fecha del viaje' es requerido.",
            },
            "txtObservaciones": {
                required: "El campo 'Observaciones' es requerido.",
            }
        }
    });
});


$(document).ready(function () {

    // Asignar el mismo event listener a todos los dropdowns
    $("#ddlCliente, #ddlTipoMaterial, #ddlDireccionesCliente").change(manejarTodosLosCambios);

    // Inicialización de la tabla de viajes locales con formato
    $("#tblViajesLocales").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "folio", "visible": false, title: "Folio" },
            { data: "ubicacionOrigen.nombreUbicacion", title: "Origen" },
            { data: "transportista.nombre", title: "Transportista" },
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },
            { data: "vehiculo.placa", title: "Vehículo" },
            { data: "cliente.nombre", title: "Cliente" },
            { data: "unidadMedida.nombre", title: "Unidad de Medida" },
            {
                data: "fechaViaje",
                title: "Fecha de transporte",
                render: function (data, type, row) {
                    if (data) {
                        var date = new Date(data);
                        var day = ("0" + date.getDate()).slice(-2);
                        var month = ("0" + (date.getMonth() + 1)).slice(-2);
                        var year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    }
                    return "";
                }
            },
            { data: "observaciones", title: "Observaciones" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarViajeLocal(' + data + ', this)" />' +
                        '<input type="button" value="Imprimir" class="btn btn-custom-clean" style="background-color: yellow; border:none; color: black; padding: 7px 10px; border - radius: 5px; cursor: pointer; "  onclick="ImprimirReporte(' + data + ', this)" />';
                }
            }

        ],
        order: [0, 'desc'],
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


    GetAllViajeLocal(); // Llamada a la función para cargar todos los viajes locales

    // Cargar el registro en caso de edición
    if (viajeLocalJson.Id != 0) {

        console.log("Datos recibidos: " + JSON.stringify(viajeLocalJson));
        $("#txtViajeinterno").val(viajeLocalJson.Id);
        $("#ddlUOrigen").val(viajeLocalJson.UbicacionOrigen.Id);
        $("#ddlDireccionesCliente").val(viajeLocalJson.DireccionDestino.Id);
        $("#ddlTipoMaterial").val(viajeLocalJson.TipoMaterial.Id);
        $("#ddlTransportistas").val(viajeLocalJson.Transportista.Id);
        $("#ddlVehiculo").val(viajeLocalJson.Vehiculo.Id);
        $("#ddlCliente").val(viajeLocalJson.Cliente.Id).prop('disabled', true);
        $("#dtpFechaViaje").val(viajeLocalJson.FechaViaje.substring(0, 10));
        $("#txtObservaciones").val(viajeLocalJson.Observaciones);
        $("#totalKMRecorridos").val(viajeLocalJson.KilometrosRecorridos);
        $("#totalImporte").val(viajeLocalJson.TotalImporte);
        $("#Folio").val(viajeLocalJson.Folio);

        actualizarTiposDeMaterial(viajeLocalJson.Cliente.Id);
        ObtenerDireccionCliente(viajeLocalJson.Cliente.Id);

        // Mostrar botón de eliminar y ocultar el de guardar
        $("#btnEliminar").show();
        $("#btnGuardar").show();
    } else {
        // Si el ID es 0 (nuevo registro)
        $("#btnEliminar").hide();
        $("#btnGuardar").show();
    }
});

function manejarTodosLosCambios() {
    if (preservandoSelecciones) return;

    // Obtener todos los IDs actuales
    var clienteId = $("#ddlCliente").val();
    var tipoMaterialId = $("#ddlTipoMaterial").val();
    var direccionId = $("#ddlDireccionesCliente").val();

    // Determinar qué elemento disparó el cambio
    var elementoCambiado = $(this).attr('id');

    // Lógica de actualizaciones en cadena
    if (elementoCambiado === 'ddlCliente' && clienteId && clienteId !== "") {
        // Guardar selecciones actuales ANTES de actualizar
        var materialSeleccionado = $("#ddlTipoMaterial").val();
        var direccionSeleccionada = $("#ddlDireccionesCliente").val();

        // Actualizar tipos de material cuando cambia el cliente
        actualizarTiposDeMaterial(clienteId, materialSeleccionado);

        // Actualizar direcciones del cliente
        ObtenerDireccionCliente(clienteId, direccionSeleccionada);
    }

    // Ejecutar cálculo de kilometraje e importe cuando tengamos todos los datos necesarios
    if (clienteId && direccionId && tipoMaterialId) {
        ObtenerKilometrajeImporte(clienteId, tipoMaterialId, direccionId);
    }
}

// Función para guardar o actualizar
function SaveOrUpdateViajeLocal() {
    if ($("#frmViajesInternos").valid()) {
        // Se construye el objeto de parámetros para el viaje local
        var parametro = {
            Id: $("#txtViajeinterno").val(),
            UbicacionOrigen: { Id: $("#ddlUOrigen").val() },
            Transportista: { Id: $("#ddlTransportistas").val() },
            TipoMaterial: { Id: $("#ddlTipoMaterial").val() },
            DireccionDestino: { Id: $("#ddlDireccionesCliente").val() },
            Vehiculo: { Id: $("#ddlVehiculo").val() },
            Cliente: { Id: $("#ddlCliente").val() },
            UnidadMedida: { Id: $("#ddlUnidadM").val() },
            FechaViaje: $("#dtpFechaViaje").val(),
            Observaciones: $("#txtObservaciones").val(),
            Estatus: true,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val(),
            Folio: $("#Folio").val(),
            KilometrosRecorridos: $("#totalKMRecorridos").val(),
            TotalImporte: $("#totalImporte").val()
        };

        // Mostrar los datos capturados en una alerta usando SweetAlert
        window.Swal.fire({
            title: 'Datos del viaje',
            html: `<strong>Origen:</strong> ${$("#ddlUOrigen option:selected").text()}<br/>
                   <strong>Transportista:</strong> ${$("#ddlTransportistas option:selected").text()}<br/>
                   <strong>Material:</strong> ${$("#ddlTipoMaterial option:selected").text()}<br/>
                   <strong>Vehículo:</strong> ${$("#ddlVehiculo option:selected").text()}<br/>
                   <strong>Cliente:</strong> ${$("#ddlCliente option:selected").text()}<br/>
                   <strong>Direccion Destino:</strong> ${$("#ddlDireccionesCliente option:selected").text()}<br/>
                   <strong>Unidad de Medida:</strong> ${$("#ddlUnidadM option:selected").text()}<br/>
                   <strong>Fecha del Viaje:</strong> ${$("#dtpFechaViaje").val()}<br/>
                   <strong>Kilometraje Aproximado Recorrido:</strong> ${$("#totalKMRecorridos").val()}<br/>
                   <strong>Importe Total:</strong> ${$("#totalImporte").val()}<br/>
                   <strong>Observaciones:</strong> ${$("#txtObservaciones").val()}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirmar y Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                PostMVC("/Viajes/SaveOrUpdateViajeLocal", parametro, function (r) {
                    if (r.IsSuccess) {
                        window.location.href = '/Viajes/Concreteras';
                    } else {
                        window.Swal.fire('Error', 'Error al guardar los datos: ' + r.response.ErrorMessage, 'error');
                    }
                });
            }
            window.location.href = '/Viajes/Concreteras';
        });
    } else {
        window.Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios.', 'warning');
    }
}

// Función para eliminar con confirmación y estructura de mensajes de SweetAlert
function EliminarViajeLocal() {
    Swal.fire({
        title: '¿Estas seguro?',
        text: "¿Desea eliminar el siguiente registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var id = $("#txtViajeinterno").val();

            // Cambiar a GET y enviar el ID en la URL
            GetMVC('/Viajes/DeleteViajeLocal?id=' + id, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El registro ha sido eliminado.', 'success')
                        .then(() => {
                            window.location.href = '/Viajes/Concreteras';
                        });
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
                }
            });
        }
    });
}

// Función para editar con estilo de redireccionamiento 
function EditarViajeLocal(id) {
    actualizarTiposDeMaterial();
    location.href = "/Viajes/Concreteras/" + id;
    console.log(id);
}
function ImprimirReporte(id) {
    window.open("http://localhost:57871/RptViajesLocales.aspx?id=" + id, '_blank');
    console.log(id);
}

// Función para limpiar el formulario con estilo uniforme
function LimpiarFormulario() {
    $("#txtidtipomaterial").val('');
    $("#txtNombreTipoMaterial").val('');
    $("#txtDescripcionTipoMaterial").val('');
    $("#ddlUbicacion").val('');
    $("#ddlUnidadDeMedida").val('');
    $("#chbEstatus").prop('checked', false);
}

// Función para obtener todos los tipos de material
function GetAllViajeLocal() {
    GetMVC("/Viajes/GetAllViajeLocal", function (r) {
        if (r.IsSuccess) {

            // Filtrar los datos donde cliente.tipoCliente sea igual a 1
            const datosFiltrados = r.Response.filter(item => item.cliente && item.cliente.tipoCliente === 0);

            MapingPropertiesDataTable("tblViajesLocales", datosFiltrados);
        } else {
            alert("Error al cargar los viajes: " + r.ErrorMessage);
        }
    });
}

function actualizarTiposDeMaterial(id, seleccionPrevia = null) {
    var ubicacionId = $("#ddlCliente").val() || id;

    // Realizar una llamada AJAX al controlador para obtener los tipos de material
    $.ajax({
        url: '/Viajes/GetTipoMaterialByCliente',
        type: 'GET',
        data: { id: ubicacionId },
        success: function (response) {
            response = JSON.parse(response);
            if (response.IsSuccess) {
                // Activar bandera para prevenir cambios no deseados
                preservandoSelecciones = true;

                // Limpiar el DDL de "Tipo de Material"
                $("#ddlTipoMaterial").empty();

                // Agregar la opción principal deshabilitada
                $("#ddlTipoMaterial").append("<option value='' disabled selected>Selecciona una opcion</option>");

                // Llenar el DDL con los nuevos tipos de material
                $.each(response.Response, function (index, item) {
                    var templateoption = "<option value='" + item.tipoMaterial.id + "'>" + item.tipoMaterial.nombreTipoMaterial + "</option>";
                    $("#ddlTipoMaterial").append(templateoption);
                });

                // Restaurar selección previa si existe y está disponible
                if (seleccionPrevia && seleccionPrevia !== "") {
                    setTimeout(function () {
                        if ($("#ddlTipoMaterial option[value='" + seleccionPrevia + "']").length > 0) {
                            $("#ddlTipoMaterial").val(seleccionPrevia);
                        }
                        preservandoSelecciones = false;
                    }, 50);
                } else {
                    preservandoSelecciones = false;
                }
            }
        },
        error: function (xhr, status, error) {
            console.log("Error al obtener los tipos de material:", error);
            preservandoSelecciones = false;
        }
    });
}

function ObtenerDireccionCliente(id, seleccionPrevia = null) {
    var dropdown = $("#ddlDireccionesCliente");

    // Activar bandera para prevenir cambios no deseados
    preservandoSelecciones = true;

    // Limpiar dropdown completamente
    dropdown.empty();

    // Agregar opción por defecto
    dropdown.append($('<option></option>')
        .val("")
        .text("Selecciona una opcion")
        .prop('disabled', true)
        .prop('selected', true));

    if (!id) {
        preservandoSelecciones = false;
        return;
    }

    GetMVC(`/Viajes/ObtenerDireccionCliente?id=${id}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            // Verificar si hay direcciones
            if (r.Response && r.Response.length > 0) {
                // Agregar cada dirección como opción
                $.each(r.Response, function (index, direccion) {
                    var texto = `${direccion.calle}, ${direccion.municipio}, ${direccion.estado}`;
                    var option = $('<option></option>')
                        .val(direccion.id)
                        .text(texto);
                    dropdown.append(option);
                });

                // Restaurar selección previa si existe y está disponible
                if (seleccionPrevia && seleccionPrevia !== "") {
                    setTimeout(function () {
                        if (dropdown.find("option[value='" + seleccionPrevia + "']").length > 0) {
                            dropdown.val(seleccionPrevia);
                        }
                        preservandoSelecciones = false;
                    }, 50);
                } else {
                    preservandoSelecciones = false;
                }
            } else {
                dropdown.append($('<option></option>')
                    .val("")
                    .text("No hay direcciones disponibles"));
                preservandoSelecciones = false;
            }
        } else {
            alert("Error al cargar las direcciones del cliente: " + r.ErrorMessage);
            dropdown.append($('<option></option>')
                .val("")
                .text("Error al cargar direcciones"));
            preservandoSelecciones = false;
        }
    });
}

function ObtenerKilometrajeImporte(idCliente, idTipoMaterial, idDireccion) {
    console.log(idCliente);
    console.log(idTipoMaterial);
    console.log(idDireccion);
    GetMVC(`/Viajes/GetPrecioActivoClienteTipoMaterialByDireccionMaterialAndCliente?idCliente=${idCliente}&idTipoMaterial=${idTipoMaterial}&idDireccion=${idDireccion}`, function (r, textStatus, jqXHR) {
        if (r.IsSuccess) {
            var data = r.Response;

            // Verifica si la respuesta es un arreglo
            if (Array.isArray(data) && data.length > 0) {
                var item = data[0]; // Tomamos el primer objeto del arreglo

                // Asignamos los valores a los inputs
                $("#totalKMRecorridos").val(item.total_KM_Recorridos);
                $("#totalImporte").val(item.total_Gastos);

            } else {
                alert("No se ha configurado algun precio especidifo para este filtro.");
                // Bloquear el botón
                document.getElementById('btnGuardar').disabled = true;
            }
        } else {
            alert("Error al cargar los datos: " + r.ErrorMessage);
        }
    });
}

