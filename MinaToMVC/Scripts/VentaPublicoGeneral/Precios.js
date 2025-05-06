
$(function () {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmPrecioMaterial").validate({
        rules: {
            "Folio": {
                required: true
            },
            "Ubicacion_Id": {
                required: true
            },
            "Material_Id": {
                required: true
            },
            "Transporte": {
                required: true
            },
            "Placa": {
                required: true
            }
        }
    });
});
$(document).ready(function () {
    CambioUbicacion();
    Createtable();
});

function CambioUbicacion() {
    var ubicacionId = $("#ddlUbicacion").val();

    $("#divMaterial").empty().load("/VentaPublicoGeneral/PartialMaterialCargaPrecio/" + ubicacionId, function () {
        $("#Material_Id").rules("add", "required");
        GetPreciosMyBaterial();
    });
}
function Createtable() {
    $("#tblPrecios").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "mayoreoMenudeo", title: "Mayoreo a partir de" },
            {
                data: "precioActual", title: "Precio", render: function (data) {
                    return formatMoney(data);
                }
            },
            {
                data: "esPrecioActivo", title: "Es activo", render: function (data) {
                    var texto = "";
                    if (data)
                        texto = "Activo";
                    else
                        texto = "Inactivo";
                    return texto;
                }
            },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarPrecio(' + data + ')" />';
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
}
function GetPreciosMyBaterial() {
    var materialId = $("#Material_Id").val();

    GetMVC("/VentaPublicoGeneral/GetPreciosBymaterialId/" + materialId, function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblPrecios", r.Response);
        }
    });
}

function EditarPrecio(id) {
    location.href = "/VentaPublicoGeneral/Precios/" + id;
}