using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
    public class CatalogController : BaseController
    {
        // GET: Catalog
        public ActionResult Index()
        {
            return View();
        }



        #region Unidad de Medida

        public ActionResult UnidadMedida()
        {
            return View();
        }
        public async Task<string> GetAllUnidadmedida()
        {
            var result = await httpClientConnection.GetAllUnidadMedida();
            return JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateUnidadMedida(UnidadMedida u)
        {
            httpClientConnection.MappingColumSecurity(u);
            var result = await httpClientConnection.SaveOrUpdateUnidadMedida(u);
            return RedirectToAction("UnidadMedida", "Catalog");

        }
        public async Task<string> GetUnidadMedidaById (long id )
        {
            var result = await httpClientConnection.GetUnidadMedidaById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion

        #region Area Trabajo
        public async Task<ActionResult> AreaTrabajo(long id = 0)
        {

            var areaTrabajo = new DtoAreaTrabajo();
            if (id != 0)
            {
                var result = await httpClientConnection.GetAreaTrabajoById(id);
                areaTrabajo = JsonConvert.DeserializeObject<DtoAreaTrabajo>(result.Response.ToString());
            }

            return View(areaTrabajo);
        }
        public async Task<string> GetAllAreaTrabajo()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllAreaTrabajo(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateAreaTrabajo(DtoAreaTrabajo ar)
        {
            httpClientConnection.MappingColumSecurity(ar);
            var result = await httpClientConnection.SaveOrUpdateAreaTrabajo(ar);
            return RedirectToAction("AreaTrabajo", "Catalog");
        }
        public async Task<string> GetAreaTrabajoById (long id)
        {
            var result = await httpClientConnection.GetAreaTrabajoById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion

        #region Tipo de Vehiculo

        public ActionResult TipoVehiculo()
        {
            return View();
        }

        #endregion
    }
}