using MinaTolEntidades;
using MinaTolEntidades.DtoSucursales;
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
    [RoutePrefix("api/UnidadMedida")]
    public class UnidadMedidaController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public UnidadMedidaController()
        {
            wrapper = new DbWrapper();
        }

        
        [Route("List"), HttpGet]
        public ModelResponse GetAllUnidadMedida()
        {
            var result = wrapper.GetAllUnidadMedida();
            return result;
        }

       
        [HttpGet , Route("{id:long}")]
        public ModelResponse GetUnidadMedidaById(long id)
        {
            var result = wrapper.GetUnidadMedidaById(id);
            return result;
        }

        [HttpPost, Route ("")]
        public ModelResponse SaveOrUpdateUnidadMedida(UnidadMedida unidad)
        {
            var result = wrapper.SaveOrUpdateUnidadMedida(unidad);
            return result;
        }
    }
}
