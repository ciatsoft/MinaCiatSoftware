using MinaTolEntidades;
using MinaTolEntidades.DtoEmpleados;
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
    public class RHController : BaseController
    {
        #region View
        
        public ActionResult Empleados()
        {
            return View();
        }
        [NoAutenticated]
        public ActionResult Autenticacion()
        {
            return View();
        }
        [Autenticated]
        public ActionResult Agregar()
        {
            return View();
        }
        [Autenticated]
        public ActionResult Editar()
        {
            return View();
        }
        public async Task<ActionResult> NominaEmpleado()
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
        public async Task<ActionResult> ConceptosRH(long id = 0)
        {
            ConceptosEmpleado conceptosEmpleado = new ConceptosEmpleado();

            if( id != 0)
            {
                var response = await httpClientConnection.GetConceptosEmpleadosById(id);
                conceptosEmpleado = JsonConvert.DeserializeObject<ConceptosEmpleado>(response.Response.ToString());
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

            return View(conceptosEmpleado);
        }

        public async Task<ActionResult> BajaEmpleados(long id = 0)
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
        #endregion

        #region VistasParciales
        public async Task<ActionResult> PartialConceptosEmpleado(long id = 0, string nombreCompleto = "")
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

            var conceptosEmpleadosResponse = await httpClientConnection.GetAllConceptosEmpleados();
            var conceptosEmpleados = JsonConvert.DeserializeObject<List<ConceptosEmpleado>>(
                conceptosEmpleadosResponse.Response.ToString()
            );

            // Filtrar excluyendo Sueldo y Préstamo
            var conceptosEmpleadosDdl = conceptosEmpleados
                .Where(c => c.Nombre != "Sueldo" && c.Nombre != "Prestamo")
                .Select(c => new SelectListItem
                {
                    Value = c.Id.ToString(),
                    Text = c.Nombre
                })
                .ToList();

            // lista para el DropDownList
            ViewBag.ConceptosEmpleados = conceptosEmpleadosDdl;

            // lista serializada para usar en JS (también filtrada)
            ViewBag.ConceptosJson = JsonConvert.SerializeObject(
                conceptosEmpleados.Where(c => c.Nombre != "Sueldo" && c.Nombre != "Préstamo").ToList()
            );

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.TrabajadorId = id;
            ViewBag.NombreTrabajador = nombreCompleto;

            return PartialView();
        }

        public async Task<ActionResult> PartialNominasEmpleado(long id = 0, string nombreCompleto = "")
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
            ViewBag.TrabajadorId = id;
            ViewBag.NombreTrabajador = nombreCompleto;

            return PartialView();
        }

        public async Task<ActionResult> PartialHistorialNominas(long id, string nombreCompleto = "")
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
            ViewBag.TrabajadorId = id;
            ViewBag.NombreTrabajador = nombreCompleto;

            return PartialView();
        }
        #endregion 

        #region Data Acces
        [HttpPost]
        public async Task<string> FirstAutentication(string user, string pass)
        {
            pass = Cryptography.Encrypt(pass);

            Token token = await httpClientConnection.GetToken(user, pass);

            if (token != null)
            {
                var responseAutenticated = await httpClientConnection.ValidateUserName(user, token.access_token);
                var userAutenticated = JsonConvert.DeserializeObject<Usuario>(responseAutenticated.Response.ToString());
                token.ExpirationDate = DateTime.Now.AddSeconds(token.expires_in);
                var tokenCookie = new TokenCookie()
                {
                    Token = token,
                    UserID = userAutenticated.Id,
                    UserName = user
                };

                SessionHelper.CreateSession(JsonConvert.SerializeObject(tokenCookie));
            }

            return JsonConvert.SerializeObject(mr);
        }

        [Autenticated]
        public string LogOut()
        {
            SessionHelper.CloseSession();
            if (Request.Cookies["ConfigMenu"] != null)
            {
                var c = new HttpCookie("ConfigMenu")
                {
                    Expires = DateTime.Now.AddDays(-1)
                };
                Response.Cookies.Add(c);
            }
            return JsonConvert.SerializeObject(mr);
        }

        #region ConceptosEmpleados
        public async Task<ActionResult> SaveOrUpdateConceptosEmpleados(ConceptosEmpleado ce)
        {
            var result = await httpClientConnection.SaveOrUpdateConceptosEmpleados(ce);
            return Redirect("ConceptosRH");
        }
        public async Task<string> GetAllConceptosEmpleados()
        {
            var result = await httpClientConnection.GetAllConceptosEmpleados();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> DeleteConceptosEmpleadosById(long id)
        {
            var result = await httpClientConnection.DeleteConceptosEmpleadosById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion

        #region ConceptoEmpleadoByIdEmpleado
        public async Task<string> GetAllConceptoEmpleadoByIdEmpleado(long id)
        {
            var result = await httpClientConnection.GetAllConceptoEmpleadoByIdEmpleado(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetSalarioActivoByIdEmpleado(long id)
        {
            var result = await httpClientConnection.GetSalarioActivoByIdEmpleado(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateConceptoEmpleadoByIdEmpleado(ConceptoEmpleado ce)
        {
            var result = await httpClientConnection.SaveOrUpdateConceptoEmpleadoByIdEmpleado(ce);
            return Redirect("ConceptosRH");
        }
        public async Task<ActionResult> DeleteConceptoEmpleadoById(long id)
        {
            var result = await httpClientConnection.DeleteConceptoEmpleadoById(id);
            return Redirect("ConceptosRH");
        }
        #endregion

        #region NominaEmpleado
        public async Task<string> GetAllNominasByIdEmpleado(long id)
        {
            var result = await httpClientConnection.GetAllNominasByIdEmpleado(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllConceptoEmpleadoByIdEmpleadoDates(long id, DateTime fechaInicio, DateTime fechaFinal)
        {
            var result = await httpClientConnection.GetAllConceptoEmpleadoByIdEmpleadoDates(id, fechaInicio, fechaFinal);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllPrestamosByIdEmpleadoDates(long id, DateTime fechaInicio, DateTime fechaFinal)
        {
            var result = await httpClientConnection.GetAllPrestamosByIdEmpleadoDates(id, fechaInicio, fechaFinal);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateNominasByIdEmpleado(NominaEmpleado ce)
        {
            var result = await httpClientConnection.SaveOrUpdateNominasByIdEmpleado(ce);
            return Redirect("ConceptosRH");
        }
        public async Task<ActionResult> DeleteNominasByIdEmpleado(long id)
        {
            var result = await httpClientConnection.DeleteNominasByIdEmpleado(id);
            return Redirect("ConceptosRH");
        }
        public async Task<string> SearchNominaEmpleadoByDates(long id, DateTime fechaInicio, DateTime fechaFinal)
        {
            var result = await httpClientConnection.SearchNominaEmpleadoByDates(id, fechaInicio, fechaFinal);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion
        #endregion
    }
}