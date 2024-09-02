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

        [AllowAnonymous]
        [Route("List"), HttpGet]
        public async Task<ModelResponse> GetAllUnidadMedida()
        {
            var result = wrapper.GetAllUnidadMedida();
            return result;
        }

        [AllowAnonymous]
        [HttpGet , Route("{id:long}")]
        public async Task<ModelResponse> GetUnidadMedidaById(int id)
        {
            var result = wrapper.GetUnidadMedidaById(id);
            return result;
        }

        [AllowAnonymous]
        [HttpPost, Route ("")]
        public async Task<ModelResponse> SaveOrUpdateUnidadMedida(UnidadMedida unidad)
        {
            var result = wrapper.SaveOrUpdateUnidadMedida(unidad);
            return result;
        }
    }
}
