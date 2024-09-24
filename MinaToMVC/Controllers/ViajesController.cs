using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    [Autenticated]
    public class ViajesController : BaseController
    {
        // GET: Viajes
        public ActionResult Internos()
        {
            return View();
        }
    }
}