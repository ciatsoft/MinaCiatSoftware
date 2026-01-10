using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using MinaTolWebApi.DAL;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/TipoVehiculo")]
    public class TipoVehiculoController : ApiController
    {
        private readonly DbWrapper wrapper;

        public TipoVehiculoController()
        {
            wrapper = new DbWrapper();
        }

        // GET: api/TipoVehiculo
        [HttpGet, Route("")]
        public IHttpActionResult GetAllTipoVehiculo()
        {
            var result = wrapper.GetAllTipoVehiculo();
            return Ok(result);
        }

        // GET: api/TipoVehiculo/5
        [HttpGet, Route("{id:long}")]
        public IHttpActionResult GetTipoDeVehiculoById(long id)
        {
            var result = wrapper.GetTipoDeVehiculoById(id);
            return Ok(result);
        }

        // DELETE: api/TipoVehiculo/5
        [HttpDelete, Route("{id:long}")]
        public IHttpActionResult DeleteTipoVehiculo(long id)
        {
            var result = wrapper.DeleteTipoVehiculo(id);
            return Ok(result);
        }

        // POST: api/TipoVehiculo
        [HttpPost, Route("")]
        public IHttpActionResult SaveOrUpdateTipoVehiculo(TipoVehiculo t)
        {
            var result = wrapper.SaveOrUpdateTipoVehiculo(t);
            return Ok(result);
        }
    }
}
