using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using MinaTolEntidades.DtoCatalogos;

namespace MinaTolWebApi.Controllers
{

    [RoutePrefix("api/Catalogos")]
    public class CatalogosController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public CatalogosController()
        {
            wrapper = new DbWrapper();
        }
        #region Prestamos
        [Route("Prestamos/List"), HttpGet]
        public async Task<ModelResponse> GetAllPrestamos()
        {
            var result = wrapper.GetAllPrestamos();
            return result;
        }

        [HttpGet, Route("Prestamos/{id:long}")]
        public async Task<ModelResponse> GetPrestamosById(int id)
        {
            var result = wrapper.GetPrestamosById(id);
            return result;
        }

        [HttpPost, Route("Prestamos/")]
        public async Task<ModelResponse> SaveOrUpdatePrestamos(DtoCatalogoPrestamo p)
        {
            var result = wrapper.SaveOrUpdatePrestamos(p);
            return result;
        }

        // DELETE: Prestamo
        [HttpDelete, Route("Prestamos/{id:long}")]
        public IHttpActionResult DeletePrestamos(int id)
        {
            var result = wrapper.DeletePrestamos(id);
            return Ok(result);
        }

        #endregion
        #region TipoGastos

        [Route("TipoGastos/List"), HttpGet]
        public async Task<ModelResponse> GetAllTipoGastos()
        {
            var result = wrapper.GetAllTipoGastos();
            return result;
        }

        [HttpGet, Route("TipoGastos/{id:long}")]
        public async Task<ModelResponse> GetTipoGastosById(int id)
        {
            var result = wrapper.GetTipoGastosById(id);
            return result;
        }

        [HttpPost, Route("TipoGastos/")]
        public async Task<ModelResponse> SaveOrUpdateTipoGastos(DtoTipoGasto p)
        {
            var result = wrapper.SaveOrUpdateTipoGastos(p);
            return result;
        }

        // DELETE: Gastos
        [HttpDelete, Route("TipoGastos/{id:long}")]
        public IHttpActionResult DeleteTipoGastos(int id)
        {
            var result = wrapper.DeleteTipoGastos(id);
            return Ok(result);
        }
        #endregion
    }
}
