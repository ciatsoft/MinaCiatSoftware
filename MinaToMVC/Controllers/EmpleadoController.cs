using MinaTolEntidades.DtoCatalogos;
using MinaToMVC.DAL;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
    public class EmpleadoController : BaseController
    {
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
    }
}