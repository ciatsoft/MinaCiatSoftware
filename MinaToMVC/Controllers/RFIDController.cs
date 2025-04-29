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
            var rfid = new Rfid();
            if(id != 0)
            {
                var result = await httpClientConnection.GetRFIDById(id);
                rfid = JsonConvert.DeserializeObject<Rfid>(result.Response.ToString());
            }
            return View(rfid);
        }

        public async Task<string> GetAllRFID()
        {
            var token = Helpers.SessionHelper.GetSessionUser();
            var result = await httpClientConnection.GetAllRFID(token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }

        public string SaveOrUpdateRFID(Rfid r)
        {
            var result = httpClientConnection.SaveOrUpdateRFID(r);
            return JsonConvert.SerializeObject(result);
        }
        #endregion
    }
}