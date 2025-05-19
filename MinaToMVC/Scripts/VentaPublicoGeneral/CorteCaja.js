$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmVentaCrud").validate({
        rules: {
            "Ingreso": {
                required: true
            },
            "Egreso": {
                required: true
            }
            ,
            "Comentario": {
                required: true
            }
            ,
            "Montototal": {
                required: true
            }
            ,
            "B500": {
                required: true
            }
            ,
            "B200": {
                required: true
            }
            ,
            "B100": {
                required: true
            }
            ,
            "B50": {
                required: true
            }
            ,
            "B20": {
                required: true
            }
            ,
            "M10": {
                required: true
            }
            ,
            "M5": {
                required: true
            }
            ,
            "M2": {
                required: true
            }
            ,
            "M1": {
                required: true
            }
            ,
            "M050": {
                required: true
            }
            
        }
    });
});
$(document).ready(function () {
    // Validación del formulario frmroll
    $("#frmroll").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required"
        }
    });

    // Inicialización de la tabla con DataTable
    $("#tblRoll").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "monto", title: "Nombre" },
            { data: "comentario", title: "Comentario" },
            { data: "usuarioname", title: "Usuario" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id",
                render: function (data) {
                    return `
                        <input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRoll(${data})" />
                        <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRoll(${data})" />
                    `;
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

    // Llamada para obtener los datos al cargar la página
    GetAllRoll();
});
;
function GetAllRoll() {
    GetMVC("/VenataPublicoGeneral/GetAllPV_CajaChica", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblCajaChica", r.Response);
        } else {
            alert("Error al cargar Cajachica: " + r.ErrorMessage);
        }
    });
}
