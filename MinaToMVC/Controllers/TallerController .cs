using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoSucursales;
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
    public class TallerController : BaseController
    {
        #region View
        
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Autenticacion()
        {
            return View();
        }
        public async Task<ActionResult> Vehiculos(long id = 0)
        {
            var trabajadores = new List<DtoTrabajador>();
            var vehiculos = new List<TipoVehiculo>();
            var areas = new List<DtoAreaTrabajo>();

            var responseVehiculo = await httpClientConnection.GetAllTipoVehiculo();
            vehiculos = JsonConvert.DeserializeObject<List<TipoVehiculo>>(responseVehiculo.Response.ToString());

            var responsetrabajadores = await httpClientConnection.GetAllTrabajador();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            var token = Helpers.SessionHelper.GetSessionUser();
            var responseareas = await httpClientConnection.GetAllAreaTrabajo(token.Token.access_token);
            areas = JsonConvert.DeserializeObject<List<DtoAreaTrabajo>>(responseareas.Response.ToString());

            ViewBag.vehiculos = vehiculos;
            ViewBag.trabajadores = trabajadores;
            ViewBag.areas = areas;

            return View();
        }
        public ActionResult Inventario_Taller()
        {
            return View();
        }
        public ActionResult ReportesCStock()
        {
            return View();
        }
        public ActionResult Reportes_SStock()
        {
            return View();
        }
        
        #endregion

        #region Data Acces
        [HttpPost]
        public async Task<string> FirstAutentication(string user, string pass)
        {
            pass = Cryptography.Encrypt(pass);

            Token token = await httpClientConnection.GetToken(user, pass);

            if (token != null)
            {
                var responseAutenticated = await httpClientConnection.ValidateUserName(user, token.access_token);
                var userAutenticated = JsonConvert.DeserializeObject<Usuario>(responseAutenticated.Response.ToString());
                token.ExpirationDate = DateTime.Now.AddSeconds(token.expires_in);
                var tokenCookie = new TokenCookie()
                {
                    Token = token,
                    UserID = userAutenticated.Id,
                    UserName = user
                };

                SessionHelper.CreateSession(JsonConvert.SerializeObject(tokenCookie));
            }

            return JsonConvert.SerializeObject(mr);
        }

        [Autenticated]
        public string LogOut()
        {
            SessionHelper.CloseSession();
            if (Request.Cookies["ConfigMenu"] != null)
            {
                var c = new HttpCookie("ConfigMenu")
                {
                    Expires = DateTime.Now.AddDays(-1)
                };
                Response.Cookies.Add(c);
            }
            return JsonConvert.SerializeObject(mr);
        }
        #endregion
    }
}