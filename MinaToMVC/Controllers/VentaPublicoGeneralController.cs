using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentas;
using MinaTolEntidades.Security;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    [Autenticated]
    public class VentaPublicoGeneralController : BaseController
    {
        #region View

        public async Task<ActionResult> Index()
        {
            var venta = new PV_Ventas();

            var ubicacionResponse = await httpClientConnection.GetAllUbicacion();
            var ubicacion = JsonConvert.DeserializeObject<List<DtoUbicacion>>(ubicacionResponse.Response.ToString());

            var materialesResponse = await httpClientConnection.GetAllTipoMaterialUbicacion();
            var materiales = JsonConvert.DeserializeObject<List<DtoTipoMaterialUbicacion>>(materialesResponse.Response.ToString());

            var formasPago = System.Configuration.ConfigurationManager.AppSettings["FormaPago"].ToString().Split('|').ToList();

            var unidadMedidaResponse = await httpClientConnection.GetAllUnidadMedida();
            var unidadMedida = JsonConvert.DeserializeObject<List<UnidadMedida>>(unidadMedidaResponse.Response.ToString());

            

            ViewBag.Ubicaciones = ubicacion;
            ViewBag.Materailes = materiales;
            ViewBag.FormasPago = formasPago;
            ViewBag.UnidadMedida = unidadMedida;

            return View(venta);
        }
        #endregion

    }
}