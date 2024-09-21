﻿using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
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
            var unidadmedida = new UnidadMedida();
            if (id !=0)
            {
                var result = await httpClientConnection.GetUnidadMedidaById(id);
                unidadmedida = JsonConvert.DeserializeObject<UnidadMedida>(result.Response.ToString());
            }
            return View(unidadmedida);
        }
        public async Task<string> GetAllUnidadmedida()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllUnidadMedida(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
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

        public ActionResult TipoVehiculo()
        {
            return View();
        }

        #endregion

        #region Ubicacion 
        public async Task<ActionResult> Ubicacion( long id = 0)
        {
            var ubicacion = new DtoUbicacion();
            if (id != 0)
            {
                var result = await httpClientConnection.GetUbicacionById(id);
                ubicacion = JsonConvert.DeserializeObject<DtoUbicacion>(result.Response.ToString());
            }
            return View(ubicacion);

        }

        public async Task<string> GetAllUbicacion()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllUbicacion(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult> SaveOrUpdateUbicacion(DtoUbicacion u)
        {
            httpClientConnection.MappingColumSecurity(u);
            var result = await httpClientConnection.SaveOrUpdateUbicacion(u);
            return RedirectToAction("Ubicacion", "Catalog");
        }

        public async Task<string> GetUbicacionById(long id)
        {
            var result = await httpClientConnection.GetUbicacionById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }


        #endregion

        #region TipoMaterialUbicacion
        public async Task<ActionResult> TipoMaterialUbicacion(long id= 0)
        {
            var tipoMaterial = new DtoTipoMaterialUbicacion();
            if (id != 0)
            {
                var result = await httpClientConnection.GetTipoMaterialUbicacionById(id);
                tipoMaterial = JsonConvert.DeserializeObject<DtoTipoMaterialUbicacion>(result.Response.ToString());
            }
            return View(tipoMaterial);
        }

        public async Task<string> GetAllTipoMaterialUbicacion()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllTipoMaterialUbicacion(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult> SaveOrUpdateTipoMaterialUbicacion(DtoTipoMaterialUbicacion tmu)
        {
            httpClientConnection.MappingColumSecurity(tmu);
            var result = await httpClientConnection.SaveOrUpdateTipoMaterialUbicacion(tmu);
            return RedirectToAction("TipoMaterialUbicacion", "Catalog");

        }

        public async Task<string> GetTipoMaterialUbicacionById(long id)
        {
            var result = await httpClientConnection.GetTipoMaterialUbicacionById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion



    }

}