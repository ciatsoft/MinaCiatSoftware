using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoTaller;
using MinaTolEntidades.Security;
using MinaToMVC.DAL;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Security;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    [Autenticated]
    public class EmpleadoController : BaseController
    {
        #region Vistas
        public ActionResult Index()
        {
            return View();
        }
        public async Task<ActionResult> AltaEdicion(long id = 0)
        {

            Empleado empleado = new Empleado();

            if (id != 0)
            {
                var response = await httpClientConnection.GetTrabajadorById(id);
                empleado = JsonConvert.DeserializeObject<Empleado>(response.Response.ToString());
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

            var departamentosResponse = await httpClientConnection.GetAllAreaTrabajo();
            var departamento = JsonConvert.DeserializeObject<List<DtoAreaTrabajo>>(departamentosResponse.Response.ToString());
            var departamentoDdl = MappingPropertiToDropDownList<DtoAreaTrabajo>(departamento, "Id", "Nombre");

            // Obtener el valor del Web.Config
            string diaNominaValue = ConfigurationManager.AppSettings["DiaNomina"];

            // Parsear las opciones (asumiendo el formato "V:Viernes|S:Sabado")
            var opciones = diaNominaValue.Split('|')
                .Select(opt =>
                {
                    var parts = opt.Split(':');
                    return new SelectListItem
                    {
                        Value = parts[0],
                        Text = parts[1]
                    };
                }).ToList();

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.DiaNominaOptions = opciones;
            ViewBag.Departamentos = departamentoDdl;

            ViewBag.EsEdicion = (id != 0);

            return View(empleado);

        }
        public async Task<ActionResult> ListaDocumentos(long id = 0)
        {
            Documentos documentos = new Documentos();

            if (id != 0)
            {
                var result = await httpClientConnection.GetDocumentoById(id);
                documentos = JsonConvert.DeserializeObject<Documentos>(result.Response.ToString());
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

            return View(documentos);
        }

        #endregion

        #region Vistas Parciales
        public ActionResult PartialCrudSalario(long id = 0)
        {
            ViewBag.TrabajadorId = id;
            return PartialView();
        }

        public ActionResult PartialDocumentosEmpleado(long id = 0)
        {

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
            ViewBag.TrabajadorId = id;

            return PartialView();
        }

        //Creamos vista parcial VAMOS A DEPURAR
        public async Task<ActionResult> PartialBajaEmpleado(long id = 0, string nombreCompleto = "")
        {
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

            // Aqui se viene este detalle de mandar como ViewBag
            ViewBag.TrabajadorId = id;
            ViewBag.NombreTrabajador = nombreCompleto;

            return PartialView();
        }

        #endregion

        #region Acceso a Datos

        #region Trabajador
        public async Task<string> GetAllEmpleados()
        {
            var result = await httpClientConnection.GetAllEmpleados();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllBajasEmpleado()
        {
            var result = await httpClientConnection.GetAllBajasEmpleado();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> RecontratarEmpleado(long id)
        {
            var result = await httpClientConnection.RecontratarEmpleado(id);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult> SaveOrUpdateTrabajador()
        {
            try
            {
                var empleadoData = Request.Form["empleadoData"];
                var t = JsonConvert.DeserializeObject<Empleado>(empleadoData);
                var archivoFoto = Request.Files["fotoEmpleado"];

                // Obtener ruta base
                string projectRootPath = HostingEnvironment.ApplicationPhysicalPath;
                string baseAttachmentPath = Path.Combine(projectRootPath, "Attachment");

                if (!Directory.Exists(baseAttachmentPath))
                {
                    Directory.CreateDirectory(baseAttachmentPath);
                }

                long empleadoId = t.Id;
                bool esNuevo = empleadoId == 0;
                bool tieneFotoNueva = archivoFoto != null && archivoFoto.ContentLength > 0;

                // Si es nuevo registro
                if (esNuevo)
                {
                    // Guardar empleado primero para obtener ID
                    var result = await httpClientConnection.SaveOrupdateEmpleado(t);

                    if (result == null || !result.IsSuccess)
                    {
                        return Json(new { success = false, message = "Error al guardar empleado" });
                    }

                    var empleadoResponse = JsonConvert.DeserializeObject<Empleado>(result.Response.ToString());
                    empleadoId = empleadoResponse.Id;
                    t.Id = empleadoId;

                    // Crear estructura de carpetas
                    string empleadoFolderPath = Path.Combine(baseAttachmentPath, $"Empleado_{empleadoId}");
                    Directory.CreateDirectory(empleadoFolderPath);
                    Directory.CreateDirectory(Path.Combine(empleadoFolderPath, "Documentos"));
                    Directory.CreateDirectory(Path.Combine(empleadoFolderPath, "Fotos"));
                }

                // Obtener datos actuales si es edición
                Empleado empleadoActual = null;
                if (!esNuevo)
                {
                    var empleadoActualResponse = await httpClientConnection.ObtenerDatosEmpleado(empleadoId);
                    if (empleadoActualResponse != null && empleadoActualResponse.IsSuccess)
                    {
                        empleadoActual = JsonConvert.DeserializeObject<Empleado>(empleadoActualResponse.Response.ToString());

                        // Si no viene foto nueva, mantener las rutas actuales
                        if (!tieneFotoNueva && empleadoActual != null)
                        {
                            t.RutaFoto = empleadoActual.RutaFoto;
                            t.GitFoto = empleadoActual.GitFoto;
                        }
                    }
                }

                // Manejar foto nueva si existe
                if (tieneFotoNueva)
                {
                    string fotosFolderPath = Path.Combine(baseAttachmentPath, $"Empleado_{empleadoId}", "Fotos");

                    // Validar extensión
                    string extension = Path.GetExtension(archivoFoto.FileName).ToLower();
                    string[] extensionesPermitidas = { ".jpg", ".jpeg", ".png", ".gif", ".bmp" };

                    if (!extensionesPermitidas.Contains(extension))
                    {
                        return Json(new { success = false, message = "Formato de imagen no válido" });
                    }

                    // Determinar nombre del archivo
                    string nombreArchivo = "";

                    if (!esNuevo && empleadoActual != null && !string.IsNullOrEmpty(empleadoActual.GitFoto))
                    {
                        // Mantener la misma extensión que la foto actual
                        string extensionExistente = Path.GetExtension(empleadoActual.GitFoto);
                        nombreArchivo = $"FotoEmpleado_{empleadoId}{extensionExistente}";
                    }
                    else
                    {
                        // Usar extensión de la nueva foto
                        nombreArchivo = $"FotoEmpleado_{empleadoId}{extension}";
                    }

                    string rutaCompletaArchivo = Path.Combine(fotosFolderPath, nombreArchivo);

                    // Eliminar archivo existente si existe
                    if (System.IO.File.Exists(rutaCompletaArchivo))
                    {
                        System.IO.File.Delete(rutaCompletaArchivo);
                    }

                    // Guardar nueva foto
                    archivoFoto.SaveAs(rutaCompletaArchivo);

                    // Actualizar propiedades
                    t.RutaFoto = Path.GetFullPath(fotosFolderPath + '\\');
                    t.GitFoto = nombreArchivo;
                }

                // Guardar/actualizar empleado
                var finalResult = await httpClientConnection.SaveOrupdateEmpleado(t);

                if (finalResult == null || !finalResult.IsSuccess)
                {
                    return Json(new { success = false, message = "Error al guardar los datos finales" });
                }

                return Json(new { success = true, id = empleadoId, message = "Empleado guardado exitosamente" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        public async Task<ActionResult> DeleteEmpleadoById(long id)
        {
            var r = await httpClientConnection.DeleteEmpleadoById(id);
            return Redirect("AltaEdicion");
        }
        public async Task<string> ObtenerDatosEmpleado(long id)
        {
            var result = await httpClientConnection.ObtenerDatosEmpleado(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> ObtenerFotoEmpleado(long id)
        {
            try
            {
                // Obtener el empleado desde el servicio
                var responseEmpleado = await httpClientConnection.ObtenerDatosEmpleado(id);

                if (responseEmpleado == null || !responseEmpleado.IsSuccess)
                {
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
                }

                // Deserializar la respuesta
                var empleado = JsonConvert.DeserializeObject<Empleado>(responseEmpleado.Response.ToString());

                if (empleado == null || string.IsNullOrEmpty(empleado.RutaFoto) || string.IsNullOrEmpty(empleado.GitFoto))
                {
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
                }

                // Combinar ruta y nombre de archivo
                string rutaCompletaFoto = Path.Combine(empleado.RutaFoto, empleado.GitFoto);

                if (!System.IO.File.Exists(rutaCompletaFoto))
                {
                    return Json(new { success = false }, JsonRequestBehavior.AllowGet);
                }

                // Leer y convertir la imagen
                byte[] imageBytes = System.IO.File.ReadAllBytes(rutaCompletaFoto);
                string base64String = Convert.ToBase64String(imageBytes);

                // Usar el tipo MIME adecuado
                string extension = Path.GetExtension(empleado.GitFoto).ToLower();
                string mimeType = extension == ".png" ? "image/png" :
                                 extension == ".gif" ? "image/gif" :
                                 extension == ".bmp" ? "image/bmp" : "image/jpeg";

                string imageSrc = $"data:{mimeType};base64,{base64String}";

                return Json(new
                {
                    success = true,
                    fotoBase64 = imageSrc
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region Salario
        public async Task<string> GetSalarioByTrabajador(long id)
        {
            var result = await httpClientConnection.GetSalarioByTrabajador(id);

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> SaveOrupdateSalario(DtoSalario s)
        {
            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };

            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();
            s.UpdatedBy = usuarioAutenticado?.UserName.ToString();
            s.CreatedBy = usuarioAutenticado?.UserName.ToString();
            //t.FechaContratacion = DateTime.Now;
            httpClientConnection.MappingColumSecurity(s);
            var result = await httpClientConnection.SaveOrUpdateSalario(s);
            return JsonConvert.SerializeObject(result);
        }
        #endregion

        #region Documentos
        public async Task<ActionResult> SaveOrUpdateDocumento(Documentos t)
        {
            var result = await httpClientConnection.SaveOrUpdateDocumento(t);
            return Redirect("ListaDocumentos");
        }

        public async Task<string> GetAllDocumentos()
        {
            var result = await httpClientConnection.GetAllDocumentos();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> DeleteDocumentoById(long id)
        {
            var result = await httpClientConnection.DeleteDocumentoById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion

        #region DocumentosEmpleados

        public async Task<string> GetAllDocumentosEmpleadoByIdTrabajador(long id)
        {
            var result = await httpClientConnection.GetAllDocumentosEmpleadoByIdTrabajador(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> DeleteDocumentoEmpleadoById(long id)
        {
            var result = await httpClientConnection.DeleteDocumentoEmpleadoById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> SaveOrUpdateDocumentosEmpleado()
        {
            try
            {
                // Obtener los datos del formulario
                var IdTrabajador = Request.Form["IdTrabajador"];
                var IdTipoDocumento = Request.Form["IdTipoDocumento"];
                var NombreDocumento = Request.Form["NombreDocumento"];
                var Fecha = Request.Form["Fecha"];
                var Estatus = Request.Form["Estatus"];
                var CreatedBy = Request.Form["CreatedBy"];
                var CreatedDt = Request.Form["CreatedDt"];
                var UpdatedBy = Request.Form["UpdatedBy"];
                var UpdatedDt = Request.Form["UpdatedDt"];
                var archivo = Request.Files["archivo"];

                // Validar que se haya subido un archivo
                if (archivo == null || archivo.ContentLength == 0)
                {
                    return Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        IsSuccess = false,
                        ErrorMessage = "No se ha seleccionado ningún archivo"
                    });
                }

                // Validar ID del trabajador
                if (string.IsNullOrEmpty(IdTrabajador) || !int.TryParse(IdTrabajador, out int trabajadorId))
                {
                    return Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        IsSuccess = false,
                        ErrorMessage = "ID de trabajador no válido"
                    });
                }

                // 1. Obtener la ruta raíz del proyecto MVC
                string projectRootPath = HostingEnvironment.ApplicationPhysicalPath;

                // 2. Crear la ruta completa para la carpeta Attachment
                string baseAttachmentPath = Path.Combine(projectRootPath, "Attachment");

                // 3. Verificar y crear carpeta Attachment si no existe
                if (!Directory.Exists(baseAttachmentPath))
                {
                    Directory.CreateDirectory(baseAttachmentPath);
                }

                // 4. Crear carpeta del empleado si no existe
                string empleadoFolderPath = Path.Combine(baseAttachmentPath, $"Empleado_{trabajadorId}");
                if (!Directory.Exists(empleadoFolderPath))
                {
                    Directory.CreateDirectory(empleadoFolderPath);
                }

                // 5. Crear subcarpeta Documentos si no existe
                string documentosPath = Path.Combine(empleadoFolderPath, "Documentos");
                if (!Directory.Exists(documentosPath))
                {
                    Directory.CreateDirectory(documentosPath);
                }

                // 6. Obtener la extensión del archivo original
                string extension = Path.GetExtension(archivo.FileName);

                // 7. Generar nombre único para el archivo con el formato: NombreDocumento_IdTrabajador
                // Limpiar el nombre del documento para quitar caracteres inválidos
                string nombreLimpio = LimpiarNombreArchivo(NombreDocumento);
                string fileName = $"{nombreLimpio}_{trabajadorId}{extension}";
                string fullPath = Path.Combine(documentosPath, fileName);

                // 8. Guardar archivo en el sistema
                archivo.SaveAs(fullPath);

                // 9. Convertir el valor de Estatus de entero a booleano
                bool estatusBool = Estatus == "1";

                // 10. Crear objeto DocumentosEmpleado
                var documento = new DocumentosEmpleado
                {
                    IdTrabajador = trabajadorId,
                    IdTipoDocumento = int.Parse(IdTipoDocumento),
                    NombreDocumento = NombreDocumento,
                    RutaArchivo = documentosPath, // Solo la ruta SIN el nombre del archivo
                    GitDocumento = fileName, // Nombre final del archivo: NombreDocumento_IdTrabajador.extension
                    Fecha = DateTime.Parse(Fecha),
                    Estatus = estatusBool,
                    CreatedBy = CreatedBy,
                    CreatedDt = DateTime.Parse(CreatedDt),
                    UpdatedBy = UpdatedBy,
                    UpdatedDt = DateTime.Parse(UpdatedDt)
                };

                // 11. Guardar en base de datos usando tu servicio existente
                var result = await httpClientConnection.SaveOrUpdateDocumentosEmpleado(documento);

                return Newtonsoft.Json.JsonConvert.SerializeObject(result);
            }
            catch (Exception ex)
            {
                return Newtonsoft.Json.JsonConvert.SerializeObject(new
                {
                    IsSuccess = false,
                    ErrorMessage = $"Error al guardar el documento: {ex.Message}"
                });
            }
        }

        // Método auxiliar para limpiar caracteres inválidos en nombres de archivo
        private string LimpiarNombreArchivo(string nombre)
        {
            if (string.IsNullOrEmpty(nombre))
                return "Documento";

            // Reemplazar espacios en blanco con guiones bajos
            nombre = nombre.Replace(" ", "_");

            // Remover caracteres inválidos para nombres de archivo
            string invalidChars = new string(Path.GetInvalidFileNameChars());
            foreach (char c in invalidChars)
            {
                nombre = nombre.Replace(c.ToString(), "");
            }

            // Limitar la longitud del nombre (máximo 50 caracteres)
            if (nombre.Length > 50)
                nombre = nombre.Substring(0, 50);

            // Si después de limpiar queda vacío, usar un nombre por defecto
            if (string.IsNullOrWhiteSpace(nombre))
                nombre = "Documento";

            return nombre.Trim();
        }

        public ActionResult DescargarDocumento(string rutaArchivo, string nombreArchivo)
        {
            try
            {
                // Combina la ruta completa
                string rutaCompleta = Path.Combine(rutaArchivo, nombreArchivo);

                // Verifica que el archivo exista
                if (!System.IO.File.Exists(rutaCompleta))
                {
                    // En lugar de HttpNotFound, redirige a una vista personalizada
                    ViewBag.NombreArchivo = nombreArchivo;
                    ViewBag.RutaArchivo = rutaArchivo;
                    return View();
                }

                // Obtiene el tipo MIME del archivo
                string contentType = GetContentType(nombreArchivo);

                // Devuelve el archivo
                return File(rutaCompleta, contentType, nombreArchivo);
            }
            catch (Exception ex)
            {
                return new HttpStatusCodeResult(500, $"Error al descargar el archivo: {ex.Message}");
            }
        }

        // Método auxiliar para obtener el tipo MIME
        private string GetContentType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            switch (extension)
            {
                case ".pdf": return "application/pdf";
                case ".doc": return "application/msword";
                case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                case ".xls": return "application/vnd.ms-excel";
                case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                case ".jpg": return "image/jpeg";
                case ".jpeg": return "image/jpeg";
                case ".png": return "image/png";
                case ".txt": return "text/plain";
                default: return "application/octet-stream";
            }
        }
        public async Task<string> GetDocumentoEmpleadoById(long id)
        {
            var result = await httpClientConnection.GetDocumentoEmpleadoById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion

        #endregion
    }
}