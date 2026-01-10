$(document).ready(function () {
    // Configuración de DataTable
    var table = $("#tablaBajasEmpleado").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: null,
                title: 'Nombre Completo',
                render: function (data, type, row) {
                    if (type === 'sort') {
                        return row.apellidoPaterno; // Para ordenamiento
                    }
                    return `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`;
                }
            },
            { data: 'nss', title: 'NSS' },
            { data: 'nombreDepartamento', title: 'Departamento' },
            { data: 'telefono', title: 'Telefono' },
            { data: 'email', title: 'Email', visible: false },
            { data: 'diaNomina', title: 'Dia Nomina', visible: false },
            { data: 'idDepartamento', title: 'IdDepartamento', visible: false },
            { data: 'comentario', title: 'Comentario', visible: false },
            {
                data: 'fechaContratacion',
                title: 'Fecha de Contratacion',
                render: function (data) {
                    if (data) {
                        return data.split('T')[0]; // Solo la fecha
                    }
                    return data;
                }
            },
            {
                data: null, // Columna de acciones
                title: "Acciones",
                render: function (data, type, row) {
                    return `
                        <input 
                            type="button" 
                            value="Recontratar" 
                            class="btn btn-success btn-lg-custom btn-recontratar" 
                            data-id="${row.id}"
                            data-nombre="${row.apellidoPaterno}"
                            data-apellido-materno="${row.apellidoMaterno}"
                            data-apellido-paterno="${row.nombre}"
                        />
                    `;
                }
            }
        ],
        // Orden inicial: por departamento y apellido paterno
        order: [[3, 'asc'], [1, 'asc']],
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
                "sortAscending": ": activar para ordenar de manera ascendente",
                "sortDescending": ": activar para ordenar de manera descendente"
            }
        }
    });

    // Event listener para los botones de recontratar
    $('#tablaBajasEmpleado').on('click', '.btn-recontratar', function () {
        var btn = $(this);
        var id = btn.data('id');
        var apellidoPaterno = btn.data('apellido-paterno');
        var apellidoMaterno = btn.data('apellido-materno');
        var nombre = btn.data('nombre');
        var numRecontrataciones = btn.data('recontrataciones');

        var nombreCompleto = `${apellidoPaterno} ${apellidoMaterno} ${nombre}`;

        RecontratarEmpleado(id, nombreCompleto, numRecontrataciones);
    });

    GetAllBajasEmpleados();
});

function GetAllBajasEmpleados() {
    GetMVC("/Empleado/GetAllBajasEmpleado", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tablaBajasEmpleado", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los empleados: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function RecontratarEmpleado(id, nombreCompleto) {

    Swal.fire({
        title: 'Recontratar empleado',
        html: `Deseas recontratar a <strong>${nombreCompleto}</strong>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Si, recontratar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {7
            // GET hacia el controlador, enviando ID como parámetro
            GetMVC('/Empleado/RecontratarEmpleado?id=' + id, function (r) {
                if (r.IsSuccess) {
                    console.log(r.Response);
                    respuesta = r.Response;

                    if (respuesta.totalBajas > 3) {
                        Swal.fire({
                            title: 'Error de Contratacion',
                            html: `<strong>${nombreCompleto}</strong> ha excedido el limite de recontrataciones.`,
                            icon: 'error',
                            confirmButtonText: 'Aceptar'
                        }).then(() => {
                            // Recargar la tabla de bajas para reflejar el cambio
                            GetAllBajasEmpleados();
                        });
                    } else {
                        Swal.fire({
                            title: 'Recontratacion exitosa',
                            html: `<strong>${nombreCompleto}</strong> ha sido recontratado correctamente.`,
                            icon: 'success',
                                confirmButtonText: 'Aceptar'
                            }).then(() => {
                            // Recargar la tabla de bajas para reflejar el cambio
                            GetAllBajasEmpleados();
                        });
                    }
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: r.ErrorMessage || 'No se pudo completar la recontratacion.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}
