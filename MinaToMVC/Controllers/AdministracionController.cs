using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.Security;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    [Autenticated]
    public class AdministracionController : BaseController
    {
        #region View
        public ActionResult Index()
        {
            return View();
        }
        [NoAutenticated]
        public ActionResult Autenticacion()
        {
            return View();
        }
        public ActionResult PartialCrudMaterial()
        {
            return PartialView();
        }
        public async Task<ActionResult> Clientes(long id = 0)
        {
            var Cliente = new Cliente();
            IEnumerable<ClienteTipoMaterial> materialesPorClientes;
            if (id != 0)
            {
                var result = await httpClientConnection.GetClienteById(id);
                Cliente = JsonConvert.DeserializeObject<Cliente>(result.Response.ToString());

                var materialesPorClientesResponse = await httpClientConnection.GetTipoMaterialByCliente(id);
                materialesPorClientes = JsonConvert.DeserializeObject<List<ClienteTipoMaterial>>(materialesPorClientesResponse.Response.ToString());


            }
            else
            {
                materialesPorClientes = Enumerable.Empty<ClienteTipoMaterial>().ToArray();
            }
            ViewBag.MaterialesCliente = materialesPorClientes;

            return View(Cliente);
        }
        public string SaveOrUpdateCliente(Cliente t)
        {

            var result = httpClientConnection.SaveOrUpdateCliente(t);
            return JsonConvert.SerializeObject(result);
        }


        public ActionResult Solicitudes()
        {
            return View();
        }
        public ActionResult Precios()
        {
            return View();
        }
        public ActionResult Gestion_Img()
        {
            return View();
        }
        public ActionResult Ingresos()
        {
            return View();
        }
        public ActionResult General()
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

        public async Task<string> GetAllCliente()
        {
            var result = await httpClientConnection.GetAllCliente();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion
    }
}