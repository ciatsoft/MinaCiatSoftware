var tipoMateriaList;

$(document).ready(function () {
    $("#frmCliente").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        }
    });

    // Inicialización de la tabla de clientes
    $("#tbCliente").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "telefono", title: "Télefono" },
            { data: "email", title: "Email" },
            { data: "comentarios", title: "Comentarios" },
            { data: "rfc", title: "RFC" },
            { data: "razon_Social", title: "Razón Social" },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarCliente(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarCliente(' + data + ', this)" />';
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

    $("#tableTipodematerial").dataTable({
        columns: [
            { data: "id", "visible": false, title: "Id" },
            { data: "nombreTipoMaterial", title: "Nombre del material" },
            {
                data: "id", title: "", render: function (data) {
                    return '<input type="checkbox" class="material-check" data-id="' + data + '" />';
                }
            }
        ],
        createdRow: function (row, data, index) {
            var r = $(row).find(".material-check");
            var rrr = materialesClienteJson.find(x => x.TipoMaterial.Id == data.id);

            if (rrr != undefined) {
                $(r).prop('checked', true);
            }

            $(r).on("change", function () {

                var clienteId = clienteJson.Id;
                var materialId = $(r).attr("data-id");
                console.log(clienteId + " " + materialId);

                if ($(r).is(':checked'))
                    //Insertar material
                    AgregarMaterialACliente(clienteId, materialId);
                else
                    //Eliminar material
                    EliminarMaterialDelCliente(clienteId, materialId);
            });
        }
    });


    if (clienteJson.Id != 0)
        GetAllTipoMaterial();

    GetAllCliente();

    if (clienteJson.Id !== null && clienteJson.Id !== 0 && !isNaN(clienteJson.Id)) {
        $("#txtIdCliente").val(clienteJson.Id);
        $("#txtNombre").val(clienteJson.Nombre);
        $("#txtTelefono").val(clienteJson.Telefono);
        $("#txtEmail").val(clienteJson.Email);
        $("#txtComentarios").val(clienteJson.Comentarios);
        $("#chbEstatus").prop('checked', clienteJson.Estatus);
        $("#txtRFC").val(clienteJson.RFC);
        $("#txtrazon").val(clienteJson.Razon_Social);

        $("#btnmaterial").show();

    }
    else {
        $("#btnmaterial").hide();
    }
});

function AgregarMaterialACliente(clienteId, materialId) {

    var parametro = {
        Cliente: {
            Id: clienteId
        },
        TipoMaterial: {
            Id: materialId
        },
        Estatus: true,
    };
    PostMVC('/Administracion/SaveOrUpdateClienteTipoMaterial', parametro, function (r) {
        console.log(parametro);
        if (r.IsSuccess) {
            Swal.fire("Éxito", "El material se agregó exitosamente al cliente", "success");
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al guardar el material: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function EliminarMaterialDelCliente(clienteId, materialId) {
    var parametros = {
        Cliente: {
            Id: clienteId
        },
        TipoMaterial: {
            Id: materialId
        },
    };
        
    PostMVC("/Administracion/DeleteClienteTipoMaterial", parametros, function (r) {
        if (r.IsSuccess) {
            Swal.fire("Éxito", "El material se elimino exitosamente de este cliente", "success");
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los materiales: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}



// Función para obtener todos los tipos de material
function GetAllTipoMaterial() {
    GetMVC("/Catalog/GetAllTipoMaterialUbicacion", function (r) {
        if (r.IsSuccess) {
            tipoMateriaList = r.Response;
            MapingPropertiesDataTable("tableTipodematerial", r.Response);
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los materiales: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función que se ejecuta al hacer clic en el botón de Guardar
function SaveOrUpdateCliente() {
    if ($("#frmCliente").valid()) {
        Estatuscheck = 1;
        var parametro = {
            Id: $("#txtIdCliente").val(),
            Nombre: $("#txtNombre").val(),
            Telefono: $("#txtTelefono").val(),
            Email: $("#txtEmail").val(),
            RFC: $("#txtRFC").val(),
            Razon_Social: $("#txtrazon").val(),
            Comentarios: $("#txtComentarios").val(),
            Estatus: Estatuscheck,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val()
        };

        // Mostrar una alerta de éxito con SweetAlert
        Swal.fire({
            title: "Registro guardado!",
            text: "El cliente se ha guardado correctamente.",
            icon: "success",
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/Administracion/Clientes';
            }
        });

        // Llamada al servidor para guardar o actualizar los datos
        PostMVC('/Administracion/SaveOrUpdateCliente', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                Swal.fire("Éxito", "Datos guardados exitosamente.", "success");
            } else {
                Swal.fire("Error", "Error al guardar los datos: " + r.ErrorMessage, "error");
            }
        });
    }
}

// Función para eliminar el cliente con confirmación y actualización de estatus
function EliminarCliente(id, boton) {
    var row = $(boton).closest("tr");
    var nombre = row.find("td:eq(0)").text();
    var telefono = row.find("td:eq(1)").text();
    var Email = row.find("td:eq(2)").text();
    var comentario = row.find("td:eq(3)").text();
    var rfc = row.find("td:eq(4)").text();
    var razon = row.find("td:eq(5)").text();

    // Confirmación de eliminación con SweetAlert
    Swal.fire({
        title: '¿Está seguro?',
        text: "¿Desea eliminar el siguiente cliente? \nNombre: " + nombre + "\nTelefono: " + telefono + "\nEmail: " + Email + "\nComentario: " + comentario + "\nRFC: " + rfc + "\nRazón social: " + razon,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = {
                Id: id,
                Nombre: nombre,
                Telefono: telefono,
                Email: Email,
                Comentarios: comentario,
                RFC: rfc,
                Razon_Social: razon,
                Estatus: 0,
                CreatedBy: $("#txtCreatedBy").val(),
                CreatedDt: $("#txtCreatedDt").val(),
                UpdatedBy: $("#txtUpdatedBy").val(),
                UpdatedDt: new Date().toISOString()
            };
            window.location.href = '/Administracion/Clientes';
            PostMVC('/Administracion/SaveOrUpdateCliente', parametro, function (r) {

                if (r.IsSuccess) {
                    Swal.fire("Eliminado", "El cliente ha sido eliminado.", "success").then(() => {

                    });
                } else {
                    Swal.fire("Error", "Error al eliminar el cliente: " + r.ErrorMessage, "error");
                }
            });
        }
    });
}

function EditarCliente(id) {
    location.href = "/Administracion/Clientes/" + id;
}

// Función que obtiene todos los clientes
function GetAllCliente() {
    GetMVC("/Administracion/GetAllCliente", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tbCliente", r.Response);
        } else {
            Swal.fire("Error", "Error al cargar los clientes: " + r.ErrorMessage, "error");
        }
    });
}

// Función para limpiar el formulario
function LimpiarFormulario() {
    $("#txtIdCliente").val('');
    $("#txtNombre").val('');
    $("#txtTelefono").val('');
    $("#txtEmail").val('');
    $("#txtComentarios").val('');
    $("#chbEstatus").prop('checked', false);
}
