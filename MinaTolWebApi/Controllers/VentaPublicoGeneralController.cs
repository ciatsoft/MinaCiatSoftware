using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.Services.Description;

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

        #region Prepago
        //---------------------------PREPAGO----------------

        [HttpPost, Route("Prepagos")]
        public ModelResponse SaveOrUpdatePrepagos([FromBody] List<Prepago> prepagos)
        {
            var result = wrapper.SaveOrUpdatePrepago(prepagos);
            return result;
        }

        [HttpDelete, Route("Prepago/{id:long}")]
        public IHttpActionResult DeletePrepago(long id)
        {
            var result = wrapper.DeletePrepago(id);
            return Ok(result);
        }

        [Route("Prepago/List"), HttpGet]
        public async Task<ModelResponse> GetAllPrepagos()
        {
            var result = wrapper.GetAllPrepagos();
            return result;
        }

        [HttpGet, Route("Prepago/{rfid}")]
        public async Task<ModelResponse> GetAllPrepagosByRFID(string rfid)
        {
            var result = wrapper.GetAllPrepagosByRFID(rfid);
            return result;
        }

        [HttpGet, Route("Prepago/folio/{folio}")]
        public async Task<ModelResponse> GetAllPrepagosByFolio(string folio)
        {
            var result = wrapper.GetAllPrepagosByFolio(folio);
            return result;
        }
        //------------------------------Partial Canjeo--------------------------------------


        [HttpGet, Route("Folio/{folio}")]
        public ModelResponse ObtenerVentaPorFolio(string folio)
        {
            var result = wrapper.ObtenerVentaPorFolio(folio);
            return result;
        }

        #endregion

    }

}
