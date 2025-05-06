using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using MinaTolEntidades.DtoVentaPublicoGeneral;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/PV_Precio")]
    public class PV_PrecioController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public PV_PrecioController()
        {
            wrapper = new DbWrapper();
        }

        [Route("List/{id:long}"), HttpGet]
        public ModelResponse GetPrecioByMaterialId(long id)
        {
            var result = wrapper.GetPV_PrecioByMaterial(id);
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetPV_PrecioById(int id)
        {
            var result = wrapper.GetPV_PrecioById(id);
            return result;
        }

        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdatePV_Precio(PV_Precio p)
        {
            var result = wrapper.SaveOrUpdatePV_Precio(p);
            return result;
        }
    }
}