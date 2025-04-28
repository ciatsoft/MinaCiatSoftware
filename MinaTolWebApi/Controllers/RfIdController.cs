using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [AllowAnonymous]
    [RoutePrefix("api/Rfid")]
    public class RfidController : ApiController
    {
        private DbWrapper wrapper { get; set; }

        public RfidController()
        {
            wrapper = new DbWrapper();
        }

        [HttpGet, Route("{id}")]
        public IHttpActionResult ValidarRfid(string id)
        {
            var result = wrapper.SearchRfid(id);

            if (result.IsSuccess)
            {
                int resultado = (int)result.Response; // Ya no es dynamic, es directamente el entero

                if (resultado == 1)
                {
                    return Ok("1"); // Acceso permitido
                }
                else
                {
                    return Ok("0"); // Acceso denegado
                }
            }
            else
            {
                return InternalServerError(new Exception(result.Message));
            }
        }
    }
}