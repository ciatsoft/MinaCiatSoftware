﻿$(function () {
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



    // Inicialización de la tabla de viajes locales con formato
    $("#tblViajesLocales").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "folio", title: "Folio" },
            { data: "ubicacionOrigen.nombreUbicacion", title: "Origen" },
            { data: "clienteVI.nombre", title: "Cliente" },
            { data: "transportista.nombre", title: "Transportista" },
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },
            { data: "vehiculo.placa", title: "Vehículo" },
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
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarViajeInterno(' + data + ')" />';
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


    GetAllViajeInterno(); // Llamada a la función para cargar todos los viajes locales

    // Cargar el registro en caso de edición
    if (viajeInternoJson.Id != 0) {

        console.log("Datos recibidos: " + JSON.stringify(viajeInternoJson));
        $("#txtViajeinterno").val(viajeInternoJson.Id);
        $("#ddlUOrigen").val(viajeInternoJson.UbicacionOrigen.Id);
        $("#dllcliente").val(viajeInternoJson.ClienteVI.Id);
        $("#ddlTipoMaterial").val(viajeInternoJson.TipoMaterial.Id);
        $("#ddlTransportistas").val(viajeInternoJson.Transportista.Id);
        $("#ddlVehiculo").val(viajeInternoJson.Vehiculo.Id);
        $("#dtpFechaViaje").val(viajeInternoJson.FechaViaje.substring(0, 10));
        $("#txtObservaciones").val(viajeInternoJson.Observaciones);
        // Mostrar botón de eliminar y ocultar el de guardar
        $("#btnEliminar").show();
        $("#btnGuardar").show();
    } else {
        // Si el ID es 0 (nuevo registro)
        $("#btnEliminar").hide();
        $("#btnGuardar").show();
    }
});

// Función para guardar o actualizar
// Función para guardar o actualizar el viaje interno
function SaveOrUpdateViajeInterno() {
    if ($("#frmViajesInternos").valid()) {
        // Se construye el objeto de parámetros para el viaje interno
        var parametro = {
            Id: $("#txtViajeinterno").val(),
            UbicacionOrigen: { Id: $("#ddlUOrigen").val() },
            ClienteVI: { Id: $("#dllcliente").val() },
            Transportista: { Id: $("#ddlTransportistas").val() },
            TipoMaterial: { Id: $("#ddlTipoMaterial").val() },
            Vehiculo: { Id: $("#ddlVehiculo").val() },
            FechaViaje: $("#dtpFechaViaje").val(),
            Observaciones: $("#txtObservaciones").val(),
            Estatus: true,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val(),
            Folio: $("#Folio").val()
        };

        // Mostrar los datos capturados en una alerta usando SweetAlert
        Swal.fire({
            title: 'Datos del viaje',
            html: `<strong>Origen:</strong> ${$("#ddlUOrigen option:selected").text()}<br/>
                   <strong>Cliente:</strong> ${$("#ddlcliente option:selected").text()}<br/>
                   <strong>Transportista:</strong> ${$("#ddlTransportistas option:selected").text()}<br/>
                   <strong>Material:</strong> ${$("#ddlTipoMaterial option:selected").text()}<br/>
                   <strong>Vehículo:</strong> ${$("#ddlVehiculo option:selected").text()}<br/>
                   <strong>Unidad de Medida:</strong> ${$("#ddlUnidadM option:selected").text()}<br/>
                   <strong>Fecha del Viaje:</strong> ${$("#dtpFechaViaje").val()}<br/>
                   <strong>Observaciones:</strong> ${$("#txtObservaciones").val()}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirmar y Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar los datos al servidor para guardar o actualizar el viaje
                PostMVC("/Viajes/SaveOrUpdateViajeInterno", parametro, function (r) {
                    if (r.IsSuccess) {
                    } else {
                        Swal.fire('Error', 'Error al guardar los datos: ' + r.response.ErrorMessage, 'error');
                    }
                });
            }
            window.location.href = '/Viajes/Internos';
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios.', 'warning');
    }
}


// Función para eliminar con confirmación y estructura de mensajes de SweetAlert
function EliminarViajeInterno() {
    var valid = true;
    $(".required").each(function () {
        if ($(this).val() === "") {
            valid = false;
            $(this).addClass("is-invalid");
        } else {
            $(this).removeClass("is-invalid");
        }
    });

    if (valid) {
        // Se construye el objeto de parámetros para el viaje local
        var parametro = {
            Id: $("#txtViajeinterno").val(),
            UbicacionOrigen: { Id: $("#ddlUOrigen").val() },
            ClienteVI: { Id: $("#dllcliente").val() },
            Transportista: { Id: $("#ddlTransportistas").val() },
            TipoMaterial: { Id: $("#ddlTipoMaterial").val() },
            Vehiculo: { Id: $("#ddlVehiculo").val() },
            UnidadMedida: { Id: $("#ddlUnidadM").val() },
            FechaViaje: $("#dtpFechaViaje").val(),
            Observaciones: $("#txtObservaciones").val(),
            Estatus: false,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val(),
            Folio: $("#Folio").val()
        };

        // Mostrar los datos capturados en una alerta usando SweetAlert
        Swal.fire({
            title: 'Confirmar eliminación',
            html: `<strong>¿Estás seguro de que deseas eliminar este viaje?</strong><br/>
                   <strong>Origen:</strong> ${$("#ddlUOrigen option:selected").text()}<br/>
                   <strong>Destino:</strong> ${$("#ddlUDestino option:selected").text()}<br/>
                   <strong>Transportista:</strong> ${$("#ddlTransportistas option:selected").text()}<br/>
                   <strong>Material:</strong> ${$("#ddlTipoMaterial option:selected").text()}<br/>
                   <strong>Vehículo:</strong> ${$("#ddlVehiculo option:selected").text()}<br/>
                   <strong>Cliente:</strong> ${$("#ddlCliente option:selected").text()}<br/>
                   <strong>Unidad de Medida:</strong> ${$("#ddlUnidadM option:selected").text()}<br/>
                   <strong>Fecha del Viaje:</strong> ${$("#dtpFechaViaje").val()}<br/>
                   <strong>Observaciones:</strong> ${$("#txtObservaciones").val()}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            window.location.href = '/Viajes/Internos';
            if (result.isConfirmed) {
                window.location.href = '/Viajes/Internos';
                // Enviar los datos al servidor para eliminar
                PostMVC("/Viajes/SaveOrUpdateViajeInterno", parametro, function (r) {
                    if (r.IsSuccess) {
                        LimpiarFormulario();
                        Swal.fire('Éxito', 'El viaje ha sido eliminado exitosamente', 'success');
                    } else {
                        Swal.fire('Error', 'Error al eliminar el viaje: ' + r.response.ErrorMessage, 'error');
                    }
                });
            }
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios antes de continuar.', 'warning');
    }
}



// Función para editar con estilo de redireccionamiento 
function EditarViajeInterno(id) {
    location.href = "/Viajes/Internos/" + id;
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
function GetAllViajeInterno() {
    GetMVC("/Viajes/GetAllViajeInterno", function (r) {
        console.log("Datos recibidos:", r); // Inspecciona la respuesta en la consola
        if (r.IsSuccess) {
            console.log("Estructura de los datos:", r.Response); // Verificar el contenido exacto de la respuesta
            MapingPropertiesDataTable("tblViajesLocales", r.Response);
        } else {
            alert("Error al cargar los viajes: " + r.ErrorMessage);
        }
    });
}


function actualizarTiposDeMaterial() {
    var ClienteId = $("#dllcliente").val(); // Obtener el ID de la ubicación seleccionada

    // Realizar una llamada AJAX al controlador para obtener los tipos de material
    $.ajax({
        url: '/Viajes/GetTipoMaterialByCliente', // Cambia esto al nombre de tu controlador y acción
        type: 'GET',
        data: { id: ClienteId }, // Enviar el ID del Cliente
        success: function (response) {
            response = JSON.parse(response);
            if (response.IsSuccess) {
                // Limpiar el DDL de "Tipo de Material"
                $("#ddlTipoMaterial").empty();

                // Llenar el DDL con los nuevos tipos de material
                $.each(response.Response, function (index, item) {
                    var templateoption = "<option value='" + item.id + "'>" + item.tipoMaterial.nombreTipoMaterial + "</option>";

                    $("#ddlTipoMaterial").append(templateoption);
                });
            }
            /*
             Else 
             Alert
             */
        },
        error: function (xhr, status, error) {
            console.log("Error al obtener los tipos de material:", error);
        }
    });
}
