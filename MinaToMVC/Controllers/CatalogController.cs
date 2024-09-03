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
        #endregion
    }
}