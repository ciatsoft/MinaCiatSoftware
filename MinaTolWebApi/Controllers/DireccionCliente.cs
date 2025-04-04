using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
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
    [Authorize]
    [RoutePrefix("api/DireccionCliente")]
    public class DireccionClienteController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public DireccionClienteController()
        {
            wrapper = new DbWrapper();
        }
        
        [Route("List"), HttpGet]
        public ModelResponse GetAllDireccionCliente()
        {
            var result = wrapper.GetAllDireccionCliente();
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public ModelResponse GetDireccionClienteById(int id)
        {
            var result = wrapper.GetDireccionClienteById(id);
            return result;
        }

        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateDireccionCliente(DireccionCliente at)
        {
            var result = wrapper.SaveOrUpdateDireccionCliente(at);
            return result;
        }
        [HttpDelete, Route("{id:long}")]
        public ModelResponse DeleteDireccionCliente(int id)
        {
            var result = wrapper.DeleteDireccionCliente(id);
            return result;
        }
    }
}
