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
    [Authorize]
    [RoutePrefix("api/Producto")]
    public class ProductoController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public ProductoController()
        {
            wrapper = new DbWrapper();
        }
        [Route("List"), HttpGet]
        public async Task<ModelResponse> GetAllProducto()
        {
            var result = wrapper.GetAllProducto();
            return result;
        }
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetPrecioById(int id)
        {
            var result = wrapper.GetPrecioById(id);
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateProducto(Producto p)
        {
            var result = wrapper.SaveOrUpdateProducto(p);
            return result;
        }
    }
}
