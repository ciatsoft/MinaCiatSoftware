using MinaTolEntidades;
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
    public class HomeController : BaseController
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
        public ActionResult Clientes()
        {
            return View();
        }
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
        [Autenticated]
        public ActionResult Inventario()
        {
            return View();
        }
        [Autenticated]
        public ActionResult Agregar()
        {
            return View();
        }
        [Autenticated]
        public ActionResult Editar()
        {
            return View();
        }
        [Autenticated]
        public ActionResult SolicitudesProcesadas()
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

        //Comentarios
        [Autenticated]
        public string LogOut()
        {
            // Cerrar la sesión
            SessionHelper.CloseSession();

            // Verificar si la cookie "ConfigMenu" existe y eliminarla
            if (Request.Cookies["ConfigMenu"] != null)
            {
                var c = new HttpCookie("ConfigMenu")
                {
                    Expires = DateTime.Now.AddDays(-1) // Expirar inmediatamente
                };
                Response.Cookies.Add(c);
            }

            // Redirigir al usuario a otra página
            Response.Redirect("~/Home/Authentication");

            // Convertir el objeto 'mr' a JSON y devolverlo como respuesta
            return JsonConvert.SerializeObject(mr);
        }

        #endregion
    }
}