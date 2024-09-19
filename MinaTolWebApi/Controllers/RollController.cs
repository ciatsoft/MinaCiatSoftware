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
    [RoutePrefix("api/Roles")]
    public class RollController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public RollController()
        {
            wrapper = new DbWrapper();
        }
        [HttpGet, Route("")]
        public ModelResponse GetAllRoll()
        {
            var result = wrapper.GetAllRoll();
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateRoll(DtoRoles t)
        {
            var result = wrapper.SaveOrUpdateRoll(t);
            return result;
        }
    }

}
