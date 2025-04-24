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
        [HttpGet, Route("{id}")]
        public IHttpActionResult ValidarRfid(string id)
        {
            var r = id;
            return Ok();
        }
    }

}
