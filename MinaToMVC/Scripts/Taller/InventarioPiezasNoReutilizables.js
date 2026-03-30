// Variable global para almacenar las categorías
var categoriasInventario = [];

$(document).ready(function () {
    // Configuración de DataTable
    $("#tblPiezasRetiradas").DataTable({
        data: [],
        columns: [
            { data: 'id', title: 'ID' },
            { data: 'idReparacion', title: 'Reparacion', visible: false },
            { data: 'nombre', title: 'Nombre' },
            {
                data: 'idCategoriaInventario',
                title: 'Categoria',
                render: function (data, type, row) {
                    // Buscar el nombre de la categoría por su ID
                    var categoria = categoriasInventario.find(c => c.id === data);
                    return categoria ? categoria.nombre : data;
                }
            },
            { data: 'marca', title: 'Marca' },
            { data: 'cantidad', title: 'Cantidad' },
            {
                data: "id",
                title: "Acciones",
                render: function (data, type, row) {
                    // CORREGIDO: Pasar los valores como strings para evitar problemas con números grandes
                    return '<input type="button" value="Mas Detalles" class="btn btn-custom-clean" onclick="MasDetalles(\'' + data + '\', \'' + row.idReparacion + '\', \'' + row.tipoVehiculo + '\', \'' + row.idVehiculo + '\')" />';
                }
            }
        ],
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

    GetAllCategoriaInventario();
});

function GetAllRetirarPiezasNoReutilizables() {
    GetMVC("/Taller/GetAllRetirarPiezasNoReutilizables", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblPiezasRetiradas", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las Piezas: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function GetAllCategoriaInventario() {
    GetMVC("/Taller/GetAllCategoriaInventario", function (r) {
        if (r.IsSuccess) {
            categoriasInventario = r.Response;

            GetAllRetirarPiezasNoReutilizables();
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar las Categorias del Inventario: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function MasDetalles(id, idReparacion, tipoVehiculoCodigo, idVehiculo) {
    $("#titleGenerciModal").text("Detalles de Pieza");

    var url = `/Taller/PartialViewModalMostrarDetalles?id=${encodeURIComponent(id)}&idReparacion=${encodeURIComponent(idReparacion)}&tipoVehiculo=${encodeURIComponent(tipoVehiculoCodigo)}&idVehiculo=${encodeURIComponent(idVehiculo)}`;

    $("#boddyGeericModal").load(url, function (response, status, xhr) {
        if (status === "error") {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los detalles: ' + xhr.statusText,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            $("#genericModal").modal("show");
        }
    });
}