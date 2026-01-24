$(document).ready(function () {
    // Inicializar DataTable con configuración responsiva
    $("#tblVehiculoCarga").DataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        responsive: true,
        autoWidth: false,
        language: {
            "decimal": ",",
            "thousands": ".",
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "Ningun dato disponible en esta tabla",
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
        columnDefs: [
            { targets: 0, visible: false },
            { targets: 1, width: "100px", responsivePriority: 1 },
            { targets: 2, width: "100px", responsivePriority: 2 },
            { targets: 3, width: "100px", responsivePriority: 3 },
            { targets: 4, width: "30px", responsivePriority: 4 }
        ],
        columns: [
            { data: "id", title: "Id" },
            { data: "descripcion", title: "Descripcion" },
            {
                data: null,
                title: "Foto",
                render: function (data, type, row) {
                    if (row.rutaArchivo && row.gitArchivo) {
                        var url = '/VehiculoCarga/VerImagenVehiculo?rutaArchivo=' +
                            encodeURIComponent(row.rutaArchivo) +
                            '&nombreArchivo=' +
                            encodeURIComponent(row.gitArchivo);

                        return '<img src="' + url + '" class="img-thumbnail" style="width: 120px; height: 120px; cursor: pointer;" ' +
                            'onclick="ampliarImagen(\'' + url + '\')" title="Click para ampliar" />';
                    }
                    return '<span class="text-muted">Sin foto</span>';
                }
            },
            {
                data: "estatus",
                title: "Estatus",
                render: function (data) {
                    return data == 1 || data === true ? "Activo" : "Inactivo";
                }
            },
            {
                data: "id",
                title: "Acciones",
                render: function (data) {
                    return '<input type="button" value="Editar" class="btn btn-custom-clean" onclick="EditarVehiculoCarga(' + data + ')" />' +
                        ' <input type="button" value="Eliminar" class="btn btn-custom-cancel" onclick="EliminarVehiculoCarga(' + data + ')"/>';
                }
            }
        ]
    });

    // Configurar evento para la vista previa de la foto
    document.getElementById('fotografia').addEventListener('change', function (e) {
        mostrarVistaPrevia(e.target.files[0]);
    });

    // Verificar si estamos en modo edición
    var vehiculoCargaId = $("#trabajadorInput").val();
    if (vehiculoCargaId && vehiculoCargaId > 0) {
        cargarDatosVehiculoCarga(vehiculoCargaId);
    }

    GetAllVehiculoCarga();
});

// Función para ampliar imagen
function ampliarImagen(url) {
    if (!url || url === '#') {
        Swal.fire({
            title: 'Sin imagen',
            text: 'No hay imagen disponible para mostrar',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    Swal.fire({
        html: '<img src="' + url + '" style="max-width: 100%; max-height: 70vh;" />',
        showCloseButton: true,
        showConfirmButton: false,
        width: 'auto',
        background: 'transparent',
        backdrop: 'rgba(0,0,0,0.8)'
    });
}

// Función para mostrar vista previa de la imagen
function mostrarVistaPrevia(file) {
    if (file) {
        if (!file.type.match('image.*')) {
            Swal.fire('Error', 'Por favor seleccione un archivo de imagen válido.', 'error');
            document.getElementById('fotografia').value = '';
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'La imagen no debe superar los 5MB.', 'error');
            document.getElementById('fotografia').value = '';
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById('preview-image').src = e.target.result;
            document.getElementById('preview-container').style.display = 'block';
            document.getElementById('no-image-message').style.display = 'none';
            document.getElementById('current-photo-container').style.display = 'none';
            document.getElementById('current-photo').src = e.target.result;
        };

        reader.onerror = function () {
            Swal.fire('Error', 'Error al leer el archivo de imagen.', 'error');
            document.getElementById('fotografia').value = '';
        };

        reader.readAsDataURL(file);
    }
}

// Función para eliminar la foto seleccionada
function eliminarFoto() {
    document.getElementById('fotografia').value = '';
    document.getElementById('preview-container').style.display = 'none';
    document.getElementById('no-image-message').style.display = 'block';

    var currentPhoto = document.getElementById('current-photo');
    if (currentPhoto.src && !currentPhoto.src.startsWith('data:')) {
        document.getElementById('current-photo-container').style.display = 'block';
    } else {
        document.getElementById('current-photo-container').style.display = 'none';
    }
}

// Función para editar vehículo de carga
function EditarVehiculoCarga(id) {
    GetMVC("/VehiculoCarga/GetVehiculoCargaById/" + id, function (r) {
        if (r.IsSuccess) {
            var data = r.Response;
            const today = new Date().toISOString().split('T')[0];
            $("#UpdatedDt").val(today);

            $("#trabajadorInput").val(data.id);
            $("#descripcion").val(data.descripcion);
            $("#CreatedBy").val(data.createdBy || '');
            $("#CreatedDt").val((data.createdDt) || '');
            $("#UpdatedDt").val(today);
            $("#UpdatedBy").val(data.createdBy);

            if (data.rutaArchivo && data.gitArchivo) {
                var imgUrl = '/VehiculoCarga/VerImagenVehiculo?rutaArchivo=' +
                    encodeURIComponent(data.rutaArchivo) +
                    '&nombreArchivo=' +
                    encodeURIComponent(data.gitArchivo);

                document.getElementById('current-photo').src = imgUrl;
                document.getElementById('current-photo-container').style.display = 'block';
                document.getElementById('no-image-message').style.display = 'none';
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los datos del vehículo: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

function EliminarVehiculoCarga(id) {
    Swal.fire({
        title: 'Eliminar',
        text: "¿Seguro que deseas eliminar el siguiente registro?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            var parametro = { Id: id };
            PostMVC('/VehiculoCarga/DeleteVehiculoCarga', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El vehiculo de carga ha sido eliminado.', 'success')
                        .then(() => {
                            window.location.reload();
                        });
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el vehiculo: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}

// Función SaveOrUpdateVehiculoCarga
function SaveOrUpdateVehiculoCarga() {
    var descripcion = $("#descripcion").val();
    if (!descripcion || descripcion.trim() === '') {
        Swal.fire('Advertencia', 'Por favor ingrese la descripción.', 'warning');
        return;
    }

    var formData = new FormData();

    var id = $("#trabajadorInput").val() || 0;
    formData.append('Id', id);
    formData.append('Descripcion', descripcion);
    formData.append('Estatus', 1);
    formData.append('CreatedBy', $("#CreatedBy").val());
    formData.append('CreatedDt', $("#CreatedDt").val());
    formData.append('UpdatedBy', $("#UpdatedBy").val());
    formData.append('UpdatedDt', $("#UpdatedDt").val());

    var fotoInput = document.getElementById('fotografia');
    if (fotoInput.files.length > 0) {
        formData.append('Foto', fotoInput.files[0]);
    }

    Swal.fire({
        title: 'Guardando vehiculo',
        text: 'Por favor espere...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    $.ajax({
        url: '/VehiculoCarga/SaveOrUpdateVehiculoCarga',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            Swal.close();

            var r = typeof response === 'string' ? JSON.parse(response) : response;

            if (r.IsSuccess) {
                Swal.fire('Exito', 'Vehiculo guardado exitosamente.', 'success')
                    .then(() => {
                        GetAllVehiculoCarga();
                        limpiarFormulario();
                    });
            } else {
                Swal.fire('Error', r.ErrorMessage || 'Error al guardar el vehiculo', 'error');
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire('Error', 'Error al guardar el vehiculo: ' + (error || 'Error de conexion'), 'error');
        }
    });
}

// Función para limpiar el formulario
function limpiarFormulario() {
    $("#trabajadorInput").val('');
    $("#descripcion").val('');
    document.getElementById('fotografia').value = '';
    document.getElementById('preview-container').style.display = 'none';
    document.getElementById('current-photo-container').style.display = 'none';
    document.getElementById('no-image-message').style.display = 'block';
}

// Función para cargar datos al editar
function cargarDatosVehiculoCarga(id) {
    GetMVC("/VehiculoCarga/GetVehiculoCargaById/" + id, function (r) {
        if (r.IsSuccess) {
            var data = r.Response;

            if (data.rutaArchivo && data.gitArchivo) {
                var imgUrl = '/VehiculoCarga/VerImagenVehiculo?rutaArchivo=' +
                    encodeURIComponent(data.rutaArchivo) +
                    '&nombreArchivo=' +
                    encodeURIComponent(data.gitArchivo);

                document.getElementById('current-photo').src = imgUrl;
                document.getElementById('current-photo-container').style.display = 'block';
                document.getElementById('no-image-message').style.display = 'none';
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los datos del vehículo: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función GetAllVehiculoCarga
function GetAllVehiculoCarga() {
    GetMVC("/VehiculoCarga/GetAllVehiculoCarga", function (r) {
        if (r.IsSuccess) {
            if (r.Response && typeof r.Response === 'string') {
                r.Response = JSON.parse(r.Response);
            }

            var table = $("#tblVehiculoCarga").DataTable();
            table.clear();
            table.rows.add(r.Response).draw();
            table.responsive.recalc();

        } else {
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los vehículos de carga: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Función para nuevo vehículo
function NuevoVehiculoCarga() {
    limpiarFormulario();
    $("#trabajadorInput").val(0);
}

// Ajustar DataTables al redimensionar ventana
$(window).on('resize', function () {
    var table = $.fn.dataTable.Api('#tblVehiculoCarga');
    if (table) {
        table.responsive.recalc();
        table.columns.adjust();
    }
});