using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoIngresosRfid;
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
    [AllowAnonymous]
    [RoutePrefix("api/IngresosRfid")]
    public class RfidController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        
        public ModelResponse GetAllIngresosRfid()
        {
            var result = wrapper.GetAllIngresosRfid();
            return result;
        }
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetIngresosRfidById(int id)
        {
            var result = wrapper.GetIngresosRfidById(id);
            return result;
        }
        [HttpDelete, Route("{id:long}")]
        public async Task<ModelResponse> DeleteIngresosRfid(int id)
        {
            var result = wrapper.DeleteIngresosRfid(id);
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateIngresosRfid(IngresosRfid t)
        {
            var result = wrapper.SaveOrUpdateIngresosRfid(t);
            return result;
        }
    }

}
