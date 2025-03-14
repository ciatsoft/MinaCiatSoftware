﻿using MinaTolEntidades;
using MinaTolEntidades.DtoViajes;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/Viajes")]
    public class ViajesController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public ViajesController()
        {
            wrapper = new DbWrapper();
        }
        [HttpGet, Route("List")]
        public ModelResponse GetAllViajeInterno()
        {
            var result = wrapper.GetAllViajeInterno();
            return result;
        }

        [HttpGet, Route("Listlocal")]
        public ModelResponse GetAllViajeLocal()
        {
            var result = wrapper.GetAllViajeLocal();
            return result;
        }

        [HttpGet, Route("Interno/{id:long}")]
        public ModelResponse GetViajeInternoById(long id)
        {
            var result = wrapper.GetViajeInternoById(id);
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public ModelResponse GetViajeLocalById(long id)
        {
            var result = wrapper.GetViajeLocalById(id);
            return result;
        }

        [HttpPost, Route("Interno")]
        public ModelResponse SaveOrUpdateViajeInterno(DtoViajeInterno vi)
        {
            var result = wrapper.SaveOrUpdateViajeInterno(vi);
            return result;
        }
        [HttpPost, Route("Local")]
        public ModelResponse SaveOrUpdateViajeLocal(DtoViajeLocal vl)
        {
            var result = wrapper.SaveOrUpdateViajeLocal(vl);
            return result;
        }
        [Route("Material/{id:long}"), HttpGet]
        public ModelResponse GetTipoMaterialByCliente(long id)
        {
            var result = wrapper.GetTipoMaterialByCliente(id);
            return result;
        }
    }
}
