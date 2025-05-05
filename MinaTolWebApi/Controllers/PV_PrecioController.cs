using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;
using MinaTolWebApi.DAL;

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

        [Route("List"), HttpGet]
        public async Task<ModelResponse> GetAllPV_Precio()
        {
            var result = wrapper.GetAllPV_Precio();
            return result;
        }
        [Route("Ubicacion/{id:long}"), HttpGet]
        public ModelResponse GetPV_PrecioByPV_Material(long id)
        {
            var result = wrapper.GetTipoMaterialByUnicacion(id);
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetPV_PrecioById(int id)
        {
            var result = wrapper.GetPrecioById(id);
            return result;
        }

        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdatePV_Precio(Precio p)
        {
            var result = wrapper.SaveOrUpdatePrecio(p);
            return result;
        }
    }
}