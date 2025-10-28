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
                data: "tipoCliente",
                title: "Tipo de Cliente",
                render: function (data) {
                    const tipos = {
                        0: "Concreteros",
                        1: "Almacenes"
                    };
                    return tipos[data] || data;
                }
            },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data, type, row) {
                    return data == 1 ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id", title: "Acciones", render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarCliente(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarCliente(' + data + ')"/>';
                }
            },
        ],
        order: [0, 'desc'],
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
            $(btnPrecios).on("click", function () {
                var clienteId = clienteJson.Id;
                var materialId = $(this).data("material-id");

                // Cerrar el modal si está abierto y limpiar
                $("#genericModal").modal("hide");

                // Limpiar contenido anterior inmediatamente
                $("#boddyGeericModal").empty();
                $("#titleGenerciModal").text("Configuración de costos por cliente");

                // Esperar a que el modal se cierre completamente antes de abrirlo de nuevo
                setTimeout(() => {
                    $("#boddyGeericModal").load("/Administracion/PartialConfiguracionCostosCliente", {
                        clienteId: clienteId,
                        materialId: materialId
                    }, function () {
                        // Mostrar el modal
                        $("#genericModal").modal("show");
                        SearchDireccionesCliente(clienteId);
                        GetPrecioActivoCombustible();
                        TablaVacia();
                        DropListDirecciones();
                        BotonesEditarEliminar();
                    });
                }, 500);
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
        $("#ddlTipoCliente").val(clienteJson.TipoCliente);

        $("#btnmaterial").show();
        $("#btndirecciones").show();

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
    // Nuevos Campos
    var idDireccion = $("#idDireccion").val();
    var direccion = $("#direccion").val();
    var precioActivo = $("#precioActual").is(":checked"); // CORRECCIÓN AQUÍ
    var id = $("#id").val();
    var createdBy = $("#createdBy").val();
    var updatedBy = $("#updatedBy").val();
    var createdDt = $("#createdDt").val();
    var updatedDt = $("#updatedDt").val();

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
        Id: id,
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
        Subtotal_Ingreso_Viajes_M3: subtotalIngreso,
        IdDireccion: idDireccion,
        Direccion: direccion,
        PrecioActivo: precioActivo,
        CreatedBy: createdBy,
        CreatedDt: createdDt,
        UpdatedBy: updatedBy,
        UpdatedDt: updatedDt
    };

    // Llamar al método SaveOrUpdateClienteTipoMaterial a través de PostMVC
    PostMVC('/Administracion/SaveOrUpdateClienteTipoMaterial', parametro, function (r) {
        console.log(parametro);
        if (r.IsSuccess) {
            Swal.fire("Éxito", "Los precios se agregaron exitosamente al cliente", "success");
            window.location.replace('/Administracion/Clientes/' + clienteId);
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
            TipoCliente: $("#ddlTipoCliente").val(), // Esto sí captura el valor correcto
            Estatus: Estatuscheck,
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdatedBy").val(),
            UpdatedDt: $("#txtUpdatedDt").val(),
        };

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
        // Primero hacer el POST al servidor
        PostMVC('/Administracion/SaveOrUpdateCliente', parametro, function (r) {
            // Solo si el servidor responde con éxito, mostrar alerta y redireccionar
            if (r.IsSuccess) {
                // Solo si el servidor responde con éxito, mostrar alerta y redireccionar
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

                LimpiarFormulario();
            } else {
                Swal.fire("Error", "Error al guardar los datos: " + r.ErrorMessage, "error");
            }
        });
    }
}
function EliminarCliente(id) {
    Swal.fire({
        title: '¿Estas seguro?',
        text: "¿Desea eliminar el siguiente registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id };

            PostMVC('/Administracion/DeleteCliente', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El Cliente ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
                } else {
                    Swal.fire('Eliminado', 'El Cliente ha sido eliminado.', 'success')
                        .then(() => { window.location.reload(); });
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

//Cerrar Modal
function closeModal() {
    // Obtener el ID del cliente del campo oculto en el formulario
    const idCliente = $('#idCliente').val();
    window.location.href = '/Administracion/Clientes/' + idCliente;
}

//Mostrar modal de Direccion
function GetCliente(id, nombre) {
    // Asignar ID y Nombre al formulario del modal
    document.getElementById("idCliente").value = id;
    document.getElementById("nombreCliente").value = nombre;

    // Mostrar el modal
    $("#FormModal").modal("show");
}

// Manejo del envío
$("#contenedor").on("submit", function (e) {
    e.preventDefault();
    GuardarDireccion();
});

function GuardarDireccion() {
    // Validación manual de campos requeridos
    const camposRequeridos = [
        { id: "#txtcalle", nombre: "Calle" },
        { id: "#txtnointerno", nombre: "No. Interno" },
        { id: "#txtnoexterno", nombre: "No. Externo" },
        { id: "#txtcolonia", nombre: "Colonia" },
        { id: "#txtcp", nombre: "C.P." },
        { id: "#txtdelegacion", nombre: "Delegación" },
        { id: "#txtmunicipio", nombre: "Municipio" },
        { id: "#txtestado", nombre: "Estado" }
    ];

    for (let campo of camposRequeridos) {
        if ($(campo.id).val().trim() === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Campo requerido',
                text: `Por favor completa el campo: ${campo.nombre}`,
                confirmButtonText: 'Aceptar'
            });
            $(campo.id).focus();
            return; // Se detiene si un campo está vacío
        }
    }

    // Si pasa la validación, continúa con el guardado
    const direccion = {
        Id: $("#idDireccionCliente").val() || 0,
        ClienteId: $("#idCliente").val(),
        Calle: $("#txtcalle").val(),
        NoInterno: $("#txtnointerno").val(),
        NoExterno: $("#txtnoexterno").val(),
        Colonia: $("#txtcolonia").val(),
        CP: $("#txtcp").val(),
        Delegacion: $("#txtdelegacion").val(),
        Municipio: $("#txtmunicipio").val(),
        Estado: $("#txtestado").val(),
        Estatus: 1,
        CreatedBy: $("#createdByParcialUbicacion").val(),
        CreatedDt: $("#createdDtParcialUbicacion").val(),
        UpdatedBy: $("#updatedByParcialUbicacion").val(),
        UpdatedDt: $("#updatedDtParcialUbicacion").val(),
    };

    PostMVC('/Administracion/SaveOrUpdateDireccionCliente', direccion, function (r) {
        if (r.IsSuccess) {
            Swal.fire({
                icon: 'success',
                title: 'Dirección guardada correctamente',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                location.href = '/Administracion/Clientes/' + direccion.ClienteId;
            });
        } else {
            alert("Error al guardar la dirección. Ver consola para más detalles.");
        }
    });
}

// Función modificada para aceptar parámetro de edición
function AbrirModalDirecciones(idCliente, nombreCliente, idDireccion = 0) {
    // Ocultar el modal si está visible
    if ($('#genericModal').hasClass('show')) {
        $('#genericModal').modal('hide');
    }

    // Limpiar completamente el modal y el backdrop
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#boddyGeericModal').empty();

    // Resetear cualquier estado del modal
    $('#genericModal').removeData('bs.modal');

    // Establecer título
    $('#titleGenerciModal').text(idDireccion ? "Editar dirección" : "Nueva dirección");

    // Cargar vista parcial en el body del modal
    $('#boddyGeericModal').load(`/Administracion/PartialdireccionesClientes?direccionClientebyiD=${idDireccion}&clienteId=${idCliente}`, function () {
        // Asignar valores básicos (siempre)
        $('#idCliente').val(idCliente);
        $('#nombreCliente').val(nombreCliente);

        const createdBy = $('#txtCreatedBy').val();
        const updatedBy = $('#txtUpdatedBy').val();

        $('#createdByParcialUbicacion').val(createdBy);
        $('#updatedByParcialUbicacion').val(updatedBy);

        // Si estamos en modo edición, cargar los datos de la dirección
        if (idDireccion !== 0) {
            CargarDatosDireccion(idDireccion);
            SearchDireccionesCliente(idCliente);
        }

        // Mostrar modal con opciones
        $('#genericModal').modal({
            backdrop: 'static',
            keyboard: false
        }).on('hidden.bs.modal', function () {
            // Redireccionar al cerrar el modal
            window.location.href = '/Administracion/Clientes/' + idCliente;

            // Limpiar al cerrar para futuras aperturas
            $(this).removeData('bs.modal');
            $('#boddyGeericModal').empty();
        });

        // Cargar tabla con direcciones
        SearchDireccionesCliente(idCliente);
    });
}

// Función para cargar los datos de una dirección específica
function CargarDatosDireccion(idDireccion) {
    $.ajax({
        url: '/Administracion/GetDireccionClienteById',
        method: 'GET',
        data: { id: idDireccion },
        success: function (response) {
            const result = JSON.parse(response);

            if (result.IsSuccess && result.Response && result.Response.length > 0) {
                const direccion = result.Response[0];

                // Llenar campos del formulario
                $('#idDireccionCliente').val(direccion.id);
                $('#txtcalle').val(direccion.calle);
                $('#txtnointerno').val(direccion.noInterno);
                $('#txtnoexterno').val(direccion.noExterno);
                $('#txtcolonia').val(direccion.colonia);
                $('#txtcp').val(direccion.cp);
                $('#txtdelegacion').val(direccion.delegacion);
                $('#txtmunicipio').val(direccion.municipio);
                $('#txtestado').val(direccion.estado);

                // Actualizar fechas
                const fecha = new Date();
                const pad = (n) => n.toString().padStart(2, '0');
                const fechaFormateada = `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}`;
                $('#updatedDtParcialUbicacion').val(fechaFormateada);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo obtener la dirección',
                });
            }
        },
        error: function (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al obtener datos del servidor',
            });
        }
    });
}



// Función auxiliar para cargar direcciones y generar DataTable
function SearchDireccionesCliente(clienteId) {
    PostMVC('/Administracion/GetDireccionesCliente', { Id: clienteId }, function (r) {
        if (r.IsSuccess) {
            const data = r.Response;

            if ($.fn.DataTable.isDataTable('#tbDirecciones')) {
                $('#tbDirecciones').DataTable().clear().destroy();
            }

            $('#tbDirecciones').DataTable({
                data: data,
                columns: [
                    { data: 'id', title: 'ID', visible: false },
                    { data: 'calle', title: 'Calle' },
                    { data: 'noExterno', title: 'Numero Exterior' },
                    { data: 'noInterno', title: 'Numero Interior' },
                    { data: 'colonia', title: 'Colonia' },
                    { data: 'cp', title: 'CP' },
                    { data: 'delegacion', title: 'Delegación' },
                    { data: 'municipio', title: 'Municipio' },
                    { data: 'estado', title: 'Estado' },
                    {
                        data: null,
                        title: 'Acciones',
                        orderable: false,
                        render: function (data, type, row) {
                            return `
                    <button class="btn btn-sm btn-primary btnEditar" data-id="${row.id}" title="Editar">
                        Editar
                    </button>
                    <button class="btn btn-sm btn-danger btnEliminar" data-id="${row.id}" title="Eliminar">
                        Eliminar
                    </button>`;
                        }
                    }
                ],
                scrollX: true,           // habilita scroll horizontal
                responsive: true,        // mejora la experiencia en pantallas pequeñas
                autoWidth: false,        // evita el autoajuste de ancho que a veces rompe el diseño
                language: {
                    url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
                }
            });
        } else {
            alert("Error al obtener registros. Ver consola para más detalles.");
            console.error(r);
        }
    });
}

$(document).on('click', '.btnEliminar', function () {
    const id = $(this).data('id');
    PostMVC('/Administracion/DeletDireccionCliente', { Id: id }, function (r) {
        if (r.IsSuccess) {
            const clienteId = $('#idCliente').val();
            SearchDireccionesCliente(clienteId);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la dirección',
            });
            console.error(r);
        }
    });
});

// TipoMaterial
$(document).on('click', '.btnEliminarTipoMaterial', function () {
    const id = $(this).data('id');
    PostMVC('/Administracion/DeletTipoMaterial/', { Id: id }, function (r) {
        if (r.IsSuccess) {
            location.reload(); // Recarga inmediata
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la dirección',
            });
            console.error(r);
        }
    });
});

// Modificación en el evento de edición
$(document).on('click', '.btnEditar', function () {
    const idDireccion = $(this).data('id');
    const idCliente = $('#idCliente').val();
    const nombreCliente = $('#nombreCliente').val();

    // Abrir modal en modo edición
    AbrirModalDirecciones(idCliente, nombreCliente, idDireccion);
});

function AbrirModalPrecioCombustible() {
    $("#genericModal").removeData('bs.modal');
    $("#boddyGeericModal").empty();

    $("#titleGenerciModal").text("Configurar Precio Actual de Combustible");

    // Enviar nombreCompleto como parámetro en la URL
    $("#boddyGeericModal").load("/Administracion/PartialConfigurarCombustible", function () {
        $("#genericModal").modal("show");
    });
}