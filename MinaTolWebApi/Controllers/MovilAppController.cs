using MinaTolEntidades;
using MinaTolEntidades.Security;
using MinaTolWebApi.DAL;
using MinaTolWebApi.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/MovilApp")]
    public class MovilAppController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public MovilAppController()
        {
            wrapper = new DbWrapper();
        }

        #region MovilAPP
        [AllowAnonymous]
        [HttpGet, Route("Login/{username}/{password}")]
        public async Task<ModelResponse> ValidateUserPassword(string username, string password)
        {
            password = Cryptography.Encrypt(password);
            var result = wrapper.ValidateUserPassword(username, password);
            if (result.Message == null && result.Response == null)
            {
                result.Message = "Usuario sin acceso.";
            }
            else
            {
                result.Message = "Usuario encontrado, sesion iniciada.";
            }
            return result;
        }

        [HttpGet, Route("GetVenta/{gitticket}")]
        public HttpResponseMessage GetVentaByGitTicket(string gitTicket)
        {
            var result = wrapper.GetVentaByGitTicket(gitTicket);

            // Serializar manualmente a JSON
            string jsonResult = JsonConvert.SerializeObject(result,
                new JsonSerializerSettings
                {
                    ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                    Formatting = Formatting.Indented
                });

            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(jsonResult, Encoding.UTF8, "application/json")
            };

            return response;
        }

        [HttpPost, Route("ActualizarVenta/{id:long}/{valor:int}")]
        public async Task<HttpResponseMessage> UpdatedVenta(long id, int valor)
        {
            try
            {
                if (!Request.Content.IsMimeMultipartContent())
                {
                    return Request.CreateErrorResponse(HttpStatusCode.UnsupportedMediaType,
                        "La petición debe ser multipart/form-data");
                }

                var provider = new MultipartMemoryStreamProvider();
                await Request.Content.ReadAsMultipartAsync(provider);

                string createdBy = "";
                DateTime createdDt = DateTime.Now;

                byte[] fotoBytes = null;
                string extension = ".jpg";

                foreach (var content in provider.Contents)
                {
                    var headers = content.Headers;
                    string fieldName = headers.ContentDisposition.Name?.Trim('"') ?? "";

                    switch (fieldName)
                    {
                        case "createdBy":
                            createdBy = await content.ReadAsStringAsync();
                            break;

                        case "createdDt":
                            string dateStr = await content.ReadAsStringAsync();
                            DateTime.TryParse(dateStr, out createdDt);
                            break;

                        case "foto":

                            if (content.Headers.ContentLength > 0)
                            {
                                string filename = headers.ContentDisposition.FileName?.Trim('"') ?? "foto.jpg";

                                extension = Path.GetExtension(filename);

                                if (string.IsNullOrEmpty(extension))
                                    extension = ".jpg";

                                fotoBytes = await content.ReadAsByteArrayAsync();
                            }

                            break;
                    }
                }

                var estatus = true;

                string nombreArchivo = $"{id}_{valor}_Foto{extension}";
                string rutaFoto = $"AttachmentFotosVentas\\";
                string gitFoto = nombreArchivo;

                // PRIMERO validar con el procedimiento almacenado
                var result = wrapper.UpdatedVenta(id, valor, rutaFoto, gitFoto, estatus, createdBy, createdDt);

                // Si el SP devuelve error NO guardar la foto
                if (!result.IsSuccess || !string.IsNullOrEmpty(result.Message))
                {
                    return Request.CreateResponse(HttpStatusCode.OK, result);
                }

                // GUARDAR FOTO SOLO SI TODO FUE CORRECTO
                if (fotoBytes != null)
                {
                    string basePath = AppDomain.CurrentDomain.BaseDirectory;

                    string mvcPath = Path.Combine(basePath, "..", "MinaToMVC", "AttachmentFotosVentas");

                    string fullPath = Path.GetFullPath(mvcPath);

                    if (!Directory.Exists(fullPath))
                    {
                        Directory.CreateDirectory(fullPath);
                    }

                    string rutaCompleta = Path.Combine(fullPath, nombreArchivo);

                    File.WriteAllBytes(rutaCompleta, fotoBytes);
                }

                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new ModelResponse
                {
                    IsSuccess = false,
                    Message = $"Error al guardar la foto: {ex.Message}",
                    Enum = Enumeration.ErrorNoControlado
                });
            }
        }
        #endregion
    }
}