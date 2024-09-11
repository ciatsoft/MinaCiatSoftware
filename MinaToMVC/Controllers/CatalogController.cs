﻿using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
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
        public ActionResult AreaTrabajo()
        {
            return View();
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

        public async Task<string> GetAllTipoVehiculo()
        {
            // Llamada al método GetAllTipoVehiculo desde la capa de conexión HTTP.
            var result = await httpClientConnection.GetAllTipoVehiculo();
            return JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult> SaveOrUpdateTipoVehiculo(TipoVehiculo t)
        {
            // Mapeo de las columnas de seguridad antes de guardar o actualizar
            httpClientConnection.MappingColumSecurity(t);

            // Llamada para guardar o actualizar el tipo de vehículo
            var result = await httpClientConnection.SaveOrUpdateTipoVehiculo(t);

            // Redirigir a la vista de TipoVehiculo
            return RedirectToAction("TipoVehiculo", "Catalog");
        }

        public async Task<string> GetTipoVehiculoById(long id)
        {
            // Llamada al método GetTipoVehiculoById desde la capa de conexión HTTP.
            var result = await httpClientConnection.GetTipoDeVehiculoById(id);
            return JsonConvert.SerializeObject(result);
        }
        #endregion
    }
}