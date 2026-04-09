$(document).ready(function () {
    // Cuando cambie la selección del dropdown
    $('#ddlTransportistas').change(function () {
        var textoSeleccionado = $(this).find('option:selected').text();
        $('#nombreTrabajador').val(textoSeleccionado);
    });

    // Ejecutar al cargar la página si ya hay un valor seleccionado
    if ($('#ddlTransportistas').val()) {
        var textoSeleccionado = $('#ddlTransportistas').find('option:selected').text();
        $('#nombreTrabajador').val(textoSeleccionado);
    }

    $("#frmPrestamos").validate({
        rules: {
            "nombre": "required",
            "descripcion": "required",
            "monto": {
                required: true,
                number: true,
                min: 0.01
            }
        },
        messages: {
            "nombre": "El nombre es obligatorio.",
            "descripcion": "La descripción es obligatoria.",
            "monto": {
                required: "El monto es obligatorio.",
                number: "Debe ser un número válido.",
                min: "El monto debe ser mayor a 0."
            }
        }
    });

    if ($("#id").val() != "0") {
        $("#chbestatus").prop('checked', $("#estatus").val() == "1");
    }
    
    $("#tblPrestamos").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: true, title: "Id" },
            { data: "nombre", title: "Nombre", visible: false },
            { data: "idTrabajador", title: "Nombre del Trabajador", visible: false },
            { data: "nombreTrabajador", title: "Nombre del Trabajador" },
            { data: "descripcion", title: "Descripcion de Prestamo" },
            {
                data: "monto",
                title: "Monto",
                render: function (data) {
                    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data);
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return `
                        <input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarPrestamos(${data})" />
                        <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarPrestamos(${data})" />
                    `;
                }
            }
        ],
        order: [0,'des'],
        language: {
            decimal: ",",
            thousands: ".",
            processing: "Procesando...",
            lengthMenu: "Mostrar _MENU_ entradas",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningun dato disponible en esta tabla",
            info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            infoEmpty: "Mostrando 0 a 0 de 0 entradas",
            infoFiltered: "(filtrado de un total de _MAX_ entradas)",
            search: "Buscar:",
            loadingRecords: "Cargando...",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            },
            aria: {
                sortAscending: ": activar para ordenar ascendente",
                sortDescending: ": activar para ordenar descendente"
            }
        }
    });

    GetAllPrestamos();

    if (typeof PrestamosJson !== "undefined" && PrestamosJson && PrestamosJson.Id != 0) {
        console.log("Precargando datos: ", PrestamosJson);

        $("#id").val(PrestamosJson.Id);
        $("#nombre").val(PrestamosJson.Nombre);
        $("#descripcion").val(PrestamosJson.Descripcion);
        $("#monto").val(PrestamosJson.Monto);
        $("#fecha").val(PrestamosJson.Fecha.split('T')[0]);
        $("#encargado").val(PrestamosJson.UsuarioName);
        $("#estatus").val(PrestamosJson.Estatus ? "1" : "0");
        $("#chbestatus").prop('checked', PrestamosJson.Estatus === 1);

        if (PrestamosJson.IdTrabajador && PrestamosJson.IdTrabajador.Id) {
            $("#ddlTransportistas").val(PrestamosJson.IdTrabajador.Id);
        }
    } else {
        $("#btnEliminaru").hide();
        $("#btnGuardaru").show();
    }
});

function GetAllPrestamos() {
    GetMVC("/VentaPublicoGeneral/GetAllPrestamos", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblPrestamos", r.Response);
        } else {
            Swal.fire("Error", "Error al cargar los préstamos: " + r.ErrorMessage, "error");
        }
    });
}

function SaveOrUpdatePrestamos() {
    if ($("#frmPrestamos").valid()) {
        var parametro = {
            Id: $("#id").val(),
            nombre: "Nombre",
            nombreTrabajador: $("#nombreTrabajador").val(),
            descripcion: $("#descripcion").val(),
            Monto: $("#monto").val().replace(/[^\d.]/g, ''),
            Fecha: $("#fecha").val(),
            UsuarioName: $("#encargado").val(),
            IdTrabajador: $("#ddlTransportistas").val(),
            Estatus: 1,
            CreatedBy: $("#encargado").val(),
            CreatedDt: $("#fecha").val(),
            UpdatedBy: $("#encargado").val(),
            UpdatedDt: $("#fecha").val()
        };

        var isUpdating = parametro.Id && parametro.Id != 0;
        Swal.fire({
            title: isUpdating ? 'Informacion' : 'Informacion',
            html: `<strong>Id:</strong> ${parametro.Id}<br/>
                   <strong>Nombre:</strong> ${parametro.nombre}<br/> 
                   <strong>Trabajador:</strong> ${parametro.nombreTrabajador}<br/> 
                   <strong>Trabajador:</strong> ${parametro.IdTrabajador}<br/> 
                   <strong>Descripcion:</strong> ${parametro.descripcion}<br/>
                   <strong>Monto:</strong> ${parametro.Monto}<br/>
                   <strong>Fecha:</strong> ${parametro.Fecha}<br/>
                   <strong>Encargado:</strong> ${parametro.UsuarioName}`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: isUpdating ? 'Actualizar' : 'Guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                PostMVC("/VentaPublicoGeneral/SaveOrUpdatePrestamos", parametro, function (success, response) {
                    if (success) {
                        Swal.fire('Exito', isUpdating ? 'Datos actualizados exitosamente.' : 'Datos guardados exitosamente.', 'success')
                            .then(() => window.location.href = '/VentaPublicoGeneral/Prestamos');
                    } else {
                        Swal.fire('Error', 'Error al guardar los datos: ' + response.ErrorMessage, 'error');
                    }
                });
            }
        });
    } else {
        Swal.fire('Advertencia', 'Por favor, complete todos los campos obligatorios.', 'warning');
    }
}

function EditarPrestamos(id) {  
    window.location.href = "/VentaPublicoGeneral/Prestamos/" + id;
}

function EliminarPrestamos(id) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción eliminará el préstamo.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            PostMVC('/VentaPublicoGeneral/DeletePrestamos', { id: id }, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('¡Eliminado!', 'El préstamo ha sido eliminado.', 'success')
                        .then(() => window.location.href = '/VentaPublicoGeneral/Prestamos');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}
