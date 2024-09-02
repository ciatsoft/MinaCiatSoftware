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
    [RoutePrefix("api/Cliente")]
    public class ClienteController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public ClienteController()
        {
            wrapper = new DbWrapper();
        }
        [AllowAnonymous]
        [Route("List"), HttpGet]
        public async Task<ModelResponse> GetAllCliente()
        {
            var result = wrapper.GetAllCliente();
            return result;
        }
        [AllowAnonymous]
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetClienteById(int id)
        {
            var result = wrapper.GetClienteById(id);
            return result;
        }
        [AllowAnonymous]
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateCliente(Cliente c)
        {
            var result = wrapper.SaveOrUpdateCliente(c);
            return result;
        }
    }
}
