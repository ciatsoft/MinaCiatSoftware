    using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.Security;
using MinaToMVC.DAL;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Cryptography;
using System.Security.Policy;
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

            // 1. Ubicaciones (mantienes el método genérico porque DtoUbicacion tiene las propiedades directamente)
            var ubicacionReponse = await httpClientConnection.GetAllUbicacion();
            var ubicacion = JsonConvert.DeserializeObject<List<DtoUbicacion>>(ubicacionReponse.Response.ToString())
                .Where(x => x.EsInterna).ToList();

            var ubicacionDdl = MappingPropertiToDropDownList<DtoUbicacion>(ubicacion, "Id", "NombreUbicacion");

            // 2. Materiales (aquí necesitas la solución específica porque son propiedades anidadas)
            var ubicacionId = ubicacion.FirstOrDefault()?.Id ?? 0;
            var materialUbicacionResponse = await httpClientConnection.GetMaterialUbicacionByUbicacion(ubicacionId);

            // IMPORTANTE: Agregar verificación de nulos
            var materialUbicacion = materialUbicacionResponse?.Response != null
                ? JsonConvert.DeserializeObject<List<MaterialUbicacion>>(materialUbicacionResponse.Response.ToString())
                : new List<MaterialUbicacion>();

            // Usar LINQ para propiedades anidadas
            var materialUbicacionDdl = materialUbicacion
                .Where(m => m.Material != null &&
                    (m.Material.Estatus == true))
                .Select(m => new SelectListItem
                {
                    Value = m.Material.Id.ToString(),
                    Text = m.Material.NombreTipoMaterial
                })
                .ToList();

            // 3. Precios (aquí también necesitas verificar el primer material)
            var materialId = materialUbicacion.FirstOrDefault()?.Material?.Id ?? 0;
            var mayoreoMenudeoResponse = await httpClientConnection.GetPrecioByMaterialId(materialId);
            var mayoreoMenudeo = mayoreoMenudeoResponse?.Response != null
                ? JsonConvert.DeserializeObject<List<PV_Precio>>(mayoreoMenudeoResponse.Response.ToString())
                : new List<PV_Precio>();

            // 4. Formas de pago
            var formasPago = System.Configuration.ConfigurationManager.AppSettings["FormaPago"]?.ToString()
                .Split('|')
                .ToList() ?? new List<string>();

            // 5. Unidad de medida (mantienes el método genérico)
            var unidadMedidaResponse = await httpClientConnection.GetAllUnidadMedida();
            var unidadMedidaJson = unidadMedidaResponse?.Response != null
                ? JsonConvert.DeserializeObject<List<UnidadMedida>>(unidadMedidaResponse.Response.ToString())
                : new List<UnidadMedida>();

            var unidadMedida = MappingPropertiToDropDownList<UnidadMedida>(unidadMedidaJson, "Id", "Nombre");

            // 6. Usuarios
            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
    {
        new Usuario()
        {
            Id = usuarioToken?.UserID ?? 0,
            Nombre = usuarioToken?.UserName ?? ""
        }
    };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");

            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            // 7. Foliador
            var foliadorResponse = await httpClientConnection.GetFoliadorByNombre("VentaPublicoGeneral");
            var foliador = foliadorResponse?.Response != null
                ? JsonConvert.DeserializeObject<DtoFoliador>(foliadorResponse.Response.ToString())
                : new DtoFoliador();

            foliador?.CalcualrConsecutivoString();
            venta.Folio = foliador?.ConsecutivoString ?? "";

            ViewBag.Ubicaciones = ubicacionDdl;
            ViewBag.Materiales = materialUbicacionDdl;
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
        public ActionResult CajaChica()
        {
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

        public ActionResult DineroCaja()
        {
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

            // Genera la lista para todos los dropdowns
            var rango1a50List = Enumerable.Range(1, 50)
                .Select(i => new SelectListItem
                {
                    Value = i.ToString(),
                    Text = i.ToString()
                })
                .ToList();

            ViewBag.Rango1a50 = rango1a50List;

            return View();
        }

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

        public ActionResult VentaPorPlanta()
        {
            return View();
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

        public async Task<ActionResult> PartialCanjeo(long id = 0)
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
            ViewBag.UnidadMedida = unidadMedida;
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            return PartialView(venta);
        }
        
        #endregion

        #region Data Acces

        #region Venta publico en General
        public async Task<ActionResult> SaveOrUpdateVenta(PV_Ventas venta)
        {
            var r = await httpClientConnection.SaveOrUpdatePV_Venta(venta);
            return Redirect("Index");
        }
        public async Task<ActionResult> ActualizarEstatusVenta(int id, string valor)
        {
            var r = await httpClientConnection.ActualizarEstatusVenta(id, valor);
            return Json(r, JsonRequestBehavior.AllowGet);
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
        public async Task<string> GetUbicacionesByMaterial(long id)
        {
            var result = await httpClientConnection.GetUbicacionesByMaterial(id);
            return JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult> SaveOrUpdateReporte_Venta(Reporte_Venta reporte)
        {
            var r = await httpClientConnection.SaveOrUpdateReporte_Venta(reporte);
            return Redirect("CorteDeCaja");
        }
        public async Task<string> SearchClienteByRFID(string rfid)
        {
            var r = await httpClientConnection.SearchClienteByRFID(rfid);
            return JsonConvert.SerializeObject(r);
        }
        
        public async Task<string> GetVehiculosPublicoGralByIdCliente(long id)
        {
            var result = await httpClientConnection.GetVehiculosPublicoGralByIdCliente(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> UpdateCarga(int id)
        {
            var result = await httpClientConnection.UpdateCarga(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult> PartialVehiculoClientesPublicoGeneral()
        {
            DtoClientesVehiculoPublicoGral vehiculoPG = new DtoClientesVehiculoPublicoGral();

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

            var clientes = new List<ClientePublicoGral>();
            var responseclientes = await httpClientConnection.GetAllClientePublicoGral();
            // Deseriali  za la respuesta
            clientes = JsonConvert.DeserializeObject<List<ClientePublicoGral>>(responseclientes.Response.ToString());

            ViewBag.Clientes = clientes;
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

            return PartialView(vehiculoPG);
        }


        // Parcial para generar Gastos / Deducciones

        public async Task<ActionResult> PartialDeducciones(long id = 0)
        {
            var modelo = new Deducciones();

            if (id != 0)
            {
                var response = await httpClientConnection.GetDeduccionesById(id);
                modelo = JsonConvert.DeserializeObject<Deducciones>(response.Response.ToString());
            }

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>
            {
                new Usuario
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };

            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");

            var responseClientes = await httpClientConnection.GetAllTipoGastos();
            var gastos = JsonConvert.DeserializeObject<List<DtoTipoGasto>>(responseClientes.Response.ToString());

            ViewBag.Gastos = gastos;
            ViewBag.UserToken = usuarioToken;
            ViewBag.Usuarios = usuarios;

            return PartialView("PartialDeducciones", modelo);
        }

        // ---------------------------------------Deducciones------------------------------------------
        public async Task<string> GetAllDeducciones()
        {
            var result = await httpClientConnection.GetAllDeducciones();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult> SaveOrUpdateDeducciones(Deducciones reporte)
        {
            var r = await httpClientConnection.SaveOrUpdateDeducciones(reporte);
            return Redirect("CorteDeCaja");
        }
        public async Task<String> DeleteDeducciones(long id)
        {
            var result = await httpClientConnection.DeleteDeducciones(id);

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> SearchDeduccionesByDate(DateTime fechaDeducciones)
        {
            var result = await httpClientConnection.SearchDeduccionesByDate(fechaDeducciones);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        // Total Por Planta
        public async Task<string> TotalPlantaByFecha(DateTime fecha)
        {
            var result = await httpClientConnection.TotalPlantaByFecha(fecha);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> TotalPlantaByFecha2(DateTime fecha2, DateTime fecha3)
        {
            var result = await httpClientConnection.TotalPlantaByFecha2(fecha2, fecha3);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        // Deducciones por Fecha y Usuario Autenticado
        public async Task<string> SearchDeduccionesByDateAndUserAndCorteId(string userName, DateTime fecha)
        {
            var result = await httpClientConnection.SearchDeduccionesByDateAndUser(userName, fecha);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }



        //----------------PREPAGO----------------------------------
        public async Task<ActionResult> SaveOrUpdatePrepagos(List<Prepago> prepagos)
        {
            try
            {
                var r = await httpClientConnection.SaveOrUpdatePrepago(prepagos);
                return Json(new { success = true, message = "Valera creada exitosamente" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        public async Task<string> DeletePrepago(long id)
        {
            var result = await httpClientConnection.DeletePrepago(id);

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllPrepagos()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllPrepagos();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetUltimoFolio()
        {
            var result = await httpClientConnection.GetUltimoFolio();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllPrepagosByRFID(string rfid)
        {
            var result = await httpClientConnection.GetAllPrepagosByRFID(rfid);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> PartialPrepago()
        {
            Prepago prepago = new Prepago();

            var materialesResponse = await httpClientConnection.GetAllTipoMaterialUbicacion();
            var materiales = JsonConvert.DeserializeObject<List<DtoTipoMaterialUbicacion>>(materialesResponse.Response.ToString());

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

            var clientes = new List<ClientePublicoGral>();
            var responseclientes = await httpClientConnection.GetAllClientePublicoGral();
            // Deseriali  za la respuesta
            clientes = JsonConvert.DeserializeObject<List<ClientePublicoGral>>(responseclientes.Response.ToString());

            var foliadorResponse = await httpClientConnection.GetFoliadorByNombre("Prepago");
            var foliador = JsonConvert.DeserializeObject<DtoFoliador>(foliadorResponse.Response.ToString());
            foliador.CalcualrConsecutivoString();
            prepago.Folio = foliador.ConsecutivoString;

            ViewBag.Materiales = materiales;
            ViewBag.Clientes = clientes;
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

            return PartialView(prepago);
        }
        public async Task<string> VentasDiariasPrepago(DateTime fecha)
        {
            var result = await httpClientConnection.VentasDiariasPrepago(fecha);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        //----------------CAJEO DE VALE----------------------------------
        public async Task<string> ObtenerVentaPorFolio(string folio)
        {
            var result = await httpClientConnection.ObtenerVentaPorFolio(folio);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult>ProcesarCanjeo(Canjeo canjeo)
        {
            var r = await httpClientConnection.ProcesarCanjeo(canjeo);
            return Json(r);
        }

        #endregion

        #region Precios
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
        public async Task<ActionResult> DeletePV_Precio(long id)
        {
            var result = await httpClientConnection.DeletePV_Precio(id);
            return Json(result, JsonRequestBehavior.AllowGet);
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
        public async Task<ActionResult> SaveOrUpdatePV_CajaChica(PV_CajaChica r)
        {
            var result = await httpClientConnection.SaveOrUpdatePV_CajaChica(r);
            return Redirect("CajaChica");
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

        //Buscar filtrado
        public async Task<string> SearchPV_VajaChicaByDateAndUser(string userName, DateTime fecha)
        {
            var result = await httpClientConnection.SearchPV_VajaChicaByDateAndUser(userName, fecha);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> SearchPV_CajaChicaByDateAndUserAndCorteId(string userName, DateTime fecha)
        {
            var result = await httpClientConnection.SearchPV_CajaChicaByDateAndUserAndCorteId(userName, fecha);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> SearchPV_DineroCajaByDateAndUser(string userName, DateTime fecha)
        {
            var result = await httpClientConnection.SearchPV_DineroCajaByDateAndUser(userName, fecha);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion

        #region CoteCaja        
        public async Task<ActionResult> SaveOrUpdatePV_CorteCaja(PV_CorteCaja r)
        {
            var result = await httpClientConnection.SaveOrUpdatePV_CorteCaja(r);
            return Redirect("DineroCaja");
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
        #endregion

        #region Corte de Caja

        public ActionResult CorteDeCaja()
        {
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

        //Buscar filtrado 
        public async Task<string> SearchPV_VentasByDateAndUser(int usuarioId, DateTime fecha)
        {
            var result = await httpClientConnection.SearchPV_VentasByDateAndUser(usuarioId, fecha);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> SearchPV_VentasByDate(DateTime fecha)
        {
            var result = await httpClientConnection.SearchPV_VentasByDate(fecha);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        //public async Task<string> TotalPlantaByFecha(DateTime fecha)
        //{
        //    var result = await httpClientConnection.TotalPlantaByFecha(fecha);
        //    return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        //}

        #endregion

        #region Prestamos

        public async Task<ActionResult> Prestamos(long id = 0)
        {
            DtoCatalogoPrestamo prestamo = new DtoCatalogoPrestamo();
            if (id != 0)
            {
                var result = await httpClientConnection.GetPrestamosById(id);
                var lista = JsonConvert.DeserializeObject<List<DtoCatalogoPrestamo>>(result.Response.ToString());

                if (lista != null && lista.Count > 0)
                {
                    prestamo = lista.FirstOrDefault();
                }
            }
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

            var trabajadores = new List<Empleado>();
            var responsetrabajadores = await httpClientConnection.GetAllEmpleados();
            trabajadores = JsonConvert.DeserializeObject<List<Empleado>>(responsetrabajadores.Response.ToString());

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.Trabajadores = trabajadores;

            return View(prestamo);
        }
        public async Task<string> GetAllPrestamos()
        {
            var result = await httpClientConnection.GetAllPrestamos();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);

        }
        public async Task<ActionResult> SaveOrUpdatePrestamos(DtoCatalogoPrestamo tipoPrestamo)
        {
            var r = await httpClientConnection.SaveOrUpdatePrestamos(tipoPrestamo);
            return Redirect("TipoPrestamo");
        }
        public async Task<String> DeletePrestamos(long id)
        {
            var result = await httpClientConnection.DeletePrestamos(id);

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion

        #region ClientePublicoGeneral

        public async Task<ActionResult> ClientePublicoGeneral(long id = 0)
        {
            ClientePublicoGral clientePublicoGral = new ClientePublicoGral();

            if (id != 0)
            {
                var result = await httpClientConnection.GetClientePublicoGralById(id);
                var cliente = JsonConvert.DeserializeObject<ClientePublicoGral>(result.Response.ToString());

                if (cliente != null)
                {
                    clientePublicoGral = cliente;
                }
            }

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
            clientePublicoGral.CreatedBy = usuarioAutenticado.UserName;
            clientePublicoGral.UpdatedBy = usuarioAutenticado.UserName;

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

            return View(clientePublicoGral);
        }
        public async Task<string> GetAllClientePublicoGral()
        {
            var result = await httpClientConnection.GetAllClientePublicoGral();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateClientePublicoGral(ClientePublicoGral c)
        {
            var r = await httpClientConnection.SaveOrUpdateClientePublicoGral(c);
            return Redirect("ClientePublicoGeneral");
        }
        public async Task<String> DeleteClientePublicoGral(long id)
        {
            var result = await httpClientConnection.DeleteClientePublicoGral(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        #endregion

        #endregion
    }
}