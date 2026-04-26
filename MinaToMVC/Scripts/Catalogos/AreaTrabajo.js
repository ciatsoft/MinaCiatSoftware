$(document).ready(function () {
    $("#frmareaTrabajo").validate({
        rules: {
            "txtNombre": "required",
            "txtDescripcion": "required",
        },
        messages: {
            txtNombre: "El nombre es requerido",
            txtDescripcion: "La descripción es requerida"
        }
    });

    $("#tableareaTrabajo").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        scrollX: true,
        autoWidth: false,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "nombre", title: "Nombre" },
            { data: "descripcion", title: "Descripción" },
            {
                data: "estatus",
                visible: false,
                title: "Estatus",
                render: function (data) {
                    return data == 1 ? '<span class="label label-success">Activo</span>' : '<span class="label label-danger">Inactivo</span>';
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data, type, row) {
                    var id = data;
                    return '<button class="btn btn-sm btn-primary" onclick="Editarareat(' + id + ')">' +
                        '<i class="fa fa-edit"></i> Editar</button> ' +
                        '<button class="btn btn-sm btn-danger" onclick="Eliminarareat(' + id + ')">' +
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
            "emptyTable": "Ningún dato disponible en esta tabla",
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

    GetAllAreaTrabajo();

    if (areatJson != null && areatJson.Id != 0) {
        $("#txtidareatrabajo").val(areatJson.Id);
        $("#txtNombre").val(areatJson.Nombre);
        $("#txtDescripcion").val(areatJson.Descripcion);
    }
});

function SaveOrUpdateAreaTrabajo() {
    // Primero validamos que los campos requeridos no estén vacíos
    var nombre = $("#txtNombre").val();
    var descripcion = $("#txtDescripcion").val();

    if (!nombre || nombre.trim() === "" || !descripcion || descripcion.trim() === "") {
        swal({
            title: "¡Campos incompletos!",
            text: "Por favor llene todos los campos (Nombre y Descripción).",
            type: "warning",
            confirmButtonText: 'OK'
        });
        return; // Detenemos la ejecución aquí
    }

    // Solo si pasó la validación anterior, verificamos la validación del formulario
    if ($("#frmareaTrabajo").valid()) {
        var parametro = {
            Id: $("#txtidareatrabajo").val() || 0,
            Nombre: nombre,
            Descripcion: descripcion,
            Estatus: true,
            CreatedDt: $("#txtCreatedDt").val(),
        };

        console.log("Enviando parámetro:", parametro); // Debug

        PostMVC('/Catalog/SaveOrUpdateAreaTrabajo', parametro, function (r) {
            if (r.IsSuccess) {
                swal({
                    title: "¡Registro guardado!",
                    text: "El registro se ha guardado correctamente.",
                    type: "success",
                    confirmButtonText: 'OK'
                }, function () {
                    location.href = "/Catalog/AreaTrabajo";
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
    }
}

function Eliminarareat(id) {
    swal({
        title: '¿Está seguro?',
        text: "¿Desea eliminar el área de trabajo?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }, function (isConfirmed) {
        if (isConfirmed) {
            var parametro = { Id: id };
            window.location.href = '/Catalog/AreaTrabajo';
            PostMVC('/Catalog/DeleteAreaTrabajo', parametro, function (r) {
                if (r.IsSuccess) {
                    swal({
                        title: "Eliminado",
                        text: "El área de trabajo ha sido eliminada.",
                        type: "success",
                        confirmButtonText: 'OK'
                    }, function () {
                        window.location.href = '/Catalog/AreaTrabajo';
                    });
                } else {
                    swal({
                        title: "Error",
                        text: "Error al eliminar: " + r.ErrorMessage,
                        type: "error",
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        }
    });
}

function Editarareat(id) {
    console.log("Editar ID recibido:", id); // Debug
    location.href = "/Catalog/AreaTrabajo/" + id;
}

function LimpiarFormulario() {
    $("#txtidareatrabajo").val('');
    $("#txtNombre").val('');
    $("#txtDescripcion").val('');
}

function GetAllAreaTrabajo() {
    GetMVC("/Catalog/GetAllAreaTrabajo", function (r) {
        if (r.IsSuccess) {
            console.log("Datos recibidos del servidor:", r.Response);
            MapingPropertiesDataTable("tableareaTrabajo", r.Response);
        } else {
            swal({
                title: "Error",
                text: "Error al cargar las áreas: " + r.ErrorMessage,
                type: "error",
                confirmButtonText: 'Aceptar'
            });
        }
    });
}