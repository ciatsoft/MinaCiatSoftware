using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/TipoMaterialUbicacion")]
    public class TipoMaterialUbicacionController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public TipoMaterialUbicacionController()
        {
            wrapper = new DbWrapper();
        }

        [Route("List"), HttpGet]
        public ModelResponse GetAllTipoMaterialUbicacion()
        {
            var result = wrapper.GetAllTipoMaterialUbicacion();
            return result;
        }
        [Route("Ubicacion/{id:long}"), HttpGet]
        public ModelResponse GetTipoMaterialByUnicacion(long id)
        {
            var result = wrapper.GetTipoMaterialByUnicacion(id);
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public ModelResponse GetTipoMaterialUbicacionById(int id)
        {
            var result = wrapper.GetTipoMaterialUbicacionById(id);
            return result;
        }

        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateTipoMaterialUbicacion(DtoTipoMaterialUbicacion tm
            )
        {
            var result = wrapper.SaveOrUpdateTipoMaterialUbicacion(tm);
            return result;
        }
    }
}
