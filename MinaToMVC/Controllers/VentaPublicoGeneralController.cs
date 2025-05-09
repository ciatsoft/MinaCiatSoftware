using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentas;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.DtoVentaPublicoGeneral;      
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
using System.Security.Cryptography;

namespace MinaToMVC.Controllers
{
    [Autenticated]
    public class VentaPublicoGeneralController : BaseController
    {
        #region View

        public async Task<ActionResult> Index()
        {
            var venta = new PV_Ventas();

            var ubicacionResponse = await httpClientConnection.GetAllUbicacion();
            var ubicacion = JsonConvert.DeserializeObject<List<DtoUbicacion>>(ubicacionResponse.Response.ToString()).Where(x => x.EsInterna);
            var ubicacionDdl = MappingPropertiToDropDownList<DtoUbicacion>(ubicacion, "Id", "NombreUbicacion");

            var materialUbicacionResponse = await httpClientConnection.GetMaterialUbicacionByUbicacion(ubicacion.FirstOrDefault().Id);
            var materialUbicacion = JsonConvert.DeserializeObject<List<MaterialUbicacion>>(materialUbicacionResponse.Response.ToString());
            var listadoMaterial = new List<DtoTipoMaterialUbicacion>();
            var listaPV_Material = new List<PV_Material>();
            foreach (var i in materialUbicacion)
            {
                listadoMaterial.Add(i.Material);
            }
            var materiales = MappingPropertiToDropDownList<DtoTipoMaterialUbicacion>(listadoMaterial, "Id", "NombreTipoMaterial");
            var PV_Material = MappingPropertiToDropDownList<PV_Material>(listaPV_Material, "Id", "NombreTipoMaterial");

            var formasPago = System.Configuration.ConfigurationManager.AppSettings["FormaPago"].ToString().Split('|').ToList();

            var unidadMedidaResponse = await httpClientConnection.GetAllUnidadMedida();
            var unidadMedida = JsonConvert.DeserializeObject<List<UnidadMedida>>(unidadMedidaResponse.Response.ToString());

            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();
            

            ViewBag.Ubicaciones = ubicacionDdl;
            ViewBag.Materiales = materiales;
            ViewBag.FormasPago = formasPago;
            ViewBag.UnidadMedida = unidadMedida;
            ViewBag.UserToken = usuarioAutenticado;

            return View(venta);
        }

        public async Task<ActionResult> Precios(long id = 0)
        {
            var precios = new PV_Precio();

            if (id != 0)
            {
                var precioResponse = await httpClientConnection.GetPV_PrecioById(id);
                precios = JsonConvert.DeserializeObject<PV_Precio>(precioResponse.Response.ToString());
            }

            var ubicacionResponse = await httpClientConnection.GetAllUbicacion();
            var ubicacion = JsonConvert.DeserializeObject<List<DtoUbicacion>>(ubicacionResponse.Response.ToString()).Where(x => x.EsInterna);
            var ubicacionDdl = MappingPropertiToDropDownList<DtoUbicacion>(ubicacion, "Id", "NombreUbicacion");

            ViewBag.Ubicaciones = ubicacionDdl;

            return View(precios);
        }

        #endregion

        #region Partial View
        public async Task<ActionResult> PartialMaterialCargaPrecio(long id = 0)
        {
            var materialUbicacionResponse = await httpClientConnection.GetMaterialUbicacionByUbicacion(id);
            var materialUbicacion = JsonConvert.DeserializeObject<List<MaterialUbicacion>>(materialUbicacionResponse.Response.ToString());
            var listadoMaterial = new List<DtoTipoMaterialUbicacion>();
            foreach (var i in materialUbicacion)
            {
                listadoMaterial.Add(i.Material);
            }
            var materiales = MappingPropertiToDropDownList<DtoTipoMaterialUbicacion>(listadoMaterial, "Id", "NombreTipoMaterial");
            ViewBag.Materiales = materiales;

            return PartialView();
        }
        #endregion

        #region Data Acces
        public ActionResult SaveOrUpdateVenta()
        {
            return Redirect("VentaPublicoGeneral/Index");
        }

        public async Task<string> GetMaterialUbicacionByUbicacion(long id)
        {
            var result = await httpClientConnection.GetMaterialUbicacionByUbicacion(id);
            return JsonConvert.SerializeObject(result);
        }
        #endregion

        #region Precio
        public async Task<string> GetPreciosBymaterialId(long id)
        {
            var result = await httpClientConnection.GetPrecioByMaterialId(id);
            return JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdatePrecioMaterial(PV_Precio precio)
        {
            var r = await httpClientConnection.SaveOrUpdatePV_Precio(precio);
            return Redirect("Precios");
        }
        public async Task<string> DeletePV_Precio(long id)
        {
            var result = await httpClientConnection.DeletePV_Precio(id);
            return JsonConvert.SerializeObject(result);
        }
        
        public async Task<string> GetPV_PrecioByPV_Material(int id)
        {
            var result = await httpClientConnection.GetPV_PrecioByPV_Material(id);
            return JsonConvert.SerializeObject(result);
        }

        #endregion
        #region  CajaChica
                public async Task<ActionResult> PV_CajaChica(long id = 0)
                {
                    var roll = new PV_CajaChica();
                    if (id != 0)
                    {
                        var result = await httpClientConnection.GetPV_CajaChicaById(id);
                        roll = JsonConvert.DeserializeObject<PV_CajaChica>(result.Response.ToString());
                    }
                    return View(roll);
                }
                public async Task<string> SaveOrUpdatePV_CajaChica(PV_CajaChica r)
                {

                    var result = await httpClientConnection.SaveOrUpdatePV_CajaChica(r);
                    return JsonConvert.SerializeObject(result);
                }

                public async Task<string> GetAllPV_CajaChica()
                {
                    var result = await httpClientConnection.GetAllPV_CajaChica();

                    return Newtonsoft.Json.JsonConvert.SerializeObject(result);
                }
                public async Task<String> DeletePV_CajaChica(long id)
                {
                    var result = await httpClientConnection.DeletePV_CajaChica(id);

                    return Newtonsoft.Json.JsonConvert.SerializeObject(result);
                }
                public ActionResult CajaChica()
                {
                    return View();
                }
        #endregion
        #region CoteCaja
        public async Task<ActionResult> CorteCaja(long id = 0)
        {
            var roll = new PV_CorteCaja();
            if (id != 0)
            {
                var result = await httpClientConnection.GetPV_CorteCajaById(id);
                roll = JsonConvert.DeserializeObject<PV_CorteCaja>(result.Response.ToString());
            }
            return View(roll);
        }
        public async Task<string> SaveOrUpdatePV_CorteCaja(PV_CorteCaja r)
        {

            var result = await httpClientConnection.SaveOrUpdatePV_CorteCaja(r);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<string> GetAllPV_CorteCaja()
        {
            var result = await httpClientConnection.GetAllPV_CorteCaja();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<String> DeletePV_CorteCaja(long id)
        {
            var result = await httpClientConnection.DeletePV_CorteCaja(id);

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public ActionResult CorteCaja()
        {
            return View();
        }
        #endregion

    }
}