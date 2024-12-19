using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
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
    public class AdministracionController : BaseController
    {
        #region View
        [Autenticated]
        public ActionResult Index()
        {
            return View();
        }
        [NoAutenticated]
        public ActionResult Autenticacion()
        {
            return View();
        }
        [Autenticated]
        #region cliente

        public ActionResult PartialCrudMaterial()
        {
            return PartialView();
        }

        public async Task<ActionResult> Clientes(long id = 0)
        {
            var Cliente = new Cliente();
            if (id != 0)
            {
                var result = await httpClientConnection.GetClienteById(id);
                Cliente = JsonConvert.DeserializeObject<Cliente>(result.Response.ToString());
            }
            return View(Cliente);
        }
        public string SaveOrUpdateCliente(Cliente t)
        {

            var result = httpClientConnection.SaveOrUpdateCliente(t);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<string> GetAllCliente()
        {
            var result = await httpClientConnection.GetAllCliente();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion
        [Autenticated]
        public ActionResult Solicitudes()
        {
            return View();
        }
        [Autenticated]
        public ActionResult Precios()
        {
            return View();
        }
        [Autenticated]
        public ActionResult Gestion_Img()
        {
            return View();
        }
        [Autenticated]
        public ActionResult Ingresos()
        {
            return View();
        }
        [Autenticated]
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
        #endregion
    }
}