using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentas;
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

            //Obtener precio del material
            var mayoreomenudeoResponse = await httpClientConnection.GetPrecioByMaterialId(materialUbicacion.FirstOrDefault().Id);
            var mayoreomenudeo = JsonConvert.DeserializeObject<List<PV_Precio>>(mayoreomenudeoResponse.Response.ToString());

            foreach (var i in materialUbicacion)
            {
                listadoMaterial.Add(i.Material);
            }
            var materiales = MappingPropertiToDropDownList<DtoTipoMaterialUbicacion>(listadoMaterial, "Id", "NombreTipoMaterial");


            var formasPago = System.Configuration.ConfigurationManager.AppSettings["FormaPago"].ToString().Split('|').ToList();

            var unidadMedidaResponse = await httpClientConnection.GetAllUnidadMedida();
            var unidadMedidaJson = JsonConvert.DeserializeObject<List<UnidadMedida>>(unidadMedidaResponse.Response.ToString());
            var unidadMedida = MappingPropertiToDropDownList<UnidadMedida>(unidadMedidaJson, "Id", "Nombre");

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


            ViewBag.Ubicaciones = ubicacionDdl;
            ViewBag.Materiales = materiales;
            ViewBag.FormasPago = formasPago;
            ViewBag.UnidadMedida = unidadMedida;
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

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
        public async Task<ActionResult> SaveOrUpdateVenta(PV_Ventas venta)
        {
            var r = await httpClientConnection.SaveOrUpdatePV_Venta(venta);
            return Redirect("Index");
        }

        public async Task<ActionResult> ActualizarEstatusVenta(int id, string valor)
        {
            var r = await httpClientConnection.ActualizarEstatusVenta(id, valor);
            return Redirect("Index");
        }

        public async Task<string> GetAllPV_Ventas()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllPV_Ventas();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
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

    }
}