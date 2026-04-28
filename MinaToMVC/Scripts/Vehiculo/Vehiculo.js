$(document).ready(function () {
    // Validación del formulario
    $("#frmVehiculoCrud").validate({
        rules: {
            Placa: "required",
            Color: "required",
            Estado: "required"
        },
        messages: {
            Placa: "Por favor ingrese la placa",
            Color: "Por favor ingrese el color",
            Estado: "Por favor seleccione un estado"
        },
        errorElement: "span",
        errorClass: "help-block",
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        }
    });

    // Datos en la tabla
    $("#tblvehiculo").DataTable({
        data: [],
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        responsive: true,
        autoWidth: false,
        pageLength: 10,
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "tipoVehiculo.nombre", title: "Vehículo" },
            { data: "placa", title: "Placas" },
            { data: "color", title: "Color" },
            { data: "comentario", title: "Comentario" },
            {
                data: "estado",
                title: "Estado",
                render: function (valor) {
                    if (valor == 'En patio') {
                        return '<span class="estado-indicador"><span class="estado-circulo" style="background-color: #28a745;"></span> En Patio</span>';
                    } else if (valor == 'En viaje') {
                        return '<span class="estado-indicador"><span class="estado-circulo" style="background-color: #ffc107;"></span> En Viaje</span>';
                    } else if (valor == 'En taller') {
                        return '<span class="estado-indicador"><span class="estado-circulo" style="background-color: #dc3545;"></span> En Taller</span>';
                    } else {
                        return '<span class="estado-indicador"><span class="estado-circulo" style="background-color: #6c757d;"></span> Sin estado</span>';
                    }
                }
            },
            {
                data: "estatus",
                visible: false,
                title: "Estatus",
                render: function (data) {
                    if (data == 1) {
                        return '<span class="label label-success"><i class="fa fa-check"></i> Activo</span>';
                    } else {
                        return '<span class="label label-danger"><i class="fa fa-times"></i> Inactivo</span>';
                    }
                }
            },
            {
                data: "id",
                title: "Acciones",
                orderable: false,
                render: function (data) {
                    return '<button class="btn btn-info btn-sm btnEditar" data-id="' + data + '" title="Editar">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-danger btn-sm btnEliminar" data-id="' + data + '" title="Eliminar">' +
                        '<i class="fa fa-trash"></i> Eliminar</button>';
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": '<i class="fa fa-list"></i> Mostrar _MENU_ entradas',
            "zeroRecords": '<i class="fa fa-info-circle"></i> No se encontraron resultados',
            "emptyTable": '<i class="fa fa-database"></i> Ningún dato disponible en esta tabla',
            "info": '<i class="fa fa-info-circle"></i> Mostrando _START_ a _END_ de _TOTAL_ entradas',
            "infoEmpty": '<i class="fa fa-info-circle"></i> Mostrando 0 a 0 de 0 entradas',
            "infoFiltered": '<i class="fa fa-filter"></i> (filtrado de un total de _MAX_ entradas)',
            "search": '<i class="fa fa-search"></i> Buscar:',
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i> Primero',
                "last": '<i class="fa fa-fast-forward"></i> Último',
                "next": '<i class="fa fa-forward"></i> Siguiente',
                "previous": '<i class="fa fa-backward"></i> Anterior'
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    // Eventos delegados para los botones
    $(document).on('click', '.btnEditar', function () {
        var id = $(this).data('id');
        EditarVehiculo(id);
    });

    $(document).on('click', '.btnEliminar', function () {
        var id = $(this).data('id');
        EliminarVehiculo(id);
    });

    GetAllVehiculo();
});

function EliminarVehiculo(id) {
    swal({
        title: "Eliminar Registro",
        text: "¿Desea eliminar el siguiente registro?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            swal({
                title: "Eliminado",
                text: "El vehículo ha sido eliminado.",
                type: "success",
                confirmButtonText: "Aceptar"
            }, function () {
                window.location.href = '/Taller/Vehiculos';
            });
            window.location.href = '/Taller/Vehiculos';
            PostMVC('/Vehiculo/EliminarVehiculo', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El vehículo ha sido eliminado.",
                        type: "success",
                        confirmButtonText: "Aceptar"
                    }, function () {
                        window.location.href = '/Taller/Vehiculos';
                    });
                } else {
                    swal({
                        title: "Error",
                        text: r.ErrorMessage || "Error al eliminar el vehículo",
                        type: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            });
        }
    });
}

function SaveOrUpdateVehiculo() {
    if ($("#frmVehiculoCrud").valid()) {
        var parametro = {
            Id: $("#Id").val() || 0,
            Placa: $("#txtPlaca").val(),
            Color: $("#txtColor").val(),
            Estado: $("#txtEstado").val(),
            Comentario: $("#txtComentario").val(),
            TipoVehiculo: {
                Id: $("#TipoVehiculo_Id").val()
            },
            Estatus: 1,
            CreatedBy: $("#CreatedBy").val(),
            CreatedDt: $("#CreatedDt").val(),
            UpdatedBy: $("#UpdatedBy").val(),
            UpdatedDt: $("#UpdatedDt").val()
        };
        LimpiarFormulario();
        swal({
            title: "Registro guardado!",
            text: "El registro se ha guardado correctamente.",
            type: "success",
            confirmButtonText: "OK"
        }, function () {
            window.location.reload();
        });
        PostMVC('/Vehiculo/SaveOrUpdateVehiculo', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                swal({
                    title: "Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: "OK"
                }, function () {
                    window.location.reload();
                });
            } else {
                swal({
                    title: "Error",
                    text: "Error al guardar los datos: " + r.ErrorMessage,
                    type: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        });
    }
}

function GetAllVehiculo() {
    GetMVC("/Vehiculo/GetAllVehiculo", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblvehiculo", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar los vehículos: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: "Aceptar"
            });
        }
    });
}

function EditarVehiculo(id) {
    location.href = "/Taller/Vehiculos/" + id;
}

function LimpiarFormulario() {
    $("#frmVehiculoCrud")[0].reset();
    $("#frmVehiculoCrud").validate().resetForm();
    $('.form-group').removeClass('has-error');
}