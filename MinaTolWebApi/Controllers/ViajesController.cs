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

        [HttpGet, Route("List")]
        public ModelResponse GetAllViajeLocal()
        {
            var result = wrapper.GetAllViajeLocal();
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public ModelResponse GetViajeInternoById(long id)
        {
            var result = wrapper.GetViajeInternoById(id);
            return result;
        }
        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateViajeInterno(DtoViajeInterno vi)
        {
            var result = wrapper.SaveOrUpdateViajeInterno(vi);
            return result;
        }
    }
}