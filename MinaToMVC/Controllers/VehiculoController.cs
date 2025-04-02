using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoViajes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
    public class VehiculoController : BaseController
    {
        public async Task<ActionResult>  Index(long id = 0)
        {
            Vehiculo vehiculo;

            if (id != 0)
            {
                vehiculo = new Vehiculo();
            }
            else
            {
                vehiculo = new Vehiculo();
            }

            var tiposVehiculoResponse = await httpClientConnection.GetAllTipoVehiculo();
            var tiposVehiculo = JsonConvert.DeserializeObject<List<TipoVehiculo>>(tiposVehiculoResponse.Response.ToString());

            var tiposVehiculoList = MappingPropertiToDropDownList(tiposVehiculo, "Id", "Nombre","Estado");

            ViewBag.TipoVehiculos = tiposVehiculoList; ;


            return View(vehiculo);
        }
        public async Task<string> GetAllVehiculo()
        {
            var result = await httpClientConnection.GetAllVehiculo();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> SaveOrUpdateVehiculo(Vehiculo f)
        {
            var result = await httpClientConnection.SaveOrUpdateVehiculo(f);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

    }
}