using MinaTolEntidades.DtoCatalogos;
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
    public class CatalogController : BaseController
    {
        // GET: Catalog
        public ActionResult Index()
        {
            return View();
        }



        #region Unidad de Medida

        public async Task<ActionResult> UnidadMedida(long id = 0)
        {

            var unidad = new UnidadMedida();
            if (id != 0)
            {
                var result = await httpClientConnection.GetUnidadMedidaById(id);
                unidad = JsonConvert.DeserializeObject<UnidadMedida>(result.Response.ToString());
            }

            return View(unidad);
        }
        public async Task<string> GetAllUnidadMedida()
        {
            var result = await httpClientConnection.GetAllUnidadMedida();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public string SaveOrUpdateUnidadMedida(UnidadMedida ar)
        {
            var result = httpClientConnection.SaveOrUpdateUnidadMedida(ar);
            return JsonConvert.SerializeObject(result);
        }

        #endregion

        #region Area Trabajo
        public async Task<ActionResult> AreaTrabajo(long id = 0)
        {

            var areat = new DtoAreaTrabajo();
            if (id != 0)
            {
                var result = await httpClientConnection.GetAreaTrabajoById(id);
                areat = JsonConvert.DeserializeObject<DtoAreaTrabajo>(result.Response.ToString());
            }

            return View(areat);
        }
        public async Task<string> GetAllAreaTrabajo()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllAreaTrabajo(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public string SaveOrUpdateAreaTrabajo(DtoAreaTrabajo ar)
        {
            var result = httpClientConnection.SaveOrUpdateAreaTrabajo(ar);
            return JsonConvert.SerializeObject(result);
        }

        #endregion

        #region Tipo de Vehiculo


        public async Task<ActionResult> TipoVehiculo(long id = 0)
        {
            TipoVehiculo tVehiculo;

            if (id != 0)
            {
                var response = await httpClientConnection.GetTipoDeVehiculoById(id);
                tVehiculo = JsonConvert.DeserializeObject<TipoVehiculo>(response.Response.ToString());
            }
            else
                tVehiculo = new TipoVehiculo();


            return View(tVehiculo);
        }
        public string SaveOrUpdateTipoVehiculo(TipoVehiculo tv)
        {

            var result = httpClientConnection.SaveOrUpdateTipoVehiculo(tv);
            return JsonConvert.SerializeObject(result);


        }
        public async Task<string> GetAllTipoVehiculo()
        {
            var result = await httpClientConnection.GetAllTipoVehiculo();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion

        #region Ubicacion 
        public async Task<ActionResult> Ubicacion( long id = 0)
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllAreaTrabajo(token.Token.access_token);
            var areaDeUbicacion = JsonConvert.DeserializeObject<List<DtoUbicacion>>(result.Response.ToString());
            DtoUbicacion ubicacion;
            if (id != 0)
            {
                var response = await httpClientConnection.GetUbicacionById(id);
                ubicacion = JsonConvert.DeserializeObject<DtoUbicacion>(response.Response.ToString());
            }
            else
            
                ubicacion = new DtoUbicacion();
				
            ViewBag.AreaDeUbicacion = areaDeUbicacion;
            return View(ubicacion);

        }
		
		


        public async Task<string> GetAllUbicacion()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllUbicacion();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }


        #endregion

        #region Roles
        public async Task<ActionResult> Roll(long id = 0)
        {
            var roll = new DtoRoll();
            if (id != 0)
            {
                var result = await httpClientConnection.GetRollById(id);
                roll = JsonConvert.DeserializeObject<DtoRoll>(result.Response.ToString());
            }
            return View(roll);
        }
        public string SaveOrUpdateRoll(DtoRoll t)
        {

            var result = httpClientConnection.SaveOrUpdateRoll(t);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<string> GetAllRoll()
        {
            var result = await httpClientConnection.GetAllRoll();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion

        #region TipoMaterialUbicacion
        public async Task<ActionResult> TipoMaterialUbicacion(long id = 0)
        {
            var tipoMaterial = new DtoTipoMaterialUbicacion();
            var ubicaciones = new List<DtoUbicacion>();
            var unidadmedida = new List<UnidadMedida>();

            // Si se proporciona un id, obtener el tipo de material de ubicación
            if (id != 0)
            {
                var result = await httpClientConnection.GetTipoMaterialUbicacionById(id);
                tipoMaterial = JsonConvert.DeserializeObject<DtoTipoMaterialUbicacion>(result.Response.ToString());
            }

            var responseUbicaciones = await httpClientConnection.GetAllUbicacion();
            ubicaciones = JsonConvert.DeserializeObject<List<DtoUbicacion>>(responseUbicaciones.Response.ToString());

            var responseunidadmedida = await httpClientConnection.GetAllUnidadMedida();
            unidadmedida = JsonConvert.DeserializeObject<List<UnidadMedida>>(responseunidadmedida.Response.ToString());

            ViewBag.Ubicaciones = ubicaciones;
            ViewBag.UnidadDeMedida = unidadmedida;
            //este por que marca error ino? intente hacer el foreach para el dll de unidad medida
            //foreach(var tipomateriales in tipoMaterial)
            //{
            //    tipomateriales.UnidadMedida = GetAllUnidadMedida(tipoMaterial.UnidadMedida);

            //}

            return View(tipoMaterial);
        }

        public string SaveOrUpdateTipoMaterialUbicacion(DtoTipoMaterialUbicacion t)
        {

            var result = httpClientConnection.SaveOrUpdateTipoMaterialUbicacion(t);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<string> GetAllTipoMaterialUbicacion()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllTipoMaterialUbicacion(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion
    }
}