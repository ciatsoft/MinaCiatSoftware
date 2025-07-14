using MinaTolEntidades;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/PV_Venta")]
    public class PV_VentaController : ApiController
    {
        private DbWrapper wrapper {  get; set; }
        public PV_VentaController() 
        {
            wrapper = new DbWrapper();
        }

        [HttpPost, Route("")]
        public async Task<ModelResponse> SaveOrUpdatePV_Venta(PV_Ventas v)
        {
            var result = wrapper.SaveOrUpdatePV_Venta(v);
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public async Task<ModelResponse> GetPV_VentaById(int id)
        {
            var result = wrapper.GetPV_VentaById(id);
            return result;
        }

        [HttpGet, Route("List")]
        public async Task<ModelResponse> GetAllPV_Ventas()
        {
            var result = wrapper.GetAllPV_Venta();
            return result;
        }

        [HttpPost, Route("EstatusVenta/{id:long}/{valor}")]
        public async Task<ModelResponse> ActualizarEstatusVenta(long id, string valor)
        {
            var result = wrapper.ActualizarEstatusVenta((int)id, valor);
            return result;
        }

        [HttpPost, Route("Cargar/{id:int}")]
        public async Task<ModelResponse> UpdateCarga(int id)
        {
            var result = wrapper.UpdateCarga(id);
            return result;
        }

        [HttpGet, Route("search")]
        public async Task<ModelResponse> SearchPV_VentasByDateAndUser([FromUri] DateTime fecha)
        {
            var result = wrapper.SearchPV_VentasByDateAndUser(fecha);
            return result;
        }

        [HttpGet, Route("searchDeducciones")]
        public async Task<ModelResponse> SearchDeduccionesByDate([FromUri] DateTime fechaDeducciones)
        {
            var result = wrapper.SearchDeduccionesByDate(fechaDeducciones);
            return result;
        }

        [HttpGet, Route("RFID/{rfid}")]
        public ModelResponse SearchClienteByRFID(string rfid)
        {
            var result = wrapper.SearchClienteByRFID(rfid);
            return result;
        }

        [HttpGet, Route("VehiculosCliente/{id:long}")]
        public async Task<ModelResponse> GetVehiculosPublicoGralByIdCliente(long id)
        {
            var result = wrapper.GetVehiculosPublicoGralByIdCliente(id);
            return result;
        }

        // Parcial para generar Gastos / Deducciones

        [Route("Deducciones/List"), HttpGet]
        public ModelResponse GetAllDeducciones()
        {
            var result = wrapper.GetAllDeducciones();
            return result;
        }

        [HttpPost, Route("Deducciones")]
        public async Task<ModelResponse> SaveOrUpdateDeducciones(Deducciones v)
        {
            var result = wrapper.SaveOrUpdateDeducciones(v);
            return result;
        }

        [HttpDelete, Route("Deducciones/{id:long}")]
        public ModelResponse DeleteDeducciones(long id)
        {
            var result = wrapper.DeleteDeducciones(id);
            return result;
        }

    }
}