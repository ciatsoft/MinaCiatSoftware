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

        public ActionResult UnidadMedida()
        {
            return View();
        }
        public async Task<string> GetAllUnidadmedida()
        {
            var result = await httpClientConnection.GetAllUnidadMedida();
            return JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateUnidadMedida(UnidadMedida u)
        {
            httpClientConnection.MappingColumSecurity(u);
            var result = await httpClientConnection.SaveOrUpdateUnidadMedida(u);
            return RedirectToAction("UnidadMedida", "Catalog");

        }
        public async Task<string> GetUnidadMedidaById (long id )
        {
            var result = await httpClientConnection.GetUnidadMedidaById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion

        #region Area Trabajo
        public async Task<ActionResult> AreaTrabajo(long id = 0)
        {

            var areaTrabajo = new DtoAreaTrabajo();
            if (id != 0)
            {
                var result = await httpClientConnection.GetAreaTrabajoById(id);
                areaTrabajo = JsonConvert.DeserializeObject<DtoAreaTrabajo>(result.Response.ToString());
            }

            return View(areaTrabajo);
        }
        public async Task<string> GetAllAreaTrabajo()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllAreaTrabajo(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateAreaTrabajo(DtoAreaTrabajo ar)
        {
            httpClientConnection.MappingColumSecurity(ar);
            var result = await httpClientConnection.SaveOrUpdateAreaTrabajo(ar);
            return RedirectToAction("AreaTrabajo", "Catalog");
        }
        public async Task<string> GetAreaTrabajoById (long id)
        {
            var result = await httpClientConnection.GetAreaTrabajoById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion

        #region Tipo de Vehiculo

        public async Task<ActionResult> TipoVehiculo(long id = 0)
        {

            TipoVehiculo tVehiculo;

        #region Ubicacion 
        public async Task<ActionResult> Ubicacion( long id = 0)
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllAreaTrabajo(token.Token.access_token);
            var areaDeUbicacion = JsonConvert.DeserializeObject<List<DtoUbicacion>>(result.Response.ToString());
            DtoUbicacion ubicacion;
            if (id != 0)
            {
                var response = await httpClientConnection.GetTipoDeVehiculoById(id);
                tVehiculo = JsonConvert.DeserializeObject<TipoVehiculo>(response.Response.ToString());
            }
            else
            
                ubicacion = new DtoUbicacion();
            ViewBag.AreaDeUbicacion = areaDeUbicacion;
            return View(ubicacion);
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

        #region Roles

        public async Task<ActionResult> Roll(long id = 0)
        {
            var tipoMaterial = new DtoTipoMaterialUbicacion();
            if (id != 0)
            {
                var result = await httpClientConnection.GetTipoMaterialUbicacionById(id);
                tipoMaterial = JsonConvert.DeserializeObject<DtoTipoMaterialUbicacion>(result.Response.ToString());
            }
            return View(tipoMaterial);
        }

            return View(roll);
        }
        /// <summary>
        /// El procedimiento nos permite guardar o actualizar los roles mediante un procedimiento almacenado
        /// </summary>
        /// <param name="t"> nos ayuda a pasar la inmformacion del formulario y ocuparla para el procedimiento almacenado</param>
        /// <returns></returns>
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
    }
        #endregion
    
}