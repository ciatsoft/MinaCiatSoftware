using MinaTolEntidades;
using MinaTolEntidades.Dto_Rfid;
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
        
        // Validar RFID en la base de datos
        [HttpGet, Route("search/{id}")]
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
            var result = wrapper.SaveOrUpdateRFID(r);
            return result;
        }

        // Obtener Lista
        [HttpGet, Route("list")]
        public ModelResponse GetAllRfid()
        {
            var result = wrapper.GetAllRfid();
            return result;
        }

        // Obtener por ID
        [HttpGet, Route("by/{id}")]
        public async Task<ModelResponse> GetRfidById(int id)
        {
            var result = wrapper.GetRfidById(id);
            return result;
        }

        // Eliminar RFID
        [HttpDelete, Route("{id:long}")]
        public async Task<ModelResponse> DeleteRFID(int id)
        {
            var result = wrapper.DeleteRfid(id);
            return result;
        }
    }
}
