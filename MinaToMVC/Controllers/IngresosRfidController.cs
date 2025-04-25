using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using MinaTolEntidades.DtoIngresosRfid;
using Newtonsoft.Json;
using System.Web.Mvc;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{
    [Autenticated]
    public class IngresosRfidController:BaseController
    {
        
        public async Task<ActionResult> IngresosRfid(int id = 0)
        {

            var unidad = new IngresosRfid();
            if (id != 0)
            {
                var result = await httpClientConnection.GetIngresosRfidById(id);
                unidad = JsonConvert.DeserializeObject<IngresosRfid>(result.Response.ToString());
            }

            return View(unidad);
        }
        public async Task<string> GetAllIngresosRfid()
        {
            var result = await httpClientConnection.GetAllIngresosRfid();

            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> SaveOrUpdateUnidadMedida(IngresosRfid ar)
        {
            var result = await httpClientConnection.SaveOrUpdateIngresosRfid(ar);
            return JsonConvert.SerializeObject(result);
        }
        public async Task<string> DeleteIngresosRfid(int id)
        {
            var result = await httpClientConnection.DeleteIngresosRfid(id);
            return JsonConvert.SerializeObject(result);
        }





    }
}