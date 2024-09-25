﻿using MinaTolEntidades.DtoCatalogos;
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

            var responseUbicaciones = await httpClientConnection.GetAllUbicacion();
            ubicaciones = JsonConvert.DeserializeObject<List<DtoUbicacion>>(responseUbicaciones.Response.ToString());

            var responseTipoMaterial = await httpClientConnection.GetTipoMaterialByUnicacion(ubicaciones.FirstOrDefault().Id);
            tipoMateriales = JsonConvert.DeserializeObject<List<DtoTipoMaterialUbicacion>>(responseTipoMaterial.Response.ToString());

            var responsetrabajadores = await httpClientConnection.GetAllTrabajador();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            ViewBag.Ubicaciones = ubicaciones;
            ViewBag.TipoMaterial = tipoMateriales;
            ViewBag.Trabajadores = trabajadores;
            return View();
        }
    }
}