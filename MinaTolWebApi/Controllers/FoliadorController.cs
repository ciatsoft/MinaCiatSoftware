using MinaTolEntidades.DtoClientes;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/Foliador")]
    public class FoliadorController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public FoliadorController()
        {
            wrapper = new DbWrapper();
        }
        [HttpGet, Route("{Nombre}")]
        public async Task<ModelResponse> GetFoliadorByNombre(string Nombre)
        {
            var result = wrapper.GetFoliadorByNombre(Nombre);
            return result;
        }
    }
}