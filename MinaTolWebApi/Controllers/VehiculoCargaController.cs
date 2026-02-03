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
    }
}
