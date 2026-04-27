$(document).ready(function () {
    // Configuración de DataTable
    var table = $("#tablaBajasEmpleado").DataTable({
        data: [],
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            {
                data: null,
                title: 'Nombre Completo',
                render: function (data, type, row) {
                    if (type === 'sort') {
                        return row.apellidoPaterno;
                    }
                    return row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombre;
                }
            },
            { data: 'nss', title: 'NSS' },
            { data: 'telefono', title: 'Telefono' },
            {
                data: 'fechaContratacion',
                title: 'Fecha de Contratacion',
                render: function (data) {
                    if (data) {
                        return data.split('T')[0];
                    }
                    return data;
                }
            },
            {
                data: null,
                title: "Acciones",
                render: function (data, type, row) {
                    var nombreCompleto = row.apellidoPaterno + ' ' + row.apellidoMaterno + ' ' + row.nombre;
                    var nombreEscapado = nombreCompleto.replace(/'/g, "\\'").replace(/"/g, '\\"');
                    return '<button class="btn btn-sm btn-success" onclick="RecontratarEmpleado(' + row.id + ', \'' + nombreEscapado + '\')">' +
                        '<i class="fa fa-user-plus"></i> Recontratar</button>';
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

    GetAllBajasEmpleados();
});

function GetAllBajasEmpleados() {
    GetMVC("/Empleado/GetAllBajasEmpleado", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tablaBajasEmpleado", r.Response);
        } else {
            swal("Error", "Error al cargar los empleados: " + r.ErrorMessage, "error");
        }
    });
}

function RecontratarEmpleado(id, nombreCompleto) {
    swal({
        title: 'Recontratar empleado',
        text: 'Deseas recontratar a ' + nombreCompleto,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, recontratar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {

            GetMVC('/Empleado/RecontratarEmpleado?id=' + id, function (r) {
                // Cerrar el mensaje de carga
                swal.close();

                setTimeout(function () {
                    if (r.IsSuccess) {
                        console.log(r.Response);
                        var respuesta = r.Response;

                        // Verificar si excedió el límite de recontrataciones
                        if (respuesta.totalBajas > 3) {
                            swal({
                                title: "Error de Contratacion",
                                text: nombreCompleto + " ha excedido el limite de recontrataciones (maximo 3).",
                                type: "error",
                                confirmButtonText: 'OK'
                            }, function () {
                                GetAllBajasEmpleados();
                            });
                        } else {
                            swal({
                                title: "Recontratacion exitosa",
                                text: nombreCompleto + " ha sido recontratado correctamente.",
                                type: "success",
                                confirmButtonText: 'OK'
                            }, function () {
                                window.location.reload();
                            });
                        }
                    } else {
                        swal({
                            title: "Error",
                            text: r.ErrorMessage || "No se pudo completar la recontratacion.",
                            type: "error",
                            confirmButtonText: 'OK'
                        });
                    }
                }, 500);
            });
        }
    });
}