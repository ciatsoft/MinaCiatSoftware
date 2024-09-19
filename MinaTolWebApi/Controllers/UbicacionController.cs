using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/Ubicacion")]
    public class UbicacionController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public UbicacionController()
        {
            wrapper = new DbWrapper();
        }
        [Route("List"), HttpGet]
        public ModelResponse GetAllUbicacion()
        {
            var result = wrapper.GetAllUbicacion();
            return result;
        }
        [HttpGet, Route("{id:long}")]

        public ModelResponse GetUbicacionById (int id)
        {
            var result = wrapper.GetUbicacionById(id);
            return result;
        }

        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateUbicacion(DtoUbicacion u)
        {
            var result = wrapper.SaveOrUpdateUbicacion(u);
            return result;
        }
    }

}
