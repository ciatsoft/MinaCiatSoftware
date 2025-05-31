using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
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
    [RoutePrefix("api/ReporteVenta")]
    public class Reporte_VentaController : ApiController
    {

        private DbWrapper wrapper {  get; set; }
        public Reporte_VentaController()
        {
            wrapper = new DbWrapper();
        }

        [HttpGet, Route("List")]
        public ModelResponse GetAllReporte_Ventas()
        {
            var result = wrapper.GetAllReporte_Ventas();
            return result;
        }

        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateReporte_Venta(Reporte_Venta r)
        {
            var result = wrapper.SaveOrUpdateReporte_Venta(r);
            return result;
        }

    }
}
