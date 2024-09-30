using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
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
    [RoutePrefix("api/AreaTrabajo")]
    public class AreaTrabajoController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public AreaTrabajoController()
        {
            wrapper = new DbWrapper();
        }
        
        [Route("List"), HttpGet]
        public ModelResponse GetAllAreaTrabajo()
        {
            var result = wrapper.GetAllAreaTrabajo();
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public ModelResponse GetAreaTrabajoById(int id)
        {
            var result = wrapper.GetAreaTrabajoById(id);
            return result;
        }


        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateAreaTrabajo(DtoAreaTrabajo at)
        {
            var result = wrapper.SaveOrUpdateAreaTrabajo(at);
            return result;
        }
    }
}
