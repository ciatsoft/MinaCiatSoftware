$(document).ready(function () {
    // Configuración de DataTable
    $("#tblEmpleados").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: null,
                title: 'Nombre Completo',
                render: function (data, type, row) {
                    if (type === 'sort') {
                        return row.apellidoPaterno;
                    }
                    return `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`;
                }
            },
            { data: 'nombreDepartamento', title: 'Departamento' },
            {
                data: null,  // Cambiado a null para acceder a toda la fila
                title: "Acciones",
                render: function (data, type, row) {
                    // Construir el nombre completo para pasar como parámetro
                    var nombreCompleto = `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`;

                    return '<input type="button" value="Agregar Concepto" class="btn btn-success btn-lg-custom" onclick="ConceptoEmpleado(' + row.id + ', \'' + nombreCompleto + '\')" />' +
                        ' <input type="button" value="Generar Nomina" class="btn btn-custom-clean" onclick="NominasEmpleado(' + row.id + ', \'' + nombreCompleto + '\')"/>' +
                        ' <input type="button" value="Historial de Nominas" class="btn btn-success btn-lg-custom" onclick="HistorialNominas(' + row.id + ', \'' + nombreCompleto + '\')" />';
                }
            },
        ],
        // Orden inicial: primero por departamento (columna 3), luego por apellido paterno (columna 1)
        order: [[2, 'asc'], [1, 'asc']],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningun dato disponible en esta tabla",
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

    GetAllEmpleados();
});

function GetAllEmpleados() {
    GetMVC("/Empleado/GetAllEmpleados", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblEmpleados", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar el Inventario: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function ConceptoEmpleado(id, nombreCompleto) {
    $("#genericModal").removeData('b s.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Agregar Conceptos");
    $("#boddyGeericModal").load("/RH/PartialConceptosEmpleado/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

function NominasEmpleado(id, nombreCompleto) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Nominas del Empleado");

    // Enviar nombreCompleto como parámetro en la URL
    $("#boddyGeericModal").load("/RH/PartialNominasEmpleado/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}

function HistorialNominas(id, nombreCompleto) {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Historial de Nominas");

    // Enviar nombreCompleto como parámetro en la URL
    $("#boddyGeericModal").load("/RH/PartialHistorialNominas/" + id + "?nombreCompleto=" + encodeURIComponent(nombreCompleto), function () {
        $("#genericModal").modal("show");
    });
}