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
        public string GetAllTrabajadores()
        {
            var empleados = new List<DtoTrabajador>();
            empleados.Add(new DtoTrabajador()
            {
                Id = 1,
                Nombre = "Empleado 1",
                Email = "empleado2@empleado.com",
                Telefono = "4426341470"

            });
            empleados.Add(new DtoTrabajador()
            {
                Id = 1,
                Nombre = "Empleado 2",
                Email = "empleado@empleado.com",
                Telefono = "7821409487"

            });
            empleados.Add(new DtoTrabajador()
            {
                Id = 1,
                Nombre = "Empleado 3",
                Email = "empleado3@empleado.com",
                Telefono = "7821176433"

            });
            mr.IsSuccess = true;
            mr.Response = empleados;

            return Newtonsoft.Json.JsonConvert.SerializeObject(mr);
        }

        public string SaveOrupdateTrabajador(DtoTrabajador t)
        {
            t.FechaContratacion = DateTime.Now;
            var result = httpClientConnection.SaveOrupdateTrabajador(t);
            return JsonConvert.SerializeObject(result);
        }
        #endregion

    }
}