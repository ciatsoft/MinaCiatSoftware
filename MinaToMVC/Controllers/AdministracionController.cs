using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.Security;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Runtime.Remoting.Messaging;
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
            IEnumerable<DireccionCliente> direccionporClientes;
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
                direccionporClientes = Enumerable.Empty<DireccionCliente>().ToArray();
            }
            ViewBag.MaterialesCliente = materialesPorClientes;

            return View(Cliente);
        }
        //------------------------------------------UbicacionCliente----------------------------------------------------
        public async Task<string> SaveOrUpdateDireccionCliente(DireccionCliente t)
        {
            httpClientConnection.MappingColumSecurity(t);
            var result = await httpClientConnection.SaveOrUpdateDireccionCliente(t);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<String> DeletDireccionCliente(long id)
        {
            var result = await httpClientConnection.DeleteDirreccionCliente(id);

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> GetAllDireccionCliente()
        {
            var result = await httpClientConnection.GetAllDireccionCliente();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }


        //------------------------------------------ClienteTipoMaterial----------------------------------------------------

        public async Task<string> SaveOrUpdateClienteTipoMaterial(ClienteTipoMaterial t)
        {


            httpClientConnection.MappingColumSecurity(t);
            var result = await httpClientConnection.SaveOrUpdateClienteTipoMaterial(t);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<string> DeleteClienteTipoMaterial(ClienteTipoMaterial t)
        {

            httpClientConnection.MappingColumSecurity(t);
            var result = await httpClientConnection.DeleteClienteTipoMaterial(t);
            return JsonConvert.SerializeObject(result);
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

        #region Partials Views
        public async Task<ActionResult> PartialConfiguracionCostosCliente(int clienteId, int materialId)
        {
            var precios = new List<ClienteTipoMaterial>();
            if (clienteId != 0 && materialId != 0)
            {
                // Llamar al servicio para obtener los datos
                var result = await httpClientConnection.GetClienteTipoMaterialByMaterial(clienteId, materialId);
                precios = JsonConvert.DeserializeObject<List<ClienteTipoMaterial>>(result.Response.ToString());
            }

            ViewBag.ClienteId = clienteId;
            ViewBag.MaterialId = materialId;
            ViewBag.Precios = precios;
            ViewBag.ClienteNombre = precios.FirstOrDefault()?.Cliente.Nombre ?? "N/A";
            ViewBag.MaterialNombre = precios.FirstOrDefault()?.TipoMaterial.NombreTipoMaterial ?? "N/A";

            return PartialView(precios);
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