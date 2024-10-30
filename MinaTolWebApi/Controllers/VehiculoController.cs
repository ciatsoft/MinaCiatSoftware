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
    [RoutePrefix("api/Vehiculo")]
    public class VehiculoController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public VehiculoController()
        {
            wrapper = new DbWrapper();
        }
        [Route("List"), HttpGet]
        public async Task <ModelResponse> GetAllVehiculo()
        {
            var result = wrapper.GetAllVehiculo();
            return result;
        }
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetVehiculoById( int id)
        {
            var result = wrapper.GetVehiculoById(id);
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateVehiculo(Vehiculo v)
        {
            var resutl = wrapper.SaveOrUpdateVehiculo(v);
            return resutl;
        }
    }
}
