$(document).ready(function () {
    // Configuración de DataTable
    $("#tblConceptosRH").DataTable({
        data: [],
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: 'id', title: 'ID', visible: false },
            { data: 'nombre', title: 'Nombre' },
            { data: 'descripcion', title: 'Descripcion' },
            {
                data: 'valor',
                title: 'Valor',
                render: function (data) {
                    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(data);
                }
            },
            {
                data: 'aumento',
                title: 'Tipo de Cargo',
                render: function (data, type, row) {
                    if (data === 1 || data === true) {
                        return '<span class="label label-success">Aumento</span>';
                    } else if (data === 0 || data === false) {
                        return '<span class="label label-danger">Descuento</span>';
                    } else {
                        return '<span class="label label-default">No definido</span>';
                    }
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return '<button class="btn btn-sm btn-primary" onclick="EditarConceptosRH(' + data + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="EliminarConceptosRH(' + data + ')">' +
                        '<i class="fa fa-trash"></i> Eliminar</button>';
                }
            }
        ],
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": '<i class="fa fa-spinner fa-spin"></i> Procesando...',
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningun dato disponible en esta tabla",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
            "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
            "infoFiltered": "(filtrado de un total de _MAX_ entradas)",
            "search": '<i class="fa fa-search"></i> Buscar:',
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": '<i class="fa fa-fast-backward"></i>',
                "last": '<i class="fa fa-fast-forward"></i>',
                "next": '<i class="fa fa-forward"></i>',
                "previous": '<i class="fa fa-backward"></i>'
            },
            "aria": {
                "sortAscending": ": activar para ordenar la columna de manera ascendente",
                "sortDescending": ": activar para ordenar la columna de manera descendente"
            }
        }
    });

    $("#frmConceptosEmpleado").validate({
        rules: {
            nombre: "required",
            descripcion: "required",
        },
        messages: {
            nombre: "Por favor ingrese el nombre",
            descripcion: "Por favor ingrese una descripción"
        }
    });

    GetAllConceptosEmpleados();
});

function GetAllConceptosEmpleados() {
    GetMVC("/RH/GetAllConceptosEmpleados", function (r) {
        if (r.IsSuccess) {
            MapingPropertiesDataTable("tblConceptosRH", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar los Conceptos para el Empleado: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: 'OK'
            });
        }
    });
}

function SaveOrUpdateConceptosEmpleados() {
    // Validación manual de campos requeridos
    var nombre = $("#nombre").val();
    var descripcion = $("#descripcion").val();

    if (!nombre || nombre.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor ingrese el nombre del concepto.",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if (!descripcion || descripcion.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor ingrese una descripción.",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return;
    }

    if ($("#frmConceptosEmpleado").valid()) {
        var valorRaw = $("#valor").val().replace(/[^0-9.]/g, '');
        var valorNum = valorRaw ? parseFloat(valorRaw) : 0;

        var parametro = {
            id: $("#id").val() || 0,
            nombre: nombre,
            descripcion: descripcion,
            valor: isNaN(valorNum) ? 0 : valorNum,
            aumento: $("#aumentoCheckbox").is(':checked'),
            Estatus: $("#estatus").val(),
            CreatedBy: $("#createdBy").val(),
            CreatedDt: $("#createdDt").val(),
            UpdatedBy: $("#updatedBy").val(),
            UpdatedDt: $("#updatedDt").val()
        };

        console.log("Enviando parámetro:", parametro);

        PostMVC('/RH/SaveOrUpdateConceptosEmpleados', parametro, function (r) {
            if (r.IsSuccess) {
                LimpiarFormulario();
                swal({
                    title: "¡Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    window.location.reload();
                });
            } else {
                swal({
                    title: "Error",
                    text: "Error al guardar los datos: " + r.ErrorMessage,
                    type: "error",
                    confirmButtonText: 'OK'
                });
            }
        });
    } else {
        swal({
            title: "Advertencia",
            text: "Por favor, complete todos los campos obligatorios.",
            type: "warning",
            confirmButtonText: 'OK'
        });
    }
}

function LimpiarFormulario() {
    $("#frmConceptosEmpleado")[0].reset();
    // Actualizar el label del checkbox después de reset
    if (typeof updateAumentoLabel === 'function') {
        updateAumentoLabel();
    }
}

function EditarConceptosRH(id) {
    console.log("Editar ID recibido:", id);
    location.href = "/RH/ConceptosRH/" + id;
}

function EliminarConceptosRH(id) {
    swal({
        title: '¿Estás seguro?',
        text: "Se eliminara el siguiente registro.",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d9534f',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            swal({
                title: "Eliminado",
                text: "El concepto ha sido eliminado correctamente.",
                type: "success",
                confirmButtonText: 'OK'
            }, function () {
                window.location.reload();
            });
            window.location.reload();
            PostMVC('/RH/DeleteConceptosEmpleadosById', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El concepto ha sido eliminado correctamente.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.reload();
                    });
                } else {
                    swal({
                        title: "Error",
                        text: "Error al eliminar el concepto: " + r.ErrorMessage,
                        type: "error",
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    });
}

// Función global para actualizar el label del checkbox
window.updateAumentoLabel = function () {
    var chkAumento = document.getElementById('aumentoCheckbox');
    var lblAumento = document.getElementById('lblAumento');

    if (chkAumento && lblAumento) {
        lblAumento.textContent = chkAumento.checked ? 'Sí' : 'No';
        lblAumento.style.color = chkAumento.checked ? '#5cb85c' : '#d9534f';
    }
};