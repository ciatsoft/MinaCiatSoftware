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
    [RoutePrefix("api/VentaPublicoGeneral")]
    public class VentaPublicoGeneralController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public VentaPublicoGeneralController()
        {
            wrapper = new DbWrapper();
        }

        #region MaterialUbicacion
        [HttpGet, Route("{id:long}/")]
        public ModelResponse GetMaterialUbicacionByUbicacion(int id)
        {
            var result = wrapper.GetMaterialUbicacionByUbicacion(id);
            return result;
        }
        #endregion  
    }
}
