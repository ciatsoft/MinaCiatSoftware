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
    [RoutePrefix("api/Precio")]
    public class PrecioController : ApiController
    {
        private DbWrapper wrapper{ get; set; }
        public PrecioController()
        {
            wrapper = new DbWrapper();
        }
        
        [Route("List"), HttpGet]
        public async Task<ModelResponse> GetAllPrecio()
        {
            var result = wrapper.GetAllPrecio();
            return result;
        }
        
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetPrecioById(int id)
        {
            var result = wrapper.GetPrecioById(id);
            return result;
        }
        
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdatePrecio(Precio p)
        {
            var result = wrapper.SaveOrUpdatePrecio(p);
            return result;
        }

    }
}
