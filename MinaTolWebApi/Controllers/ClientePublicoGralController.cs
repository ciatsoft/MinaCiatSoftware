using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using MinaTolEntidades;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolWebApi.DAL;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/ClientePublicoGral")]
    public class ClientePublicoGralController : ApiController
    {
        private DbWrapper wrapper {  get; set; }
        public ClientePublicoGralController()
        {
            wrapper = new DbWrapper();
        }

        [Route("List"), HttpGet]
        public async Task<ModelResponse> GetAllClientePublicoGral()
        {
            var result = wrapper.GetAllClientePublicoGral();
            return result;
        }

        [Route("{id:long}"), HttpGet]
        public async Task<ModelResponse> GetClientePublicoGralById(long id)
        {
            var result = wrapper.GetClientePublicoGralById(id);
            return result;
        }

        [Route(""), HttpPost]
        public async Task<ModelResponse> SaveOrUpdateClientePublicoGral(ClientePublicoGral c)
        {
            var result = wrapper.SaveOrUpdateClientePublicoGral(c);
            return result;
        }

        [Route("{id:long}"), HttpPost]
        public async Task<ModelResponse> DeleteClientePublicoGral(long id)
        {
            var result = wrapper.DeleteClientePublicoGral(id);
            return result;
        }
    }
}
