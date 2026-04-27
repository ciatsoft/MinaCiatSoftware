$(document).ready(function () {
    // Validación del formulario
    $("#frmtipovehiculo").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
            "txtCapacidad": "required"
        },
        messages: {
            txtNombre: "El nombre del vehículo es requerido",
            txtDescripcion: "La descripción es requerida",
            txtCapacidad: "La capacidad del vehículo es requerida"
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        }
    });

    // Configuración de la tabla
    $("#tblTipoVehiculo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripción" },
            { data: "capacidad", title: "Capacidad (m³)" },
            {
                data: "estatus",
                visible: false,
                title: "Estatus",
                render: function (data) {
                    return data == 1 ? '<span class="label label-success">Activo</span>' : '<span class="label label-danger">Inactivo</span>';
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return '<button class="btn btn-sm btn-primary" onclick="EditarTipoVehiculo(' + data + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarTVehiculo(' + data + ')">' +
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
            "emptyTable": "Ningún dato disponible en esta tabla",
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

    // Carga inicial de datos
    GetAllTipoVehiculo();

    // Si se va a editar un registro, llenar los campos
    if (tVehiculoJson && tVehiculoJson.Id && tVehiculoJson.Id !== 0) {
        $("#txtidtipovehiculo").val(tVehiculoJson.Id);
        $("#txtNombre").val(tVehiculoJson.Nombre);
        $("#txtCapacidad").val(tVehiculoJson.Capacidad);
        $("#txtDescripcion").val(tVehiculoJson.Descripcion);
        $("#chbEstatus").prop('checked', tVehiculoJson.Estatus);
        // Actualizar el label del estatus
        if (typeof updateEstatusLabel === 'function') {
            updateEstatusLabel();
        }
    }
});

// Función para guardar o actualizar tipo de vehículo
function SaveOrUpdateTipoVehiculo() {
    // Validación manual de campos requeridos
    var nombre = $("#txtNombre").val();
    var descripcion = $("#txtDescripcion").val();
    var capacidad = $("#txtCapacidad").val();

    if (!nombre || nombre.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor ingrese el nombre del vehículo.",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!descripcion || descripcion.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor ingrese una descripción.",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!capacidad || capacidad.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor ingrese la capacidad del vehículo.",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if ($("#frmtipovehiculo").valid()) {
        var parametro = {
            Id: $("#txtidtipovehiculo").val() || 0,
            Nombre: nombre,
            Descripcion: descripcion,
            Capacidad: parseFloat(capacidad),
            Estatus: 1,
            CreatedDt: $("#txtCreatedDt").val()
        };

        console.log("Enviando parámetro:", parametro);

        PostMVC('/Catalog/SaveOrUpdateTipoVehiculo', parametro, function (r) {
            if (r.IsSuccess) {
                swal({
                    title: "¡Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.href = '/Catalog/TipoVehiculo';
                });
            } else {
                swal({
                    title: "Error",
                    text: "Error al guardar los datos: " + r.ErrorMessage,
                    type: "error",
                    confirmButtonText: 'OK'
                });
            }
        });
    }
}

// Función para eliminar tipo de vehículo
function EliminarTVehiculo(id) {
    swal({
        title: '¿Está seguro?',
        text: "¿Desea eliminar el tipo de vehículo?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            swal({
                title: "Eliminado",
                text: "El tipo de vehículo ha sido eliminado correctamente.",
                type: "success",
                confirmButtonText: 'OK'
            });
            window.location.href = '/Catalog/TipoVehiculo';
            PostMVC('/Catalog/DeleteTipoVehiculo', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El tipo de vehículo ha sido eliminado correctamente.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/TipoVehiculo';
                    });
                } else {
                    swal({
                        title: "Error",
                        text: "Error al eliminar el tipo de vehículo: " + r.ErrorMessage,
                        type: "error",
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}

// Redirección al editar
function EditarTipoVehiculo(id) {
    console.log("Editar ID recibido:", id);
    location.href = "/Catalog/TipoVehiculo/" + id;
}

// Limpieza del formulario
function LimpiarFormulario() {
    $("#txtidtipovehiculo").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
    $("#txtCapacidad").val('');
    $("#chbEstatus").prop('checked', false);
    if (typeof updateEstatusLabel === 'function') {
        updateEstatusLabel();
    }
}

// Obtención de todos los registros
function GetAllTipoVehiculo() {
    GetMVC("/Catalog/GetAllTipoVehiculo", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblTipoVehiculo", r.Response);
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