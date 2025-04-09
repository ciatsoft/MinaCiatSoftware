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
                data: null,
                render: function (data, type, row) {
                    return '<input type="button" value="Dirección" style="visible: false" class="btn btn-custom-direccion btn-direccion" ' +
                        'data-cliente-id="' + row.id + '" data-direccion-id="' + row.idDireccion + '" />' +
                        '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarCliente(' + row.id + ')" />' +
                        '<input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarCliente(' + row.id + ', this)" />';
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
            },
            {
                data: "id", title: "Configurar", render: function (data) {
                    return '<input type="button" value="Precios" class="btn btn-custom-clean btn-precios" style="display:none;" data-material-id="' + data + '" />';
                }
            }
        ],
        createdRow: function (row, data, index) {
            var checkBox = $(row).find(".material-check");
            var btnPrecios = $(row).find(".btn-precios");
            var materialExists = materialesClienteJson.find(x => x.TipoMaterial.Id == data.id);

            // Si el material ya está asociado, marcar el checkbox y mostrar el botón
            if (materialExists != undefined) {
                $(checkBox).prop('checked', true);
                $(btnPrecios).show();
            }

            // Manejar el evento de cambio del checkbox
            $(checkBox).on("change", function () {
                var clienteId = clienteJson.Id;
                var materialId = $(this).attr("data-id");

                if ($(this).is(':checked')) {
                    // Insertar material y mostrar el botón
                    AgregarMaterialACliente(clienteId, materialId);
                    $(btnPrecios).show();
                } else {
                    // Eliminar material y ocultar el botón
                    EliminarMaterialDelCliente(clienteId, materialId);
                    $(btnPrecios).hide();
                }
            });
            // codigo de ejemplo para el apartado de modales
            // Manejar el evento del botón "Precios"
            $(btnPrecios).on("click", function () {
                var clienteId = clienteJson.Id; // Obtener el clienteId
                var materialId = $(this).data("material-id"); // Obtener el materialId

                // Abrir el modal con la vista parcial y pasar los datos
                $("#titleGenerciModal").text("Configuración de costos por cliente");
                $("#boddyGeericModal").empty().load("/Administracion/PartialConfiguracionCostosCliente", { clienteId: clienteId, materialId: materialId }, function () {

                    // Mostrar el modal
                    $("#genericModal").modal("show");

                });
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

    $("#btnmaterial").on("click", function () {
        $("#titleGenerciModal").text("Configuración de costos por cliente");
        $("#boddyGeericModal").empty().load("/Administracion/PartialConfiguracionCostosCliente", function () {
            $("#genericModal").modal("show");
        });
    });
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

function AgregarPreciosMaterialACliente() {
    // Recoger los valores de los campos de la vista parcial
    var clienteId = $("#clienteId").val();
    var materialId = $("#materialId").val();
    var pMatM3 = parseFloat($("#p-mat-m3").val()) || 0;
    var pFleteM3 = parseFloat($("#p-flete-m3").val()) || 0;
    var precioM3 = parseFloat($("#precio-m3").val()) || 0;
    var kmCargado = parseFloat($("#km-cargado").val()) || 0;
    var kmBasio = parseFloat($("#km-basio").val()) || 0;
    var totalKmRecorridos = parseFloat($("#total-km-recorridos").val()) || 0;
    var cargaDiesel = parseFloat($("#carga-diesel").val()) || 0;
    var totalDiesel = parseFloat($("#total-diesel").val()) || 0;
    var casetas = parseFloat($("#casetas").val()) || 0;
    var manoObra = parseFloat($("#mano-obra").val()) || 0;
    var materialViajes = parseFloat($("#material-viajes").val()) || 0;
    var totalGastos = parseFloat($("#total-gastos").val()) || 0;
    var subtotalIngreso = parseFloat($("#subtotal-ingreso").val()) || 0;

    // Crear el objeto con los datos
    var parametro = {
        Cliente: {
            Id: clienteId
        },
        TipoMaterial: {
            Id: materialId
        },
        Estatus: true,
        P_Mta_M3: pMatM3,
        P_Flete_M3: pFleteM3,
        Precio_M3: precioM3,
        KM_Cargado: kmCargado,
        KM_Basico: kmBasio,
        Total_KM_Recorridos: totalKmRecorridos,
        Carga_Disel: cargaDiesel,
        Total_Diesel_Precio_XLT: totalDiesel,
        Casetas: casetas,
        Mano_De_Obra: manoObra,
        Material_Viajes_De_30M3: materialViajes,
        Total_Gastos: totalGastos,
        Subtotal_Ingreso_Viajes_M3: subtotalIngreso
    };

    // Llamar al método SaveOrUpdateClienteTipoMaterial a través de PostMVC
    PostMVC('/Administracion/SaveOrUpdateClienteTipoMaterial', parametro, function (r) {
        console.log(parametro);
        if (r.IsSuccess) {
            Swal.fire("Éxito", "Los precios se agregaron exitosamente al cliente", "success");
            /*window.location.replace('/Administracion/Clientes');*/
            $("#genericModal").modal("hide");
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al guardar los precios: ' + r.ErrorMessage,
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
// EN este punto inicia en apartado del modal




//Cerrar Modal
function closeModal() {
    $("#FormModal").modal("hide");
}

//Mostrar modal de Direccion
function GetCliente(id, nombre) {
    // Asignar ID y Nombre al formulario del modal
    document.getElementById("idCliente").value = id;
    document.getElementById("nombreCliente").value = nombre;

    // Mostrar el modal
    $("#FormModal").modal("show");
}


// Parte en la que se manda a llamar la direccion del cliente despues de dar un clic 
function DireccionClienteB(id, nombre) {
    $("#idCliente").val(id);
    $("#nombreCliente").val(nombre);
    $("#idDireccion").val('');

    // Inicializar DataTable
    $('#tbDirecciones').DataTable({
        ajax: {
            url: '/api/DireccionCliente/List',
            type: 'GET',
            data: { clienteId: id },
            dataSrc: function (json) {
                if (json.IsSuccess && json.Response) {
                    return json.Response.filter(dir => dir.Cliente && dir.Cliente.Id == id);
                }
                return [];
            }
        },
        columns: [
            { data: 'calle' },
            {
                data: null,
                render: data => `${data.NoInterno || ''} / ${data.NoExterno || ''}`
            },
            { data: 'Colonia' },
            { data: 'Cp' },
            { data: 'Delegacion' },
            { data: 'Municipio' },
            { data: 'Estado' },
            {
                data: null,
                render: data => `
                    <button class="btn btn-sm btn-warning me-1" onclick="CargarDireccionParaEdicion(${data.Id})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="EliminarDireccion(${data.Id})">Eliminar</button>
                `,
                orderable: false
            }
        ],
        language: {
            decimal: ",",
            thousands: ".",
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ registros",
            zeroRecords: "No se encontraron direcciones",
            info: "Mostrando _START_ a _END_ de _TOTAL_ direcciones",
            infoEmpty: "Mostrando 0 a 0 de 0 direcciones",
            infoFiltered: "(filtrado de _MAX_ direcciones totales)",
            search: "Buscar:",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    });

    // Mostrar el modal
    $("#FormModal").modal("show");
}

// Manejo del envío
$("#contenedor").on("submit", function (e) {
    e.preventDefault();
    GuardarDireccion();
});

function GuardarDireccion() {
    const direccion = {
        Id: $("#idDireccion").val() || 0,
        Cliente: { Id: $("#idCliente").val() },
        calle: $("#txtCalle").val(),
        NoInterno: $("#txtNoInterno").val(),
        NoExterno: $("#txtNoExterno").val(),
        Colonia: $("#txtColonia").val(),
        Cp: $("#txtCP").val(),
        Delegacion: $("#txtDelegacion").val(),
        Municipio: $("#txtMunicipio").val(),
        Estado: $("#txtEstado").val(),
        Estatus: 1
    };

    $.ajax({
        url: '/api/DireccionCliente/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(direccion),
        success: function (response) {
            if (response.IsSuccess) {
                Swal.fire("Éxito", "Dirección guardada correctamente", "success");
                $('#tbDirecciones').DataTable().ajax.reload(null, false);
                LimpiarFormularioDireccion();
            } else {
                Swal.fire("Error", "Error al guardar: " + response.ErrorMessage, "error");
            }
        },
        error: function (xhr, status, error) {
            Swal.fire("Error", "Ocurrió un error al guardar: " + error, "error");
        }
    });
}

function CargarDireccionParaEdicion(id) {
    $.ajax({
        url: '/api/DireccionCliente/' + id,
        type: 'GET',
        success: function (response) {
            if (response.IsSuccess) {
                const dir = response.Response;
                $("#idDireccion").val(dir.Id);
                $("#txtCalle").val(dir.calle);
                $("#txtNoInterno").val(dir.NoInterno);
                $("#txtNoExterno").val(dir.NoExterno);
                $("#txtColonia").val(dir.Colonia);
                $("#txtCP").val(dir.Cp);
                $("#txtDelegacion").val(dir.Delegacion);
                $("#txtMunicipio").val(dir.Municipio);
                $("#txtEstado").val(dir.Estado);

                $('html, body').animate({
                    scrollTop: $("#contenedor").offset().top
                }, 500);
            } else {
                Swal.fire("Error", "No se pudo cargar la dirección: " + response.ErrorMessage, "error");
            }
        }
    });
}

function EliminarDireccion(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/api/DireccionCliente/' + id,
                type: 'DELETE',
                success: function (response) {
                    if (response.IsSuccess) {
                        Swal.fire("Éxito", "Dirección eliminada correctamente", "success");
                        $('#tbDirecciones').DataTable().ajax.reload(null, false);
                    } else {
                        Swal.fire("Error", "Error al eliminar: " + response.ErrorMessage, "error");
                    }
                }
            });
        }
    });
}

function AbrirModalDirecciones() {
    $("#titleGenerciModal").text("Configuración de dirección del cliente");
    $("#boddyGeericModal").empty().load("/Administracion/PartialdireccionesClientes", function () {
        $("#genericModal").modal("show");
    });
}

//esto no va aquí, le esta poniendo un método con clic al todo el docmiedocumento
//$(document).on("click", ".btn-direccion", function () {
//    var clienteId = $(this).data("cliente-id");
//    var direccionId = $(this).data("direccion-id");

//    $("#titleGenerciModal").text("Configuración de dirección del cliente");
//    $("#boddyGeericModal").empty().load("/Administracion/PartialConfiguracionUbicacionCliente", {
//        clienteId: clienteId,
//        direccionClientebyiD: direccionId
//    }, function () {
//        $("#genericModal").modal("show");
//    });
//});

function LimpiarFormularioDireccion() {
    $("#idDireccion").val('');
    $("#contenedor")[0].reset();
}
