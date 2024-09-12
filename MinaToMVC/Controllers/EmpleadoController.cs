using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaToMVC.DAL;
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
    public class EmpleadoController : BaseController
    {
        #region Vistas
        public ActionResult Index()
        {
            return View();
        }
        public async Task<ActionResult> AltaEdicion()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllAreaTrabajo(token.Token.access_token);
            var areasDeTrabajo = JsonConvert.DeserializeObject<List<DtoAreaTrabajo>>(result.Response.ToString());

            ViewBag.AreasDeTrabajo = areasDeTrabajo;

            return View();
        }
        #endregion

        #region Vistas Parciales
        public ActionResult PartialCrudSalario()
        {
            return PartialView();
        }
        #endregion

        #region Acceso a Datos
        public async Task<string> GetAllTrabajadores()
        {
            var result = await httpClientConnection.GetAllTrabajador();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> SaveOrupdateTrabajador(DtoTrabajador t)
        {
            //t.FechaContratacion = DateTime.Now;
            var result = await httpClientConnection.SaveOrupdateTrabajador(t);
            return JsonConvert.SerializeObject(result);
        }
        #endregion

    }
}