using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
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
    [RoutePrefix("api/TipoVehiculo")]
    public class TipoVehiculoController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public TipoVehiculoController()
        {
            wrapper = new DbWrapper();
        }
        [HttpGet, Route("")]
        public ModelResponse GetAllTipoVehiculo()
        {
            var result = wrapper.GetAllTipoVehiculo();
            return result;
        }
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetTipoDeVehiculoById(int id)
        {
            var result = wrapper.GetTipoDeVehiculoById(id);
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateTipoVehiculo(TipoVehiculo t)
        {
            var result = wrapper.SaveOrUpdateTipoVehiculo(t);
            return result;
        }
    }

}
