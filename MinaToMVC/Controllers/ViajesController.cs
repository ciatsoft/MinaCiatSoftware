using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.Security;
using MinaToMVC.DAL;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    [Autenticated]
    public class ViajesController : BaseController
    {
        // GET: Viajes
        #region Views
        public async Task<ActionResult> Internos(long id = 0)
        {
            var ubicaciones = new List<DtoUbicacion>();
            var tipoMateriales = new List<DtoTipoMaterialUbicacion>();
            var trabajadores = new List<DtoTrabajador>();
            var vehiculos = new List<Vehiculo>();
            var ViajeInterno = new DtoViajeInterno();
            var folio = new DtoFoliador();
            var clientes = new List<Cliente>();
            //vehiculos.Add(new Vehiculo()
            //{ 
            //    Id = 1,
            //    Placa = "ABC123"
            //});

            if (id != 0)
            {
                var result = await httpClientConnection.GetViajeInternoById(id);
                ViajeInterno = JsonConvert.DeserializeObject<DtoViajeInterno>(result.Response.ToString());
            }


            var responseClientes = await httpClientConnection.GetAllCliente();
            clientes = JsonConvert.DeserializeObject<List<Cliente>>(responseClientes.Response.ToString());

            string Nombre = "ViajesInternos";
            var responsefolio = await httpClientConnection.GetFoliadorByNombre(Nombre);
            folio = JsonConvert.DeserializeObject<DtoFoliador>(responsefolio.Response.ToString());

            var responseVehiculo = await httpClientConnection.GetAllVehiculo();
            vehiculos = JsonConvert.DeserializeObject<List<Vehiculo>>(responseVehiculo.Response.ToString());

            var responseUbicaciones = await httpClientConnection.GetAllUbicacion();
            ubicaciones = JsonConvert.DeserializeObject<List<DtoUbicacion>>(responseUbicaciones.Response.ToString());

            var responseTipoMaterial = await httpClientConnection.GetTipoMaterialByCliente(clientes.FirstOrDefault().Id);
            tipoMateriales = JsonConvert.DeserializeObject<List<DtoTipoMaterialUbicacion>>(responseTipoMaterial.Response.ToString());

            var responsetrabajadores = await httpClientConnection.GetAllEmpleados();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());



            ViewBag.Ubicaciones = ubicaciones;
            ViewBag.TipoMaterial = tipoMateriales;
            ViewBag.Trabajadores = trabajadores;
            ViewBag.Vehiculos = vehiculos;
            ViewBag.ViajeInterno = ViajeInterno;
            ViewBag.Clientes = clientes;
            ViewBag.Folio = folio;

            return View(ViajeInterno);
        }
        public async Task<ActionResult> Locales(long id = 0)
        {
            var ubicaciones = new List<DtoUbicacion>();
            var tipoMateriales = new List<ClienteTipoMaterial>();
            var trabajadores = new List<DtoTrabajador>();
            var vehiculos = new List<Vehiculo>();
            var unidadmedida = new List<UnidadMedida>();
            var clientes = new List<Cliente>();
            var folio = new DtoFoliador();

            var ViajeLocal = new DtoViajeLocal();

            var responseVehiculo = await httpClientConnection.GetAllVehiculo();
            vehiculos = JsonConvert.DeserializeObject<List<Vehiculo>>(responseVehiculo.Response.ToString());

            if (id != 0)
            {
                var result = await httpClientConnection.GetViajeLocalById(id);
                ViajeLocal = JsonConvert.DeserializeObject<DtoViajeLocal>(result.Response.ToString());
            }

            var responseClientes = await httpClientConnection.GetAllCliente();
            clientes = JsonConvert.DeserializeObject<List<Cliente>>(responseClientes.Response.ToString());

            var foliadorResponse = await httpClientConnection.GetFoliadorByNombre("ViajeAlmacenes");
            var foliador = JsonConvert.DeserializeObject<DtoFoliador>(foliadorResponse.Response.ToString());
            foliador.CalcualrConsecutivoString();
            ViewBag.Folio = "A" + foliador.ConsecutivoString;

            var responseUbicaciones = await httpClientConnection.GetAllUbicacion();
            ubicaciones = JsonConvert.DeserializeObject<List<DtoUbicacion>>(responseUbicaciones.Response.ToString());

            var responseTipoMaterial = await httpClientConnection.GetTipoMaterialByCliente(clientes.FirstOrDefault().Id);
            tipoMateriales = JsonConvert.DeserializeObject<List<ClienteTipoMaterial>>(responseTipoMaterial.Response.ToString());

            var responsetrabajadores = await httpClientConnection.GetAllEmpleados();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            var responseunidadmedida = await httpClientConnection.GetAllUnidadMedida();
            unidadmedida = JsonConvert.DeserializeObject<List<UnidadMedida>>(responseunidadmedida.Response.ToString());

            ViewBag.UnidadDeMedida = unidadmedida;

            ViewBag.Ubicaciones = ubicaciones;
            ViewBag.TipoMaterial = tipoMateriales;
            ViewBag.Trabajadores = trabajadores;
            ViewBag.Vehiculos = vehiculos;
            ViewBag.Clientes = clientes;
            
            return View(ViajeLocal);
        }
        public async Task<ActionResult> Concreteras(long id = 0)
        {
            var ubicaciones = new List<DtoUbicacion>();
            var tipoMateriales = new List<ClienteTipoMaterial>();
            var trabajadores = new List<DtoTrabajador>();
            var vehiculos = new List<Vehiculo>();
            var unidadmedida = new List<UnidadMedida>();
            var clientes = new List<Cliente>();
            var folio = new DtoFoliador();

            var ViajeLocal = new DtoViajeLocal();

            var responseVehiculo = await httpClientConnection.GetAllVehiculo();
            vehiculos = JsonConvert.DeserializeObject<List<Vehiculo>>(responseVehiculo.Response.ToString());

            if (id != 0)
            {
                var result = await httpClientConnection.GetViajeLocalById(id);
                ViajeLocal = JsonConvert.DeserializeObject<DtoViajeLocal>(result.Response.ToString());
            }

            var responseClientes = await httpClientConnection.GetAllCliente();
            clientes = JsonConvert.DeserializeObject<List<Cliente>>(responseClientes.Response.ToString());

            var foliadorResponse = await httpClientConnection.GetFoliadorByNombre("ViajeConcretera");
            var foliador = JsonConvert.DeserializeObject<DtoFoliador>(foliadorResponse.Response.ToString());
            foliador.CalcualrConsecutivoString();
            ViewBag.Folio = "C" + foliador.ConsecutivoString;

            var responseUbicaciones = await httpClientConnection.GetAllUbicacion();
            ubicaciones = JsonConvert.DeserializeObject<List<DtoUbicacion>>(responseUbicaciones.Response.ToString());

            var responseTipoMaterial = await httpClientConnection.GetTipoMaterialByCliente(clientes.FirstOrDefault().Id);
            tipoMateriales = JsonConvert.DeserializeObject<List<ClienteTipoMaterial>>(responseTipoMaterial.Response.ToString());

            var responsetrabajadores = await httpClientConnection.GetAllEmpleados();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            var responseunidadmedida = await httpClientConnection.GetAllUnidadMedida();
            unidadmedida = JsonConvert.DeserializeObject<List<UnidadMedida>>(responseunidadmedida.Response.ToString());

            ViewBag.UnidadDeMedida = unidadmedida;

            ViewBag.Ubicaciones = ubicaciones;
            ViewBag.TipoMaterial = tipoMateriales;
            ViewBag.Trabajadores = trabajadores;
            ViewBag.Vehiculos = vehiculos;
            ViewBag.Clientes = clientes;

            return View(ViajeLocal);
        }
        public async Task<ActionResult> ReportesViajesLocales(long id = 0)
        {
            var clientes = new List<Cliente>();

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

            var responseClientes = await httpClientConnection.GetAllCliente();
            clientes = JsonConvert.DeserializeObject<List<Cliente>>(responseClientes.Response.ToString());
            ViewBag.Clientes = clientes;

            string tipoCliente = ConfigurationManager.AppSettings["TipoCliente"];

            var opcionesCliente = tipoCliente.Split('|')
                .Select(opt =>
                {
                    var parts = opt.Split(':');
                    return new SelectListItem
                    {
                        Value = parts[0],
                        Text = parts[1]
                    };
                }).ToList();
            ViewBag.TipoCliente = opcionesCliente;

            return View();
        }
        public async Task<ActionResult> PreFactura(long id = 0)
        {
            var clientes = new List<Cliente>();

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

            return View();
        }
        #endregion
        #region DataAccess
        #region Viajes Internos
        public string SaveOrUpdateViajeInterno(DtoViajeInterno t)
        {

            var result = httpClientConnection.SaveOrUpdateViajeInterno(t);
            return JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllViajeInterno()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllViajeInterno(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion
        #region Viajes Locales
        public async Task<string> SaveOrUpdateViajeLocal(DtoViajeLocal t)
        {
            var result = await httpClientConnection.SaveOrUpdateViajeLocal(t);
            return JsonConvert.SerializeObject(result);
        }
        public async Task<string> DeleteViajeLocal(long id)
        {
            var result = await httpClientConnection.DeleteViajeLocal(id);
            return JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllViajeLocal()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllViajeLocal(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllViajeLocalByDates(DateTime fecha1, DateTime fecha2, string tipoCliente)
        {
            var result = await httpClientConnection.GetAllViajeLocalByDates(fecha1, fecha2, tipoCliente);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllViajeLocalByDatesFacturado(DateTime fecha1, DateTime fecha2)
        {
            var result = await httpClientConnection.GetAllViajeLocalByDatesFacturado(fecha1, fecha2);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> CheckPreFactura(long id, bool facturado)
        {
            var result = await httpClientConnection.CheckPreFactura(id, facturado);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllViajeLocalByDatesClientDireccion(DateTime fecha1, DateTime fecha2, long idCliente, long idDireccion)
        {
            var result = await httpClientConnection.GetAllViajeLocalByDatesClientDireccion(fecha1, fecha2, idCliente, idDireccion);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetTipoMaterialByCliente(long id)
        {
            var result = await httpClientConnection.GetTipoMaterialByCliente(id);
            return JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetTipoMaterialByUnicacion(long id)
        {
            var result = await httpClientConnection.GetTipoMaterialByUnicacion(id);
            return JsonConvert.SerializeObject(result);
        }
        public async Task<string> ObtenerDireccionCliente(long id)
        {
            var result = await httpClientConnection.ObtenerDireccionCliente(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetPrecioActivoClienteTipoMaterialByDireccionMaterialAndCliente(long idCliente, long idTipoMaterial, long idDireccion)
        {
            var result = await httpClientConnection.GetPrecioActivoClienteTipoMaterialByDireccionMaterialAndCliente(idCliente, idTipoMaterial, idDireccion);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion
        #endregion
    }
}