using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoEmpleados;
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
        public async Task<ActionResult> RFIDCarga(long id = 0)
        {
            RFIDCarga vc = new RFIDCarga();

            if (id > 0)
            {
                var modelResponse = await httpClientConnection.GetRFIDCargaById(id);
                vc = JsonConvert.DeserializeObject<RFIDCarga>(modelResponse.Response.ToString());
            }
            else
            {
                // SOLO para nuevos registros, establecer la fecha actual
                vc.FechaHora = DateTime.Now;
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

            var trabajadoresResponse = await httpClientConnection.GetAllEmpleados();
            var trabajadores = JsonConvert.DeserializeObject<List<Empleado>>(trabajadoresResponse.Response.ToString());
            var trabajadoresDdl = trabajadores.Select(e => new SelectListItem{Value = e.Id.ToString(),Text = $"{e.Nombre} {e.ApellidoPaterno} {e.ApellidoMaterno}".Trim()}).ToList();

            var vehiculosCargaResponse = await httpClientConnection.GetAllVehiculoCarga();
            var vehiculosCarga = JsonConvert.DeserializeObject<List<VehiculoCarga>>(vehiculosCargaResponse.Response.ToString());
            var vehiculosCargaDdl = MappingPropertiToDropDownList<VehiculoCarga>(vehiculosCarga, "Id", "Descripcion");

            ViewBag.Trabajadores = trabajadoresDdl;
            ViewBag.VehiculosCarga = vehiculosCargaDdl;
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.rfidCargaId = id;

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

                // Validar ID
                if (!long.TryParse(Id, out long vehiculoId))
                {
                    vehiculoId = 0;
                }

                // Datos del path
                string projectRootPath = HostingEnvironment.ApplicationPhysicalPath;
                string baseAttachmentPath = Path.Combine(projectRootPath, "AttachmentVehiculosCarga");

                if (!Directory.Exists(baseAttachmentPath))
                {
                    Directory.CreateDirectory(baseAttachmentPath);
                }

                string gitArchivo = string.Empty;
                string rutaArchivo = string.Empty;

                VehiculoCarga vehiculoExistente = null;

                // 1. Si vehiculoId > 0, obtener datos existentes
                if (vehiculoId > 0)
                {
                    var registroEncontrado = await httpClientConnection.GetVehiculoCargaById(vehiculoId);
                    if (registroEncontrado.Response != null && registroEncontrado.IsSuccess)
                    {
                        vehiculoExistente = JsonConvert.DeserializeObject<VehiculoCarga>(registroEncontrado.Response.ToString());
                    }
                }

                // Procesar archivo si se subió uno
                if (archivo != null && archivo.ContentLength > 0)
                {
                    // CASO 1: Actualización (vehiculoId > 0) - Sobreescribir archivo existente
                    if (vehiculoId > 0 && vehiculoExistente != null)
                    {
                        // Mantener el mismo nombre de archivo (sobreescribir)
                        gitArchivo = vehiculoExistente.GitArchivo;
                        rutaArchivo = vehiculoExistente.RutaArchivo;

                        string fullPath = Path.Combine(rutaArchivo, gitArchivo);

                        // Guardar archivo (sobreescribir)
                        archivo.SaveAs(fullPath);
                    }
                    // CASO 2: Registro nuevo (vehiculoId <= 0) - Crear nuevo archivo con consecutivo
                    else
                    {
                        // OBTENER EL PRÓXIMO NÚMERO CONSECUTIVO
                        int siguienteNumero = ObtenerSiguienteNumeroConsecutivo(baseAttachmentPath);

                        // Obtener la extensión del archivo original
                        string extension = Path.GetExtension(archivo.FileName);

                        // Generar nombre único para el archivo
                        string fileName = $"VehiculoCarga_{siguienteNumero}{extension}";
                        string fullPath = Path.Combine(baseAttachmentPath, fileName);

                        // Guardar archivo en el sistema
                        archivo.SaveAs(fullPath);

                        gitArchivo = fileName;
                        rutaArchivo = baseAttachmentPath;
                    }
                }
                // No se subió archivo
                else
                {
                    if (vehiculoId > 0 && vehiculoExistente != null)
                    {
                        // Mantener los datos del archivo existente
                        gitArchivo = vehiculoExistente.GitArchivo;
                        rutaArchivo = vehiculoExistente.RutaArchivo;
                    }
                    else
                    {
                        // Nuevo registro sin archivo
                        gitArchivo = string.Empty;
                        rutaArchivo = string.Empty;
                    }
                }

                // Convertir el valor de Estatus
                bool estatusBool = Estatus == "1";

                // Crear objeto VehiculoCarga
                var vehiculo = new VehiculoCarga
                {
                    Id = vehiculoId,
                    Descripcion = Descripcion,
                    RutaArchivo = rutaArchivo,
                    GitArchivo = gitArchivo,
                    Estatus = estatusBool,
                    CreatedBy = vehiculoId > 0 && vehiculoExistente != null ? vehiculoExistente.CreatedBy : CreatedBy,
                    CreatedDt = vehiculoId > 0 && vehiculoExistente != null ? vehiculoExistente.CreatedDt : DateTime.Parse(CreatedDt),
                    UpdatedBy = UpdatedBy,
                    UpdatedDt = DateTime.Parse(UpdatedDt)
                };

                // Guardar en base de datos
                var result = await httpClientConnection.SaveOrUpdateVehiculoCarga(vehiculo);

                return JsonConvert.SerializeObject(result);
            }
            catch (Exception ex)
            {
                return JsonConvert.SerializeObject(new
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
        public async Task<string> DeleteVehiculoCarga(long id)
        {
            var result = await httpClientConnection.DeleteVehiculoCarga(id);
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

        #region RFIDCarga
        public async Task<string> GetAllRFIDCarga()
        {
            var result = await httpClientConnection.GetAllRFIDCarga();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetRFIDCargaById(long id)
        {
            var result = await httpClientConnection.GetRFIDCargaById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetRFIDCargaByRFID(string rfid)
        {
            var result = await httpClientConnection.GetRFIDCargaByRFID(rfid);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> DeleteRFIDCarga(long id)
        {
            var result = await httpClientConnection.DeleteRFIDCarga(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> DevueltoRFIDCarga(long id)
        {
            var result = await httpClientConnection.DevueltoRFIDCarga(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> NoDevueltoRFIDCarga(long id)
        {
            var result = await httpClientConnection.NoDevueltoRFIDCarga(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> SaveOrUpdateRFIDCarga(RFIDCarga rc)
        {
            var result = await httpClientConnection.SaveOrUpdateRFIDCarga(rc);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetRFIDCargaByDates(DateTime fechaInicio, DateTime fechaFin)
        {
            var result = await httpClientConnection.GetRFIDCargaByDates(fechaInicio, fechaFin);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion

        #endregion
    }
}