using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using MinaTolEntidades;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolWebApi.DAL;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/ClientePublicoGral")]
    public class ClientePublicoGralController : ApiController
    {
        private DbWrapper wrapper {  get; set; }
        public ClientePublicoGralController()
        {
            wrapper = new DbWrapper();
        }

        #region Cliente Publico General
        [Route("List"), HttpGet]
        public async Task<ModelResponse> GetAllClientePublicoGral()
        {
            var result = wrapper.GetAllClientePublicoGral();
            return result;
        }

        [Route("{id:long}"), HttpGet]
        public async Task<ModelResponse> GetClientePublicoGralById(long id)
        {
            var result = wrapper.GetClientePublicoGralById(id);
            return result;
        }

        [Route(""), HttpPost]
        public async Task<ModelResponse> SaveOrUpdateClientePublicoGral(ClientePublicoGral c)
        {
            var result = wrapper.SaveOrUpdateClientePublicoGral(c);
            return result;
        }

        [Route("{id:long}"), HttpPost]
        public async Task<ModelResponse> DeleteClientePublicoGral(long id)
        {
            var result = wrapper.DeleteClientePublicoGral(id);
            return result;
        }
        #endregion

        #region HistoricoRFID
        [Route("HistoricoRFID/"), HttpPost]
        public async Task<ModelResponse> SaveOrUpdateHistoricoRFID(HistoricoRFID c)
        {
            var result = wrapper.SaveOrUpdateHistoricoRFID(c);
            return result;
        }
        [Route("List/HistoricoRFID"), HttpGet]
        public async Task<ModelResponse> GetAllHistoricoRFID()
        {
            var result = wrapper.GetAllHistoricoRFID();
            return result;
        }
        [Route("HistoricoRFID/{id:long}"), HttpGet]
        public async Task<ModelResponse> GetHistoricoRFIDById(long id)
        {
            var result = wrapper.GetHistoricoRFIDById(id);
            return result;
        }
        [Route("HistoricoRFID/{id:long}"), HttpPost]
        public async Task<ModelResponse> DeleteHistoricoRFID(long id)
        {
            var result = wrapper.DeleteHistoricoRFID(id);
            return result;
        }
        [Route("HistoricoRFID/Cliente/{id:long}"), HttpGet]
        public async Task<ModelResponse> GetAllHistoricoRFIDByIdCliente(long id)
        {
            var result = wrapper.GetAllHistoricoRFIDByIdCliente(id);
            return result;
        }
        [Route("HistoricoRFID/TotalCliente/{id:long}"), HttpGet]
        public async Task<ModelResponse> TotalHistoricoRFIDByIdCliente(long id)
        {
            var result = wrapper.TotalHistoricoRFIDByIdCliente(id);
            return result;
        }
        #endregion
    }
}
