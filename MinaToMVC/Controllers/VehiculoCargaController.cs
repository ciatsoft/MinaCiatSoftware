using MinaTolEntidades;
using MinaTolEntidades.Security;
using MinaTolEntidades.VehiculoCarga;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.Remoting.Messaging;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    public class VehiculoCargaController : BaseController
    {
        #region Views

        #region VehiculoCarga
        public async Task<ActionResult> VehiculoCarga(long id = 0)
        {
            VehiculoCarga vc = new VehiculoCarga();

            if (id > 0)
            {
                var modelResponse = await httpClientConnection.GetVehiculoCargaById(id);
                vc = JsonConvert.DeserializeObject<VehiculoCarga>(modelResponse.Response.ToString());
            }

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.VehiculoCargaId = id;

            return View(vc);
        }
        #endregion

        #endregion

        #region PartialViews

        #endregion

        #region AccessData

        #region VehiculoCarga
        public async Task<string> SaveOrUpdateVehiculoCarga()
        {
            try
            {
                // Obtener los datos del formulario
                var Id = Request.Form["Id"];
                var Descripcion = Request.Form["Descripcion"];
                var Estatus = Request.Form["Estatus"];
                var CreatedBy = Request.Form["CreatedBy"];
                var CreatedDt = Request.Form["CreatedDt"];
                var UpdatedBy = Request.Form["UpdatedBy"];
                var UpdatedDt = Request.Form["UpdatedDt"];
                var archivo = Request.Files["Foto"];

                // Validar descripción
                if (string.IsNullOrEmpty(Descripcion))
                {
                    return Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        IsSuccess = false,
                        ErrorMessage = "La descripción es requerida"
                    });
                }

                // Validar ID
                if (!long.TryParse(Id, out long vehiculoId))
                {
                    vehiculoId = 0;
                }

                // 1. Obtener la ruta raíz del proyecto MVC
                string projectRootPath = HostingEnvironment.ApplicationPhysicalPath;

                // 2. Crear la ruta completa para la carpeta Attachment
                string baseAttachmentPath = Path.Combine(projectRootPath, "AttachmentVehiculosCarga");

                // 3. Verificar y crear carpeta Attachment si no existe
                if (!Directory.Exists(baseAttachmentPath))
                {
                    Directory.CreateDirectory(baseAttachmentPath);
                }

                string gitArchivo = string.Empty;
                string rutaArchivo = string.Empty;

                // 5. Procesar archivo si se subió
                if (archivo != null && archivo.ContentLength > 0)
                {
                    // Validar que sea una imagen
                    if (!archivo.ContentType.StartsWith("image/"))
                    {
                        return Newtonsoft.Json.JsonConvert.SerializeObject(new
                        {
                            IsSuccess = false,
                            ErrorMessage = "El archivo debe ser una imagen (JPEG, PNG, etc.)"
                        });
                    }

                    // Validar tamaño máximo (5MB)
                    if (archivo.ContentLength > 5 * 1024 * 1024)
                    {
                        return Newtonsoft.Json.JsonConvert.SerializeObject(new
                        {
                            IsSuccess = false,
                            ErrorMessage = "La imagen no debe superar los 5MB"
                        });
                    }

                    // Si estamos actualizando, eliminar la foto anterior si existe
                    if (vehiculoId > 0)
                    {
                        var existingResponse = await httpClientConnection.GetVehiculoCargaById(vehiculoId);

                        // Parsear la respuesta
                        var resultObj = JsonConvert.DeserializeObject<dynamic>(existingResponse.Response.ToString());
                        if (resultObj.IsSuccess && resultObj.Response != null)
                        {
                            var existingVc = JsonConvert.DeserializeObject<VehiculoCarga>(resultObj.Response.ToString());

                            if (!string.IsNullOrEmpty(existingVc.GitArchivo))
                            {
                                string oldFilePath = Path.Combine(existingVc.RutaArchivo, existingVc.GitArchivo);
                                if (System.IO.File.Exists(oldFilePath))
                                {
                                    System.IO.File.Delete(oldFilePath);
                                }
                            }
                        }
                    }

                    // OBTENER EL PRÓXIMO NÚMERO CONSECUTIVO BASADO EN LOS ARCHIVOS EXISTENTES
                    int siguienteNumero = ObtenerSiguienteNumeroConsecutivo(baseAttachmentPath);

                    // Obtener la extensión del archivo original
                    string extension = Path.GetExtension(archivo.FileName);

                    // Generar nombre único para el archivo
                    string fileName = $"VehiculoCarga_{siguienteNumero}{extension}";
                    string fullPath = Path.Combine(baseAttachmentPath, fileName);

                    // Guardar archivo en el sistema
                    archivo.SaveAs(fullPath);

                    gitArchivo = fileName;
                    rutaArchivo = baseAttachmentPath; // Solo la ruta SIN el nombre del archivo
                }
                else if (vehiculoId > 0)
                {
                    // Si no se subió nueva foto pero estamos editando, mantener la existente
                    var existingResponse = await httpClientConnection.GetVehiculoCargaById(vehiculoId);
                    var resultObj = JsonConvert.DeserializeObject<dynamic>(existingResponse.Response.ToString());

                    if (resultObj.IsSuccess && resultObj.Response != null)
                    {
                        var existingVc = JsonConvert.DeserializeObject<VehiculoCarga>(resultObj.Response.ToString());
                        gitArchivo = existingVc.GitArchivo;
                        rutaArchivo = existingVc.RutaArchivo;
                    }
                }

                // 6. Convertir el valor de Estatus de entero a booleano
                bool estatusBool = Estatus == "1";

                // 7. Crear objeto VehiculoCarga
                var vehiculo = new VehiculoCarga
                {
                    Id = vehiculoId,
                    Descripcion = Descripcion,
                    RutaArchivo = rutaArchivo, // Solo la ruta SIN el nombre del archivo
                    GitArchivo = gitArchivo, // Nombre del archivo con extensión
                    Estatus = estatusBool,
                    CreatedBy = CreatedBy,
                    CreatedDt = DateTime.Parse(CreatedDt),
                    UpdatedBy = UpdatedBy,
                    UpdatedDt = DateTime.Parse(UpdatedDt)
                };

                // 8. Guardar en base de datos
                var result = await httpClientConnection.SaveOrUpdateVehiculoCarga(vehiculo);

                return Newtonsoft.Json.JsonConvert.SerializeObject(result);
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error al guardar el vehículo: {ex.Message}"
                });
            }
        }

        private int ObtenerSiguienteNumeroConsecutivo(string folderPath)
        {
            try
            {
                // Verificar si la carpeta existe
                if (!Directory.Exists(folderPath))
                {
                    return 1; // Si no existe, empezar desde 1
                }

                // Obtener todos los archivos que coincidan con el patrón VehiculoCarga_*.ext
                var files = Directory.GetFiles(folderPath, "VehiculoCarga_*.*");

                if (files.Length == 0)
                {
                    return 1; // No hay archivos, empezar desde 1
                }

                // Extraer números de los nombres de archivo
                var numbers = new List<int>();

                foreach (var file in files)
                {
                    string fileName = Path.GetFileNameWithoutExtension(file);

                    // Verificar si el nombre sigue el patrón VehiculoCarga_123
                    if (fileName.StartsWith("VehiculoCarga_"))
                    {
                        string numberPart = fileName.Substring("VehiculoCarga_".Length);

                        if (int.TryParse(numberPart, out int number))
                        {
                            numbers.Add(number);
                        }
                    }
                }

                if (numbers.Count == 0)
                {
                    return 1;
                }

                // Encontrar el número más alto y sumar 1
                return numbers.Max() + 1;
            }
            catch (Exception)
            {
                // En caso de error, intentar obtener un número basado en timestamp
                return (int)(DateTime.Now.Ticks % 1000000);
            }
        }

        // Método para obtener todos los vehículos con URL completa
        public async Task<string> GetAllVehiculoCarga()
        {
            var result = await httpClientConnection.GetAllVehiculoCarga();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        // Método para obtener vehículo por ID con URL completa
        public async Task<string> GetVehiculoCargaById(long id)
        {
            var result = await httpClientConnection.GetVehiculoCargaById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        // Método auxiliar para limpiar nombres de archivo (opcional)
        private string LimpiarNombreArchivo(string nombre)
        {
            if (string.IsNullOrEmpty(nombre))
                return string.Empty;

            // Remover caracteres inválidos para nombres de archivo
            string invalidChars = new string(Path.GetInvalidFileNameChars());
            string pattern = "[" + Regex.Escape(invalidChars) + "]";

            return Regex.Replace(nombre, pattern, "_");
        }

        #region Anexo
        // Método para ver/descargar la imagen del vehículo (similar al de documentos)
        public ActionResult VerImagenVehiculo(string rutaArchivo, string nombreArchivo)
        {
            try
            {
                // Combina la ruta completa
                string rutaCompleta = Path.Combine(rutaArchivo, nombreArchivo);

                // Verifica que el archivo exista
                if (!System.IO.File.Exists(rutaCompleta))
                {
                    // Si no existe, mostrar una imagen por defecto
                    string defaultImagePath = Server.MapPath("~/Content/images/no-image-available.jpg");
                    if (System.IO.File.Exists(defaultImagePath))
                    {
                        return File(defaultImagePath, "image/jpeg");
                    }
                    else
                    {
                        // Crear una imagen simple en memoria
                        Bitmap bmp = new Bitmap(300, 300);
                        using (Graphics g = Graphics.FromImage(bmp))
                        {
                            g.Clear(Color.LightGray);
                            g.DrawString("Imagen no disponible",
                                        new Font("Arial", 12),
                                        Brushes.Black,
                                        new PointF(10, 140));
                        }

                        MemoryStream ms = new MemoryStream();
                        bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                        ms.Position = 0;

                        return File(ms, "image/jpeg", "no-image.jpg");
                    }
                }

                // Obtiene el tipo MIME del archivo
                string contentType = GetContentType(nombreArchivo);

                // Devuelve el archivo
                return File(rutaCompleta, contentType, nombreArchivo);
            }
            catch (Exception ex)
            {
                // Log del error si es necesario
                System.Diagnostics.Debug.WriteLine($"Error al mostrar imagen: {ex.Message}");

                // Devolver imagen por defecto
                return RedirectToAction("ImagenPorDefecto");
            }
        }

        // Método auxiliar para obtener el tipo MIME (reutilizable)
        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            switch (extension)
            {
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".png": return "image/png";
                case ".gif": return "image/gif";
                case ".bmp": return "image/bmp";
                case ".tiff": return "image/tiff";
                case ".webp": return "image/webp";
                case ".svg": return "image/svg+xml";
                case ".pdf": return "application/pdf";
                default: return "application/octet-stream";
            }
        }

        // Método para imagen por defecto
        public ActionResult ImagenPorDefecto()
        {
            Bitmap bmp = new Bitmap(300, 300);
            using (Graphics g = Graphics.FromImage(bmp))
            {
                g.Clear(Color.LightGray);
                g.DrawString("Imagen no disponible",
                            new Font("Arial", 12),
                            Brushes.Black,
                            new PointF(10, 140));
            }

            MemoryStream ms = new MemoryStream();
            bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            ms.Position = 0;

            return File(ms, "image/jpeg");
        }
        #endregion
        #endregion

        #endregion
    }
}