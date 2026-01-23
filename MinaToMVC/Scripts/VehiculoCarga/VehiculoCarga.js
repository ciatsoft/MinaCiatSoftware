$(document).ready(function () {
    // Inicializar DataTable
    $("#tblVehiculoCarga").dataTable({
        processing: true,
        destroy: true,
        paging: true,
        searching: true,
        columns: [
            { data: "id", visible: false, title: "Id" },
            { data: "descripcion", title: "Descripción" },
            {
                data: null,
                title: "Foto",
                render: function (data, type, row) {
                    if (row.rutaArchivo && row.gitArchivo) {
                        // Construir URL usando el patrón de documentos
                        var url = '/VehiculoCarga/VerImagenVehiculo?rutaArchivo=' +
                            encodeURIComponent(row.rutaArchivo) +
                            '&nombreArchivo=' +
                            encodeURIComponent(row.gitArchivo);

                        return '<img src="' + url + '" class="img-thumbnail" style="max-width: 80px; max-height: 80px; cursor: pointer;" ' +
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
        ],
        language: {
            // ... configuración de idioma se mantiene igual ...
        }
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

// Función para ampliar imagen (mejorada)
function ampliarImagen(url) {
    // Verificar si la URL es válida
    if (!url || url === '#') {
        Swal.fire({
            title: 'Sin imagen',
            text: 'No hay imagen disponible para mostrar',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    // Usar SweetAlert para mostrar la imagen ampliada
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
        // Validar que sea una imagen
        if (!file.type.match('image.*')) {
            Swal.fire('Error', 'Por favor seleccione un archivo de imagen válido.', 'error');
            document.getElementById('fotografia').value = '';
            return;
        }

        // Validar tamaño máximo (5MB)
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'La imagen no debe superar los 5MB.', 'error');
            document.getElementById('fotografia').value = '';
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            // Mostrar la vista previa
            document.getElementById('preview-image').src = e.target.result;
            document.getElementById('preview-container').style.display = 'block';
            document.getElementById('no-image-message').style.display = 'none';

            // Ocultar foto actual si existe
            document.getElementById('current-photo-container').style.display = 'none';

            // También actualizar la foto actual para que se use al guardar
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
    // Limpiar el input file
    document.getElementById('fotografia').value = '';

    // Ocultar vista previa
    document.getElementById('preview-container').style.display = 'none';
    document.getElementById('no-image-message').style.display = 'block';

    // Mostrar foto actual si existe
    var currentPhoto = document.getElementById('current-photo');
    if (currentPhoto.src && !currentPhoto.src.startsWith('data:')) {
        document.getElementById('current-photo-container').style.display = 'block';
    } else {
        document.getElementById('current-photo-container').style.display = 'none';
    }
}

// Función para editar vehículo de carga (mejorada)
function EditarVehiculoCarga(id) {
    // Incluir el ID como parámetro en la URL o en el cuerpo de la solicitud
    GetMVC("/VehiculoCarga/GetVehiculoCargaById/" + id, function (r) {
        if (r.IsSuccess) {
            var data = r.Response;
            // Obtener fecha actual en formato YYYY-MM-DD
            const today = new Date().toISOString().split('T')[0];
            $("#UpdatedDt").val(today);
            
            $("#trabajadorInput").val(data.id);
            $("#descripcion").val(data.descripcion);
            $("#CreatedBy").val(data.createdBy || '');
            $("#CreatedDt").val((data.createdDt) || '');
            $("#UpdatedDt").val(today);
            $("#UpdatedBy").val(data.createdBy);
            
            // Mostrar la imagen actual si existe
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
            console.error('Error en la respuesta:', r.ErrorMessage);
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
        title: '¿Está seguro?',
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
            PostMVC('/VehiculoCarga/DeleteVehiculoCarga', parametro, function (r) {
                if (r.IsSuccess) {
                    Swal.fire('Eliminado', 'El vehículo de carga ha sido eliminado.', 'success')
                        .then(() => {
                            // Recargar la tabla después de eliminar
                            GetAllVehiculoCarga();
                        });
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el vehículo: ' + r.ErrorMessage, 'error');
                }
            });
        }
    });
}

// Modificar la función SaveOrUpdateVehiculoCarga
function SaveOrUpdateVehiculoCarga() {
    // Validar campos básicos
    var descripcion = $("#descripcion").val();
    if (!descripcion || descripcion.trim() === '') {
        Swal.fire('Advertencia', 'Por favor ingrese la descripción del vehículo.', 'warning');
        return;
    }

    // Crear FormData para enviar datos
    var formData = new FormData();

    // Agregar datos básicos
    var id = $("#trabajadorInput").val() || 0;
    formData.append('Id', id);
    formData.append('Descripcion', descripcion);
    formData.append('Estatus', 1);
    formData.append('CreatedBy', $("#CreatedBy").val());
    formData.append('CreatedDt', $("#CreatedDt").val());
    formData.append('UpdatedBy', $("#UpdatedBy").val());
    formData.append('UpdatedDt', $("#UpdatedDt").val());

    // Agregar archivo si existe
    var fotoInput = document.getElementById('fotografia');
    if (fotoInput.files.length > 0) {
        formData.append('Foto', fotoInput.files[0]);
    }

    // Mostrar indicador de carga
    Swal.fire({
        title: 'Guardando vehículo',
        text: 'Por favor espere...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Enviar al servidor
    $.ajax({
        url: '/VehiculoCarga/SaveOrUpdateVehiculoCarga',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            Swal.close();

            // Parsear la respuesta JSON
            var r = typeof response === 'string' ? JSON.parse(response) : response;

            if (r.IsSuccess) {
                Swal.fire('Éxito', 'Vehículo guardado exitosamente.', 'success')
                    .then(() => {
                        // Recargar la tabla después de guardar
                        GetAllVehiculoCarga();
                        // Opcional: Limpiar el formulario
                        limpiarFormulario();
                    });
            } else {
                Swal.fire('Error', r.ErrorMessage || 'Error al guardar el vehículo', 'error');
            }
        },
        error: function (xhr, status, error) {
            Swal.close();
            Swal.fire('Error', 'Error al guardar el vehículo: ' + (error || 'Error de conexión'), 'error');
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

// Función para cargar datos al editar (nueva)
function cargarDatosVehiculoCarga(id) {
    GetMVC("/VehiculoCarga/GetVehiculoCargaById/" + id, function (r) {
        if (r.IsSuccess) {
            var data = r.Response;
            console.log('Datos del vehículo de carga:', data);

            // Mostrar la imagen actual si existe
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
            console.error('Error en la respuesta:', r.ErrorMessage);
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los datos del vehículo: ' + r.ErrorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}

// Modificar GetAllVehiculoCarga
function GetAllVehiculoCarga() {
    GetMVC("/VehiculoCarga/GetAllVehiculoCarga", function (r) {
        if (r.IsSuccess) {
            // Asegurar que 'Response' contenga los datos
            if (r.Response && typeof r.Response === 'string') {
                r.Response = JSON.parse(r.Response);
            }

            // Destruir y recrear la DataTable
            var table = $("#tblVehiculoCarga").DataTable();
            table.destroy();

            // Limpiar la tabla
            $("#tblVehiculoCarga tbody").empty();

            // Reinicializar la DataTable con los nuevos datos
            $("#tblVehiculoCarga").dataTable({
                processing: true,
                destroy: true,
                paging: true,
                searching: true,
                data: r.Response,
                columns: [
                    { data: "id", visible: false, title: "Id" },
                    { data: "descripcion", title: "Descripción" },
                    {
                        data: null,
                        title: "Foto",
                        render: function (data, type, row) {
                            if (row.rutaArchivo && row.gitArchivo) {
                                var url = '/VehiculoCarga/VerImagenVehiculo?rutaArchivo=' +
                                    encodeURIComponent(row.rutaArchivo) +
                                    '&nombreArchivo=' +
                                    encodeURIComponent(row.gitArchivo);

                                return '<img src="' + url + '" class="img-thumbnail" style="max-width: 80px; max-height: 80px; cursor: pointer;" ' +
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
                ],
                language: {
                    // ... configuración de idioma se mantiene igual ...
                }
            });
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

// Función para nuevo vehículo (opcional)
function NuevoVehiculoCarga() {
    limpiarFormulario();
    $("#trabajadorInput").val(0); // ID 0 para nuevo registro
}