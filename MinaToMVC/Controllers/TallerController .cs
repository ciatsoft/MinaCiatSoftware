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
        public ActionResult Vehiculos()
        {
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