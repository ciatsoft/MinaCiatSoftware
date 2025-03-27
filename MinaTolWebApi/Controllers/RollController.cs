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
    [Authorize]
    [RoutePrefix("api/Roll")]
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
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetRollById(int id)
        {
            var result = wrapper.GetRollById(id);
            return result;
        }
        [HttpDelete, Route("{id:long}")]
        public async Task<ModelResponse> DeleteRoll(int id)
        {
            var result = wrapper.DeleteRoll(id);
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateRoll(DtoRoll t)
        {
            var result = wrapper.SaveOrUpdateRoll(t);
            return result;
        }
    }

}
