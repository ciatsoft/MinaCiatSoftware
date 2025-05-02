using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentas;
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
            foreach (var i in materialUbicacion)
            {
                listadoMaterial.Add(i.Material);
            }
            var materiales = MappingPropertiToDropDownList<DtoTipoMaterialUbicacion>(listadoMaterial, "Id", "NombreTipoMaterial");


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
    }
}