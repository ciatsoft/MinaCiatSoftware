$(document).ready(function () {



    // Inicialización de la tabla de viajes locales con formato
    $("#tblViajesLocales").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", title: "Id" },
            { data: "ubicacionOrigen.nombreUbicacion", title: "Origen" },  
            { data: "ubicacionDestino.nombreUbicacion", title: "Destino" },  
            { data: "transportista.nombre", title: "Transportista" },  
            { data: "tipoMaterial.nombreTipoMaterial", title: "Material" },  
            { data: "vehiculo.placa", title: "Vehículo" },
            { data: "cliente.nombre", title: "Cliente" },
            { data: "unidadMedida.nombre", title: "Unidad de Medida" },
            { data: "fechaViaje", title: "Fecha de transporte" },
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
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarViajeLocal(' + data + ', this)" />';
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


    GetAllViajeLocal(); // Llamada a la función para cargar todos los viajes locales

    // Cargar el registro en caso de edición
    if (viajeLocalJson.Id != 0) {

        console.log("Datos recibidos: " + JSON.stringify(viajeLocalJson)); 
        $("#txtViajeinterno").val(viajeLocalJson.Id);
        $("#ddlUOrigen").val(viajeLocalJson.UbicacionOrigen.Id);
        $("#ddlUDestino").val(viajeLocalJson.UbicacionDestino.Id);
        $("#ddlTipoMaterial").val(viajeLocalJson.TipoMaterial.Id);
        $("#ddlTransportistas").val(viajeLocalJson.Transportista.Id);
        $("#ddlVehiculo").val(viajeLocalJson.Vehiculo.Id);
        $("#ddlCliente").val(viajeLocalJson.Cliente.Id);
        $("#ddlUnidadM").val(viajeLocalJson.UnidadMedida.Id);
        $("#dtpFechaViaje").val(viajeLocalJson.FechaViaje.substring(0, 10));
        $("#txtObservaciones").val(viajeLocalJson.Observaciones);
    }
});

// Función para guardar o actualizar
function SaveOrUpdateViajeLocal() {
    // Validar que los campos estén llenos
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
            UbicacionDestino: { Id: $("#ddlUDestino").val() },
            Transportista: { Id: $("#ddlTransportistas").val() },
            TipoMaterial: { Id: $("#ddlTipoMaterial").val() },
            Vehiculo: { Id: $("#ddlVehiculo").val() },
            Cliente: { Id: $("#ddlCliente").val() },
            UnidadMedida: { Id: $("#ddlUnidadM").val() },
            FechaViaje: $("#dtpFechaViaje").val(),
            Observaciones: $("#txtObservaciones").val(),
            Estatus: true,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        // Mostrar los datos capturados en una alerta usando SweetAlert
        Swal.fire({
            title: 'Datos del viaje',
            html: `<strong>Origen:</strong> ${$("#ddlUOrigen option:selected").text()}<br/>
                   <strong>Destino:</strong> ${$("#ddlUDestino option:selected").text()}<br/>
                   <strong>Transportista:</strong> ${$("#ddlTransportistas option:selected").text()}<br/>
                   <strong>Material:</strong> ${$("#ddlTipoMaterial option:selected").text()}<br/>
                   <strong>Vehículo:</strong> ${$("#ddlVehiculo option:selected").text()}<br/>
                   <strong>Cliente:</strong> ${$("#ddlCliente option:selected").text()}<br/>
                   <strong>Unidad de Medida:</strong> ${$("#ddlUnidadM option:selected").text()}<br/>
                   <strong>Fecha del Viaje:</strong> ${$("#dtpFechaViaje").val()}<br/>
                   <strong>Observaciones:</strong> ${$("#txtObservaciones").val()}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Confirmar y Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar los datos al servidor
                window.location.href = '/Viajes/Locales';
                PostMVC("/Viajes/SaveOrUpdateViajeLocal", parametro, function (r) {
                    if (r.IsSuccess) {
                        LimpiarFormulario();
                        Swal.fire('Éxito', 'Datos guardados exitosamente', 'success');
                        window.location.href = '/Viajes/Locales';
                    } else {
                        Swal.fire('Error', 'Error al guardar los datos: ' + r.response.ErrorMessage, 'error');
                    }
                });
            }
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios.', 'warning');
    }
}


// Función para eliminar con confirmación y estructura de mensajes 
function EliminarViajeLocal(id, boton) {
    // Obtener la fila correspondiente al botón de eliminación.
    var row = $(boton).closest("tr");

    // Extraer el nombre y la descripción de las celdas correspondientes.
    var nombre = row.find("td:eq(0)").text(); // Columna para el nombre
    var descripcion = row.find("td:eq(1)").text(); // Columna para la descripción
    var idUbicacion = row.find("td:eq(4)").text(); // Columna oculta para el ID de ubicación
    var idUnidadMedida = row.find("td:eq(5)").text(); // Columna oculta para el ID de unidad de medida

    // Asignar los valores de los campos ocultos que contienen el usuario y la fecha actual.
    var UpdatedBy = $("#txtUpdatedBy").val();
    var UpdatedDt = $("#txtUpdatedDt").val();

    // Confirmar la eliminación con el usuario.
    if (confirm("¿Usted desea eliminar este viaje local?\nNombre: " + nombre + "\nDescripción: " + descripcion
        + "\nID Ubicación: " + idUbicacion + "\nID Unidad de Medida: " + idUnidadMedida + "\nUsuario: " + UpdatedBy + " " + UpdatedDt)) {
        // Crear el objeto con los parámetros para enviar al servidor.
        var parametro = {
            Id: id,
            NombreTipoMaterial: nombre,
            DescripcionTipoMaterial: descripcion,
            DtoUbicacion: idUbicacion, // Añadir ID de ubicación
            UnidadMedida: idUnidadMedida, // Añadir ID de unidad de medida
            Estatus: 0,  // Se establece como inactivo.
            UpdatedBy: UpdatedBy,
            UpdatedDt: UpdatedDt
        };

        // Actualizar la navegación
        window.location.href = '/Viajes/Locales';
        // Enviar la solicitud POST usando la función `PostMVC`.
        console.log("Parámetros enviados para la eliminación:", parametro);
        PostMVC("/Viajes/SaveOrUpdateViajeLocal", parametro, function (success, response) {
            if (success) {
                alert("Tipo de material eliminado exitosamente.");
            } else {
                alert("Error al eliminar el tipo de material: " + response.ErrorMessage);
            }
        });
    }
}

// Función para editar con estilo de redireccionamiento 
function EditarViajeLocal(id) {
    location.href = "/Viajes/Locales/" + id;
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
        console.log("Datos recibidos:", r); // Inspecciona la respuesta en la consola
        if (r.IsSuccess) {
            console.log("Estructura de los datos:", r.Response); // Verificar el contenido exacto de la respuesta
            MapingPropertiesDataTable("tblViajesLocales", r.Response);
        } else {
            alert("Error al cargar los viajes: " + r.ErrorMessage);
        }
    });
}


