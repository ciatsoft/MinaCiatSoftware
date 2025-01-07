using MinaTolEntidades.DtoClientes;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;


namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/ClienteTipoMaterial")]
    public class ClienteTipoMaterialController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public ClienteTipoMaterialController() { 
        wrapper = new DbWrapper();
        }

        [Route("{id:long}"), HttpGet]
        public ModelResponse GetTipoMaterialByCliente(long id)
        {
            var result = wrapper.GetTipoMaterialByCliente(id);
            return result;
        }

        [HttpPost, Route("Agregar")]
        public ModelResponse SaveOrUpdateClienteTipoMaterial(ClienteTipoMaterial t)
        {
            var resutl = wrapper.SaveOrUpdateClienteTipoMaterial(t);
            return resutl;
        }

        [HttpPost, Route("Eliminar")]
        public ModelResponse DeleteClienteTipoMaterial(ClienteTipoMaterial t)
        {
            var resutl = wrapper.DeleteClienteTipoMaterial(t);
            return resutl;
        }
    }
}