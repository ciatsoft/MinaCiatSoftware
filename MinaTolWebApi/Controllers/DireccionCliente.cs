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
    [RoutePrefix("api/DireccionCliente")]
    public class DireccionClienteController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public DireccionClienteController()
        {
            wrapper = new DbWrapper();
        }
        
        
        [HttpGet, Route("ClienteById/{id:long}")]
        public ModelResponse GetDireccionClienteById(long id)
        {
            var result = wrapper.GetDireccionClienteById(id);
            return result;
        }

        [HttpGet, Route("ObtenerDireccionCliente/{id:long}")]
        public ModelResponse ObtenerDireccionCliente(long id)
        {
            var result = wrapper.ObtenerDireccionCliente(id);
            return result;
        }

        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateDireccionCliente(DireccionCliente at)
        {
            var result = wrapper.SaveOrUpdateDireccionCliente(at);
            return result;
        }
        [HttpDelete, Route("{id:long}")]
        public ModelResponse DeleteDireccionCliente(long id)
        {
            var result = wrapper.DeleteDireccionCliente(id);
            return result;
        }

        [HttpGet, Route("Cliente/{id:long}")]
        public ModelResponse GetDireccionesCliente(long id)
        {
            var result = wrapper.GetDireccionesCliente(id);
            return result;
        }
    }
}
