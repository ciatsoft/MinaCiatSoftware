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
using MinaTolEntidades.DtoClientes;

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
        public IHttpActionResult DeleteTipoGastos(long id)
        {
            var result = wrapper.DeleteTipoGastos(id);
            return Ok(result);
        }

        #endregion
        #region VehiculoPublicoGeneral

        [Route("VehiculoPublicoGral/List"), HttpGet]
        public async Task<ModelResponse> GetAllVehiculosPublicoGral()
        {
            var result = wrapper.GetAllVehiculosPublicoGral();
            return result;
        }

        [HttpGet, Route("VehiculoPublicoGral/{id:long}")]
        public async Task<ModelResponse> GetVehiculosPublicoGralById(int id)
        {
            var result = wrapper.GetVehiculosPublicoGralById(id);
            return result;
        }

        [HttpPost, Route("VehiculoPublicoGral/")]
        public async Task<ModelResponse> SaveOrUpdateVehiculosPublicoGral(DtoClientesVehiculoPublicoGral p)
        {
            var result = wrapper.SaveOrUpdateVehiculosPublicoGral(p);
            return result;
        }

        // DELETE: VPG
        [HttpDelete, Route("VehiculoPublicoGral/{id:long}")]
        public IHttpActionResult DeleteVehiculosPublicoGral(long id)
        {
            var result = wrapper.DeleteVehiculosPublicoGral(id);
            return Ok(result);
        }
        #endregion
        #region RolPermisos

        [Route("RolPermisos/List"), HttpGet]
        public async Task<ModelResponse> GetAllPermisos()
        {
            var result = wrapper.GetAllPermisos();
            return result;
        }

        [Route("RolPermisos/{id:long}")]
        public async Task<ModelResponse> GetPermisosByIdRol(long id)
        {
            var result = wrapper.GetPermisosByIdRol(id);
            return result;
        }

        #endregion
    }
}
