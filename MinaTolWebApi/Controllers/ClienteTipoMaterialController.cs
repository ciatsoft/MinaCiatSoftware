using MinaTolEntidades.DtoClientes;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/ClienteTipoMaterial")]
    public class ClienteTipoMaterialController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        [Route("{id:long}"), HttpGet]
        public ModelResponse GetTipoMaterialByCliente(long id)
        {
            var result = wrapper.GetTipoMaterialByCliente(id);
            return result;
        }
    }
}