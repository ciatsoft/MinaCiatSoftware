using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
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
        //------------------------------Canjeo--------------------------------------


        [HttpGet, Route("Folio/{folio}")]
        public ModelResponse ObtenerVentaPorFolio(string folio)
        {
            var result = wrapper.ObtenerVentaPorFolio(folio);
            return result;
        }

        [HttpGet, Route("Ubicaciones/{id:long}")]
        public ModelResponse GetUbicacionesByMaterial(long id)
        {
            var result = wrapper.GetUbicacionesByMaterial(id);
            return result;
        }

        [HttpPost, Route("Prepago/Canjeo")]
        public HttpResponseMessage ProcesarCanje(Canjeo canjeo)
        {
            var parametros = new Dictionary<string, object>
            {
                { "Id", canjeo.Id },
                { "Folio", canjeo.Folio },
                { "RFID", canjeo.RFID },
                { "NombreCliente", canjeo.NombreCliente },
                { "Transporte", canjeo.Transporte },
                { "Placa", canjeo.Placa },
                { "Cantidad", canjeo.Cantidad },
                { "PV_PlantaId", canjeo.PV_PlantaId },
                { "PV_MaterialId", canjeo.PV_MaterialId },
                { "FormaDePago", canjeo.FormaDePago },
                { "UsuarioId", canjeo.UsuarioId },
                { "Fecha", canjeo.Fecha },
                { "Estatus", canjeo.Estatus },
                { "CreatedBy", canjeo.CreatedBy },
                { "CreatedDt", canjeo.CreatedDt },
                { "UpdatedBy", canjeo.UpdatedBy },
                { "UpdatedDt", canjeo.UpdatedDt },
                { "CantidadRecibida", canjeo.CantidadRecibida },
                { "EstatusVenta", canjeo.EstatusVenta },
                { "UnidadMedida", canjeo.UnidadMedida },
                { "TotalPago", canjeo.TotalPago },
                { "PrecioUnidad", canjeo.PrecioUnidad }
            };

            var resultado = wrapper.ProcesarCanjeo(parametros);

            // Convierte ModelResponse a HttpResponseMessage
            if (resultado.IsSuccess)
            {
                return Request.CreateResponse(HttpStatusCode.OK, resultado);
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, resultado.Message);
            }
        }


        #endregion

    }

}
