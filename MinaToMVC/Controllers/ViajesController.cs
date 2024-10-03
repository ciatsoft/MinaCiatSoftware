using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoSucursales;
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
    public class ViajesController : BaseController
    {
        // GET: Viajes
        public async Task<ActionResult> Internos()
        {
            var ubicaciones = new List<DtoUbicacion>();
            var tipoMateriales = new List<DtoTipoMaterialUbicacion>();
            var trabajadores = new List<DtoTrabajador>();
            var vehiculos = new List<Vehiculo>();
            vehiculos.Add(new Vehiculo()
            { 
                Id = 1,
                Placa = "ABC123"
            });

            var responseUbicaciones = await httpClientConnection.GetAllUbicacion();
            ubicaciones = JsonConvert.DeserializeObject<List<DtoUbicacion>>(responseUbicaciones.Response.ToString());

            var responseTipoMaterial = await httpClientConnection.GetTipoMaterialByUnicacion(ubicaciones.FirstOrDefault().Id);
            tipoMateriales = JsonConvert.DeserializeObject<List<DtoTipoMaterialUbicacion>>(responseTipoMaterial.Response.ToString());

            var responsetrabajadores = await httpClientConnection.GetAllTrabajador();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            

            ViewBag.Ubicaciones = ubicaciones;
            ViewBag.TipoMaterial = tipoMateriales;
            ViewBag.Trabajadores = trabajadores;
            ViewBag.Vehiculos = vehiculos;

            return View();
        }
        public async Task<ActionResult> Locales(long id = 0)
        {
            var ubicaciones = new List<DtoUbicacion>();
            var tipoMateriales = new List<DtoTipoMaterialUbicacion>();
            var trabajadores = new List<DtoTrabajador>();
            var vehiculos = new List<Vehiculo>();
            var unidadmedida = new List<UnidadMedida>();
            var clientes = new List<Cliente>();

            var ViajeLocal = new DtoViajeLocal();
            vehiculos.Add(new Vehiculo()
            {
                Id = 1,
                Placa = "ABC123"
            });

            if (id != 0)
            {
                var result = await httpClientConnection.GetViajeLocalById(id);
                ViajeLocal = JsonConvert.DeserializeObject<DtoViajeLocal>(result.Response.ToString());
            }

            var responseUbicaciones = await httpClientConnection.GetAllUbicacion();
            ubicaciones = JsonConvert.DeserializeObject<List<DtoUbicacion>>(responseUbicaciones.Response.ToString());

            var responseTipoMaterial = await httpClientConnection.GetTipoMaterialByUnicacion(ubicaciones.FirstOrDefault().Id);
            tipoMateriales = JsonConvert.DeserializeObject<List<DtoTipoMaterialUbicacion>>(responseTipoMaterial.Response.ToString());

            var responsetrabajadores = await httpClientConnection.GetAllTrabajador();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            var responseClientes = await httpClientConnection.GetAllCliente();
            clientes = JsonConvert.DeserializeObject<List<Cliente>>(responseClientes.Response.ToString());

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
        public string SaveOrUpdateViajeLocal(DtoViajeLocal t)
        {

            var result = httpClientConnection.SaveOrUpdateViajeLocal(t);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<string> GetAllViajeLocal()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllViajeLocal(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
    }
}