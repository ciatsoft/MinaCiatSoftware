using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoTaller;
using MinaTolEntidades.Security;
using MinaToMVC.DAL;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    [Autenticated]
    public class EmpleadoController : BaseController
    {
        #region Vistas
        public ActionResult Index()
        {
            return View();
        }
        public async Task<ActionResult> AltaEdicion(long id = 0)
        {

            Empleado empleado = new Empleado();

            if (id != 0)
            {
                var response = await httpClientConnection.GetTrabajadorById(id);
                empleado = JsonConvert.DeserializeObject<Empleado>(response.Response.ToString());
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

            var departamentosResponse = await httpClientConnection.GetAllAreaTrabajo();
            var departamento = JsonConvert.DeserializeObject<List<DtoAreaTrabajo>>(departamentosResponse.Response.ToString());
            var departamentoDdl = MappingPropertiToDropDownList<DtoAreaTrabajo>(departamento, "Id", "Nombre");

            // Obtener el valor del Web.Config
            string diaNominaValue = ConfigurationManager.AppSettings["DiaNomina"];

            // Parsear las opciones (asumiendo el formato "V:Viernes|S:Sabado")
            var opciones = diaNominaValue.Split('|')
                .Select(opt =>
                {
                    var parts = opt.Split(':');
                    return new SelectListItem
                    {
                        Value = parts[0],
                        Text = parts[1]
                    };
                }).ToList();

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.DiaNominaOptions = opciones;
            ViewBag.Departamentos = departamentoDdl;

            return View(empleado);

        }
        public async Task<ActionResult> ListaDocumentos(long id = 0)
        {
            Documentos documentos = new Documentos();

            if (id != 0)
            {
                var result = await httpClientConnection.GetDocumentoById(id);
                documentos = JsonConvert.DeserializeObject<Documentos>(result.Response.ToString());
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

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

            return View(documentos);
        }

        #endregion

        #region Vistas Parciales
        public ActionResult PartialCrudSalario(long id = 0)
        {
            ViewBag.TrabajadorId = id;
            return PartialView();
        }
        #endregion

        #region Acceso a Datos

        #region Trabajador
        public async Task<string> GetAllEmpleados()
        {
            var result = await httpClientConnection.GetAllEmpleados();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<ActionResult> SaveOrupdateEmpleado(Empleado t)
        {
            var result = await httpClientConnection.SaveOrupdateEmpleado(t);
            return Redirect("AltaEdicion");
        }
        public async Task<ActionResult> DeleteEmpleadoById(long id)
        {
            var r = await httpClientConnection.DeleteEmpleadoById(id);
            return Redirect("AltaEdicion");
        }
        #endregion

        #region Salario
        public async Task<string> GetSalarioByTrabajador(long id)
        {
            var result = await httpClientConnection.GetSalarioByTrabajador(id);

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> SaveOrupdateSalario(DtoSalario s)
        {
            //t.FechaContratacion = DateTime.Now;
            httpClientConnection.MappingColumSecurity(s);
            var result = await httpClientConnection.SaveOrUpdateSalario(s);
            return JsonConvert.SerializeObject(result);
        }
        #endregion

        #endregion

        #region Documentos
        public async Task<ActionResult> SaveOrUpdateDocumento(Documentos t)
        {
            var result = await httpClientConnection.SaveOrUpdateDocumento(t);
            return Redirect("AltaEdicion");
        }

        public async Task<string> GetAllDocumentos()
        {
            var result = await httpClientConnection.GetAllDocumentos();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> DeleteDocumentoById(long id)
        {
            var result = await httpClientConnection.DeleteDocumentoById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion

    }
}