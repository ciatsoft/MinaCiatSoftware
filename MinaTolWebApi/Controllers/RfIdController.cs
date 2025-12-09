using MinaTolEntidades;
using MinaTolEntidades.Dto_Rfid;
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
    [AllowAnonymous]
    [RoutePrefix("api/Rfid")]
    public class RfidController : ApiController
    {
        private DbWrapper wrapper { get; set; }

        public RfidController()
        {
            wrapper = new DbWrapper();
        }
        
        [HttpGet, Route("")]
        public ModelResponse GetAllRfid()
        {
            var result = wrapper.GetAllRfid();
            return result;
        }
        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetRfidById(int id)
        {
            var result = wrapper.GetRfidById(id);
            return result;
        }
        [HttpPost, Route("{id:long}")]
        public async Task<ModelResponse> DeleteRfid(int id)
        {
            var result = wrapper.DeleteRfid(id);
            return result;
        }
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateRfid(Rfid t)
        {
            var result = wrapper.SaveOrUpdateRfid(t);
            return result;
        }

        [HttpGet, Route("{id}")]
        public IHttpActionResult ValidarRfid(string id)
        {
            var result = wrapper.SearchRfid(id);

            if (result.IsSuccess)
            {
                int resultado = (int)result.Response; // Ya no es dynamic, es directamente el entero

                if (resultado == 1)
                {
                    return Ok("1"); // Acceso permitido
                }
                else
                {
                    return Ok("0"); // Acceso denegado
                }
            }
            else
            {
                return InternalServerError(new Exception(result.Message));
            }
        }


        // Guardar RFID en la base de datos
        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdateRFID(Rfid r)
        {
            var result = wrapper.SaveOrUpdateRfid(r);
            return result;
        }
        

        // Eliminar RFID
        [HttpPost, Route("{id:long}")]
        public async Task<ModelResponse> DeleteRFID(int id)
        {
            var result = wrapper.DeleteRfid(id);
            return result;
        }

    }
}
