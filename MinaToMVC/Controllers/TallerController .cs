using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoTaller;
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
            Vehiculo v = null;

            if (id != 0)
            {
                var modelResponse = await httpClientConnection.GetVehiculoById(id);
                v = JsonConvert.DeserializeObject<Vehiculo>(modelResponse.Response.ToString());
            }

            var trabajadores = new List<DtoTrabajador>();
            var vehiculos = new List<TipoVehiculo>();
            var areas = new List<DtoAreaTrabajo>();

            var responseVehiculo = await httpClientConnection.GetAllTipoVehiculo();
            vehiculos = JsonConvert.DeserializeObject<List<TipoVehiculo>>(responseVehiculo.Response.ToString());
            var tipovehiculos = MappingPropertiToDropDownList(vehiculos, "Id", "Nombre");

            var responsetrabajadores = await httpClientConnection.GetAllEmpleados();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            var token = Helpers.SessionHelper.GetSessionUser();
            var responseareas = await httpClientConnection.GetAllAreaTrabajo();
            areas = JsonConvert.DeserializeObject<List<DtoAreaTrabajo>>(responseareas.Response.ToString());

            ViewBag.vehiculos = tipovehiculos;
            ViewBag.trabajadores = trabajadores;
            ViewBag.areas = areas;

            return View(v);
        }
        public async Task<ActionResult> Inventario_Taller(long id = 0)
        {
            Inventario inventario = new Inventario();

            if( id != 0)
            {
                var result = await httpClientConnection.GetInventarioById(id);
                inventario = JsonConvert.DeserializeObject<Inventario>(result.Response.ToString());
            }

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            var categoriasInventarioResponse = await httpClientConnection.GetAllCategoriaInventario();
            var categoriaInventario = JsonConvert.DeserializeObject<List<CategoriaInventario>>(categoriasInventarioResponse.Response.ToString());
            var categoriaInventarioDdl = MappingPropertiToDropDownList<CategoriaInventario>(categoriaInventario, "Id", "Nombre");

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.CategoriaInventario = categoriaInventarioDdl;

            return View(inventario);
        }
        public async Task<ActionResult> CategoriaInventario(long id = 0)
        {
            CategoriaInventario categoriaInventario = new CategoriaInventario();

            if (id != 0)
            {
                var result = await httpClientConnection.GetCategoriaInventarioById(id);
                categoriaInventario = JsonConvert.DeserializeObject<CategoriaInventario>(result.Response.ToString());
            }

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

            return View(categoriaInventario);
        }

        public ActionResult Demo()
        {
            return View();
        }
        #endregion

        #region PartialViews

        public async Task<ActionResult> PartialComponenteVehiculo(long id)
        {
            ComponenteVehiculo componenteVehiculo = new ComponenteVehiculo();

            var inventarioResponse = await httpClientConnection.GetInventarioById(id);
            var inventario = JsonConvert.DeserializeObject<Inventario>(inventarioResponse.Response.ToString());

            var vehiculosResponse = await httpClientConnection.GetAllVehiculo();
            var vehiculos = JsonConvert.DeserializeObject<List<Vehiculo>>(vehiculosResponse.Response.ToString());

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };

            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            // Asignar valores al modelo principal
            componenteVehiculo.IdInventario = inventario.Id;
            componenteVehiculo.NombreInventario = inventario.Nombre;
            componenteVehiculo.CreatedBy = usuarioToken.UserName;
            componenteVehiculo.UpdatedBy = usuarioToken.UserName;
            componenteVehiculo.CreatedDt = DateTime.Now;
            componenteVehiculo.UpdatedDt = DateTime.Now;

            ViewBag.Inventario = inventario;
            ViewBag.Vehiculos = vehiculos;
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

            return PartialView(componenteVehiculo);
        }

        #endregion

        #region Data Acces

        #region Inventario

        public async Task<ActionResult> SaveOrUpdateInventario(Inventario inventario)
        {
            var r = await httpClientConnection.SaveOrUpdateInventario(inventario);
            return Redirect("Inventario_Taller");
        }
        public async Task<string> GetAllInventario()
        {
            var result = await httpClientConnection.GetAllInventario();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> DeleteInventarioById(long id)
        {
            var r = await httpClientConnection.DeleteInventarioById(id);
            return Redirect("Inventario_Taller");
        }
        #endregion

        #region CategoriaInventario

        public async Task<ActionResult> SaveOrUpdateCategoriaInventario(CategoriaInventario ci)
        {
            var r = await httpClientConnection.SaveOrUpdateCategoriaInventario(ci);
            return Redirect("CategoriaInventario");
        }
        public async Task<string> GetAllCategoriaInventario()
        {
            var result = await httpClientConnection.GetAllCategoriaInventario();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> DeleteCategoriaInventarioById(long id)
        {
            var r = await httpClientConnection.DeleteCategoriaInventarioById(id);
            return Redirect("CategoriaInventario");
        }


        #endregion

        #region ComponenteVehiculo
        public async Task<ActionResult> SaveOrUpdateComponenteVehiculo(ComponenteVehiculo ci)
        {
            var r = await httpClientConnection.SaveOrUpdateComponenteVehiculo(ci);
            return Redirect("Inventario_Taller");
        }
        public async Task<string> GetAllComponenteVehiculo()
        {
            var result = await httpClientConnection.GetAllComponenteVehiculo();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> DeleteComponenteVehiculoById(long id)
        {
            var r = await httpClientConnection.DeleteComponenteVehiculoById(id);
            return Redirect("Inventario_Taller");
        }
        #endregion


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