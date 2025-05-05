using MinaTolEntidades;
using MinaTolEntidades.Dto_Rfid;
using MinaToMVC.DAL;
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
    public class RFIDController : BaseController
    {
        #region RFID

        public async Task<ActionResult> RFID(long id = 0)
        {
            // Si es una petición AJAX, retorna JSON
            if (Request.IsAjaxRequest())
            {
                if (id != 0)
                {
                    var result = await httpClientConnection.GetRfidById(id);
                    if (result.IsSuccess)
                    {
                        return Json(new
                        {
                            IsSuccess = true,
                            Response = JsonConvert.DeserializeObject<Rfid>(result.Response.ToString())
                        }, JsonRequestBehavior.AllowGet);
                    }
                    return Json(new { IsSuccess = false, ErrorMessage = result.Message });
                }
                return Json(new { IsSuccess = false, ErrorMessage = "ID no proporcionado" });
            }

            // Para peticiones normales, retorna la vista
            var rfid = new Rfid();
            if (id != 0)
            {
                var result = await httpClientConnection.GetRfidById(id);
                rfid = JsonConvert.DeserializeObject<Rfid>(result.Response.ToString());
            }
            return View(rfid);
        }

        public async Task<string> GetAllRfid()
        {
            var result = await httpClientConnection.GetAllRfid();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> SaveOrUpdateRFID(Rfid r)
        {
            var result = await httpClientConnection.SaveOrUpdateRFID(r);
            return JsonConvert.SerializeObject(result);
        }

        public async Task <String> DeleteRFID(long id){
            var result = await httpClientConnection.DeleteRFID(id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public async Task<string> GetAllTrabajadores()
        {
            var result = await httpClientConnection.GetAllTrabajador();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        #endregion
    }
}