using MinaTolEntidades;
using MinaTolEntidades.VehiculoCarga;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/VehiculoCarga")]
    public class VehiculoCargaController : ApiController
    {
        private DbWrapper wrapper {  get; set; }
        public VehiculoCargaController()
        {
            wrapper = new DbWrapper();
        }

        #region VehiculoCarga
        [HttpGet, Route("List")]
        public ModelResponse GetAllVehiculoCarga()
        {
            var result = wrapper.GetAllVehiculoCarga();
            return result;
        }
        [HttpGet, Route("{id:long}")]
        public ModelResponse GetVehiculoCargaById(long id)
        {
            var result = wrapper.GetVehiculoCargaById(id);
            return result;
        }
        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateVehiculoCarga(VehiculoCarga vc)
        {
            var result = wrapper.SaveOrUpdateVehiculoCarga(vc);
            return result;
        }
        [HttpPost, Route("{id:long}")]
        public ModelResponse DeleteVehiculoCarga(long id)
        {
            var result = wrapper.DeleteVehiculoCarga(id);
            return result;
        }
        #endregion

        #region RFIDCarga
        [HttpGet, Route("RFIDCarga/List")]
        public ModelResponse GetAllRFIDCarga()
        {
            var result = wrapper.GetAllRFIDCarga();
            return result;
        }
        [HttpGet, Route("RFIDCarga/{id:long}")]
        public ModelResponse GetRFIDCargaById(long id)
        {
            var result = wrapper.GetRFIDCargaById(id);
            return result;
        }
        [HttpGet, Route("RFIDCarga/RFID/{rfid}")]
        public ModelResponse GetRFIDCargaByRFID(string rfid)
        {
            var result = wrapper.GetRFIDCargaByRFID(rfid);
            return result;
        }
        [HttpPost, Route("RFIDCarga/")]
        public ModelResponse SaveOrUpdateRFIDCarga(RFIDCarga vc)
        {
            var result = wrapper.SaveOrUpdateRFIDCarga(vc);
            return result;
        }
        [HttpPost, Route("RFIDCarga/Delete/{id:long}")]
        public ModelResponse DeleteRFIDCarga(long id)
        {
            var result = wrapper.DeleteRFIDCarga(id);
            return result;
        }
        [HttpPost, Route("RFIDCarga/Devuelto/{id:long}")]
        public ModelResponse DevueltoRFIDCarga(long id)
        {
            var result = wrapper.DevueltoRFIDCarga(id);
            return result;
        }
        [HttpPost, Route("RFIDCarga/NoDevuelto/{id:long}")]
        public ModelResponse NoDevueltoRFIDCarga(long id)
        {
            var result = wrapper.NoDevueltoRFIDCarga(id);
            return result;
        }
        [HttpGet, Route("RFIDCarga/Dates/")]
        public ModelResponse GetRFIDCargaByDates([FromUri] DateTime fechaInicio, [FromUri] DateTime fechaFin)
        {
            var result = wrapper.GetRFIDCargaByDates(fechaInicio,fechaFin);
            return result;
        }
        #endregion
    }
}
