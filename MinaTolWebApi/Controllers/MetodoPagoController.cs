using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/MetodoPago")]
    public class MetodoPagoontroller : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public MetodoPagoontroller()
        {
            wrapper = new DbWrapper();
        }
        [HttpGet, Route("List")]
        public ModelResponse GetAllMetodoPago()
        {
            var result = wrapper.GetAllMetodoPago();
            return result;
        }
        [HttpGet, Route("{id:int}")]
        public ModelResponse GetMetodoPagoById(int id)
        {
            var result = wrapper.GetMetodoPagoById(id);
            return result;
        }
        [HttpPost, Route("{id:int}")]
        public ModelResponse DeleteMetodoPago(int id)
        {
            var result = wrapper.DeleteMetodoPago(id);
            return result;
        }
        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateMetodoPago(MetodoPago pm)
        {
            var result = wrapper.SaveOrUpdateMetodoPago(pm);
            return result;
        }
    }
}
