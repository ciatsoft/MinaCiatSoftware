using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
    public class CatalogController : Controller
    {
        // GET: Catalog
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult UnidadMedida()
        {
            return View();
        }
    }
}