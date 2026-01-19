using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades.DtoSeguridad;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.Security;
using MinaTolEntidades.VehiculoCarga;
using MinaToMVC.DAL;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Runtime.Remoting.Messaging;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    public class VehiculoCargaController : BaseController
    {
        #region Views

        #region VehiculoCarga
        public ActionResult VehiculoCarga()
        {
            return View();
        }
        #endregion

        #endregion

        #region PartialViews

        #endregion

        #region AccessData

        #region VehiculoCarga
        public async Task<string> GetAllVehiculoCarga()
        {
            var result = await httpClientConnection.GetAllVehiculoCarga();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetVehiculoCargaById(long id)
        {
            var result = await httpClientConnection.GetVehiculoCargaById(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public string SaveOrUpdateVehiculoCarga(VehiculoCarga vc)
        {
            var result = httpClientConnection.SaveOrUpdateVehiculoCarga(vc);
            return JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> DeleteVehiculoCarga(long id)
        {
            var result = httpClientConnection.DeleteVehiculoCarga(id);
            return Redirect("VehiculoCarga");
        }
        #endregion

        #endregion
    }
}