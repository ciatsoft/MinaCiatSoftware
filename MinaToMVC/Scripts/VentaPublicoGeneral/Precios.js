$(document).ready(function () {

    // Verificar si estamos en modo edición (si hay un ID en el modelo)
    var id = $("#id").val();
    $("#btnEliminar").hide();

    if (id !== "0") {
        // Habilitar el botón de eliminar
        $("#btnEliminar").show();

    }

    // Inicialización de componentes
    CambioUbicacion();

    // Configuración de validación del formulario
    configureFormValidation();

    // Inicialización de la tabla
    initializeDataTable();
});

// Configuración de validación del formulario
function configureFormValidation() {
    jQuery.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-z\s]+$/i.test(value);
    }, "Only alphabetical characters");

    $("#frmPrecioMaterial").validate({
        rules: {
            "Folio": { required: true },
            "Ubicacion_Id": { required: true },
            "Material_Id": { required: true },
            "Transporte": { required: true },
            "Placa": { required: true }
        }
    });
}

// Inicialización de DataTable
function initializeDataTable() {
    Createtable().then(function () {
        setupEditButtonHandlers();
    }).catch(function (error) {
        console.error("Error al inicializar la tabla:", error);
    });
}

// Función para crear la tabla DataTable
function Createtable() {
    return new Promise(function (resolve, reject) {
        try {
            var table = $("#tblPrecios").DataTable({
                processing: true,
                destroy: true,
                paging: true,
                searching: true,
                columns: [
                    { data: "id", visible: false, title: "Id" },
                    {
                        data: "precioMenudeo",
                        title: "Precio en Menudeo",
                        render: formatMoney
                    },
                    {
                        data: "cantidad",
                        title: "Menudeo hasta",
                        render: function (data) {
                            return data + ' unidades';
                        }
                    },
                    {
                        data: "precioMayoreo",
                        title: "Precio en Mayoreo",
                        render: formatMoney
                    },
                    {
                        data: "esPrecioActivo",
                        title: "Es activo",
                        render: function (data) {
                            if (data) {
                                return '<span style="display: inline-block; width: 10px; height: 10px; background-color: green; border-radius: 50%; margin-right: 5px;"></span>Activo';
                            } else {
                                return '<span style="display: inline-block; width: 10px; height: 10px; background-color: red; border-radius: 50%; margin-right: 5px;"></span>Inactivo';
                            }
                        }
                    },
                    { data: "comentario", title: "Comentario" },
                    {
                        data: "id",
                        title: "Acciones",
                        render: function (data) {
                            return `
                                <button type="button" class="btn btn-custom-clean btn-editar" data-id="${data}">
                                    Editar
                                </button>
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
                },
                initComplete: function () {
                    resolve();
                },
                drawCallback: function () {
                    setupEditButtonHandlers();
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

// Configuración de manejadores de eventos para los botones de editar
function setupEditButtonHandlers() {
    $(document).off('click', '.btn-editar').on('click', '.btn-editar', function (e) {
        e.preventDefault();
        var id = $(this).data('id');

        // Redirigir a la página de edición
        window.location.href = "/VentaPublicoGeneral/Precios/" + id;
    });
}

// Función para manejar cambio de ubicación
function CambioUbicacion() {
    var ubicacionId = $("#ddlUbicacion").val();

    $("#divMaterial").empty().load("/VentaPublicoGeneral/PartialMaterialCargaPrecio/" + ubicacionId, function () {
        $("#Material_Id").rules("add", "required");
        GetPreciosMyBaterial();

        $("#Material_Id").off("change").on("change", GetPreciosMyBaterial);
    });
}

// Obtener precios por material
function GetPreciosMyBaterial() {
    var materialId = $("#Material_Id").val();

    if (!materialId) return;

    GetMVC("/VentaPublicoGeneral/GetPreciosBymaterialId/" + materialId, function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblPrecios", r.Response);
            setupEditButtonHandlers();
        }
    });
}

// Función auxiliar para formatear dinero
function formatMoney(value) {
    return "$" + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Eliminar Precio
function EliminarPrecio(button) {
    var id = $(button).data('id');
    if (id && id !== 0) {
        PostMVC("/VentaPublicoGeneral/DeletePV_Precio/" + id, function (r) {
            if (r.IsSuccess) {
                window.location.href = "/VentaPublicoGeneral/Precios";
            } else {
                alert(r.Message || "Hubo un error");
            }
        }, function (error) {
            window.location.href = "/VentaPublicoGeneral/Precios";
        });
    }
}
