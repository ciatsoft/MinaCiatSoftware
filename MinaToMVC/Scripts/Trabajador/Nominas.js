$(document).ready(function () {
    // Configuración de DataTable
    $("#tblEmpleados").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            {
                data: null,
                title: 'Nombre Completo',
                render: (data, type, row) => `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`,
                // Agregar campo para ordenamiento por apellido paterno
                type: 'string',
                // Función para extraer el apellido paterno para ordenamiento
                render: function (data, type, row) {
                    if (type === 'sort') {
                        return row.apellidoPaterno; // Para ordenamiento, usar solo apellido paterno
                    }
                    return `${row.apellidoPaterno} ${row.apellidoMaterno} ${row.nombre}`; // Para display normal
                }
            },
            { data: 'nombreDepartamento', title: 'Departamento' },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Agregar Concepto" class="btn btn-success btn-lg-custom" onclick="ConceptoEmpleado(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarEmpleado(' + data + ')"/>' +
                        ' <input type="button" value="Nominas" class="btn btn-custom-clean" onclick="AsignarSalario(' + data + ')"/>';
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

function ConceptoEmpleado(id) {
    $("#genericModal").removeData('b s.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Agregar Conceptos");
    $("#boddyGeericModal").load("/RH/PartialConceptosEmpleado/" + id, function () {
        $("#genericModal").modal("show");
    });
}