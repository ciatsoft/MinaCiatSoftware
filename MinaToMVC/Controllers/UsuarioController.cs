using MinaTolEntidades.Security;
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
    public class UsuarioController : BaseController
    {
     
        // GET: Usuario
        public ActionResult Index()
        {
            return View();
        }
        #region Usuario
        public async Task<ActionResult> AltaEdicion(long id = 0)
        {
            var usuario = new Usuario();
            if (id != 0)
            {
                var result = await httpClientConnection.GetUsuarioById(id);
                usuario = JsonConvert.DeserializeObject<Usuario>(result.Response.ToString());
            }
            return View(usuario);
        }
        public async Task<string> GetAllUsuario()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllUsuario(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public string SaveOrUpdateUsuario(Usuario u)
        {
            var result = httpClientConnection.SaveOrUpdateUsuario(u);
            return JsonConvert.SerializeObject(result);
        }


        #endregion

    }
}