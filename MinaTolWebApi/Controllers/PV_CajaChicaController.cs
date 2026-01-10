using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using MinaTolEntidades.DtoCatalogos;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/PV_CajaChica")]
    public class PV_CajaChicaController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public PV_CajaChicaController()
        {
            wrapper = new DbWrapper();
        }
        [HttpGet, Route("List")]
        public ModelResponse GetAllPV_CajaChica()
        {
            var result = wrapper.GetAllPV_CajaChica();
            return result;
        }
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetPV_CajaChicaById(int id)
        {
            var result = wrapper.GetPV_CajaChicaById(id);
            return result;
        }
        [HttpDelete, Route("{id:long}")]
        public async Task<ModelResponse> DeletePV_CajaChica(int id)
        {
            var result = wrapper.DeletePV_CajaChica(id);
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdatePV_CajaChica(PV_CajaChica t)
        {
            var result = wrapper.SaveOrUpdatePV_CajaChica(t);
            return result;
        }

        [HttpGet, Route("search")]
        public async Task<ModelResponse> SearchPV_VajaChicaByDateAndUser([FromUri] string userName,[FromUri] DateTime fecha)
        {
            var result = wrapper.SearchPV_VajaChicaByDateAndUser(userName, fecha);
            return result;
        }

        [HttpGet, Route("search/Reporte")]
        public async Task<ModelResponse> SearchPV_CajaChicaByDateAndUserAndCorteId([FromUri] string userName, [FromUri] DateTime fecha)
        {
            var result = wrapper.SearchPV_CajaChicaByDateAndUserAndCorteId(userName, fecha);
            return result;
        }



    }
}