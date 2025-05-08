using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using MinaTolEntidades.DtoVentas;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/PV_Venta")]
    public class PV_VentaController : ApiController
    {
        private DbWrapper wrapper {  get; set; }
        public PV_VentaController() 
        {
            wrapper = new DbWrapper();
        }

        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdatePV_Venta(PV_Ventas v)
        {
            var result = wrapper.SaveOrUpdatePV_Venta(v);
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetPV_VentaById(int id)
        {
            var result = wrapper.GetPV_VentaById(id);
            return result;
        }

        [HttpGet, Route("List")]
        public async Task<ModelResponse> GetAllPV_Ventas()
        {
            var result = wrapper.GetAllPV_Venta();
            return result;
        }

        [HttpPost, Route("EstatusVenta/{id:long}/{valor}")]
        public async Task<ModelResponse> ActualizarEstatusVenta(long id, string valor)
        {
            var result = wrapper.ActualizarEstatusVenta((int)id, valor);
            return result;
        }

    }
}
