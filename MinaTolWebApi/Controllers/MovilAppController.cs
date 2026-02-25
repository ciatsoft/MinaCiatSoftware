using MinaTolEntidades;
using MinaTolEntidades.Security;
using MinaTolWebApi.DAL;
using MinaTolWebApi.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
            } else
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
        public async Task<ModelResponse> UpdatedVenta(long id, int valor)
        {
            var result = wrapper.UpdatedVenta(id, valor);
            return result;
        }
        #endregion
    }
}
