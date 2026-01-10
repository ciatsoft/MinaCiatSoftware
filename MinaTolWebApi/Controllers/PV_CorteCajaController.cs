using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/PV_CorteCaja")]
    public class PV_CorteCajaController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public PV_CorteCajaController()
        {
            wrapper = new DbWrapper();
        }
        [HttpGet, Route("")]
        public ModelResponse GetAllPV_CorteCaja()
        {
            var result = wrapper.GetAllPV_CorteCaja();
            return result;
        }
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetPV_CorteCajaById(int id)
        {
            var result = wrapper.GetPV_CorteCajaById(id);
            return result;
        }
        [HttpDelete, Route("{id:long}")]
        public async Task<ModelResponse> DeletePV_CorteCaja(int id)
        {
            var result = wrapper.DeletePV_CorteCaja(id);
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdatePV_CorteCaja(PV_CorteCaja t)
        {
            var result = wrapper.SaveOrUpdatePV_CorteCaja(t);
            return result;
        }

        [HttpGet, Route("search")]
        public async Task<ModelResponse> SearchPV_DineroCajaByDateAndUser([FromUri] string userName, [FromUri] DateTime fecha)
        {
            var result = wrapper.SearchPV_DineroCajaByDateAndUser(userName, fecha);
            return result;
        }
    }
}