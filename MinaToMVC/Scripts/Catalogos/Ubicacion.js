$(document).ready(function () {
    if (UbicacionJson.Id != 0) {
        GetUbicacionById(UbicacionJson.Id);
    }
    $("#tableUbicacion").dataTable({
            processing: true,
            destroy: true,
            paging: true,
            searching: true,
            columns: [
                { data: "id", "visible": false, title: "Id" },
                { data: "nombreUbicacion", title: "Nombre" },
                { data: "descripcionUbicacion", title: "Descripción" },
                {
                    data: "estatus",
                    title: "Estatus",
                    render: function (data, type, row) {
                        return data == 1 ? "Activo" : "Inactivo";
                    }
                },
                {
                    data: "id", render: function (data) {
                        return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarRoll(' + data + ')" />' +
                            ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarRoll(' + data + ', this)" />'; // 'this' se pasa para obtener la fila
                    }
                }
            ]
            ,
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
    GetAllUbicacion();
    $("#btnGuardarUbicacion").on("click", function () {
        //SaveOrUpdateUbicacion();
    });
   
     GetAllUbicacion();//if (UbicacionJson.Id != 0) {
    //    GetUbicacionById(UbicacionJson.Id);
    //    //se te fueron bien feo las cabras al monte heee

    //}

});

function GetAllUbicacion() {
    GetMVC("/Catalog/GetAllUbicacion", function (r) {
        if (r.IsSuccess) {
            $('#tableUbicacion').dataTable().fnAddData(r.Response);
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Ocurrió un error.',
                text: r.Message
            });
            //alert(r.Message);
        }
    });
}

function SaveOrUpdateUbicacion() {
    if ($("#frmubicacion").valid()) {
        var parametro = {
            Id: $("#txtIdUbicacion").val(),
            NombreUbicacion: $("#txtNombreUbicacion").val(),
            DescripcionUbicacion: $("#txtDescripcionUbicacion").val(),
            CreatedBy: $("#txtCreatedBy").val(),
            CreatedDt: $("#txtCreatedDt").val(),
            UpdatedBy: $("#txtUpdateBy").val(),
            UpdatedDt: $("#txtUpdateDt").val(),
            Estatus: $("#chbEstatus").is(':checked')
        };

        Swal.fire({
            title: "Registro guardado!",
            text: "El registro se ha guardado correctamente.",
            icon: "success",
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/Catalog/Ubicacion';
            }
        });

        PostMVC(urlSaveOrUpdateUbicacion, parametro, function (success, response) {
            if (success) {
                location.href = "/Catalog/Ubicacion";
            }
            else {
                alert("Error")
                console.log(response);
            }
        });

    }
}


function GetUbicacionById(id) {
    //esta mal implememntado tu código ino
    GetMVC(urlUbicacionPorId + "/" + id, function (response) {
        if (response.IsSuccess) {
            $("#txtIdUbicacion").val(response.Response.id);
            $("#txtNombreUbicacion").val(response.Response.NombreUbicacion);
            $("#txtDescripcionUbicacion").val(response.Response.DescripcionUbicacion);
            $("#txtCreatedBy").val(response.Response.CreatedBy);
            $("#txtCreatedDt").val(response.Response.CreatedDt);
            $("#txtUpdateBy").val(response.Response.UpdatedBy);
            $("#txtUpdateDt").val(response.Response.UpdatedDt);
        }

        else {

            console.log(response);
            alert("OCurrio un error");
        }
    });
}

function EditarUbicacion(id) {
    location.href = "/Catalog/Ubicacion/" + id;
}
