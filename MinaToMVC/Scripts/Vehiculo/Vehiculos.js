$(document).ready(function () {

    //Datos en la tabla
    $("#tblvehiculo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", title: "Id" },
            { data: "tipoVehiculo.nombre", title: "Vehiculo" },
            { data: "placa", title: "Placas" },
            { data: "color", title: "Color" },
            { data: "areaTrabajo.nombre", title: "Area" },
            { data: "transportista.nombre", title: "Chofer" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarVehiculo(' + data + ', this)" />';
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

    GetAllVehiculo();

    
});

function GetAllVehiculo() {
    GetMVC("/Vehiculo/GetAllVehiculo", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblvehiculo", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los vehiculos: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}
