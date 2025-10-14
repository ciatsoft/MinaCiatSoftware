using MinaTolEntidades;
using MinaTolEntidades.DtoViajes;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Policy;
using System.Threading.Tasks;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/Viajes")]
    public class ViajesController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public ViajesController()
        {
            wrapper = new DbWrapper();
        }
        [HttpGet, Route("List")]
        public ModelResponse GetAllViajeInterno()
        {
            var result = wrapper.GetAllViajeInterno();
            return result;
        }

        [HttpGet, Route("Listlocal")]
        public ModelResponse GetAllViajeLocal()
        {
            var result = wrapper.GetAllViajeLocal();
            return result;
        }
        [HttpGet, Route("ListlocalDates/{fecha1:datetime}/{fecha2:datetime}/{tipoCliente}")]
        public ModelResponse GetAllViajeLocalByDates(DateTime fecha1, DateTime fecha2, string tipoCliente)
        {
            var result = wrapper.GetAllViajeLocalByDates(fecha1, fecha2, tipoCliente);
            return result;
        }
        [HttpGet, Route("ListlocalDatesFacturado/{fecha1:datetime}/{fecha2:datetime}")]
        public ModelResponse GetAllViajeLocalByDatesFacturado(DateTime fecha1, DateTime fecha2)
        {
            var result = wrapper.GetAllViajeLocalByDatesFacturado(fecha1, fecha2);
            return result;
        }
        [HttpGet, Route("CheckPreFactura/{id:long}/{facturado:bool}")]
        public ModelResponse CheckPreFactura(long id, bool facturado)
        {
            var result = wrapper.CheckPreFactura(id, facturado);
            return result;
        }
        [HttpGet, Route("GetAllViajeLocalByDatesClientDireccion/{fecha1:datetime}/{fecha2:datetime}/{idCliente:long}/{idDireccion:long}")]
        public ModelResponse GetAllViajeLocalByDatesClientDireccion(DateTime fecha1, DateTime fecha2, long idCliente, long idDireccion)
        {
            var result = wrapper.GetAllViajeLocalByDatesClientDireccion(fecha1, fecha2, idCliente, idDireccion);
            return result;
        }

        [HttpGet, Route("Interno/{id:long}")]
        public ModelResponse GetViajeInternoById(long id)
        {
            var result = wrapper.GetViajeInternoById(id);
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public ModelResponse GetViajeLocalById(long id)
        {
            var result = wrapper.GetViajeLocalById(id);
            return result;
        }

        [HttpPost, Route("Interno")]
        public ModelResponse SaveOrUpdateViajeInterno(DtoViajeInterno vi)
        {
            var result = wrapper.SaveOrUpdateViajeInterno(vi);
            return result;
        }
        [HttpPost, Route("Local")]
        public ModelResponse SaveOrUpdateViajeLocal(DtoViajeLocal vl)
        {
            var result = wrapper.SaveOrUpdateViajeLocal(vl);
            return result;
        }
        [HttpDelete, Route("DeleteViajeLocal/{id:long}")]
        public ModelResponse DeleteViajeLocal(long id)
        {
            var result = wrapper.DeleteViajeLocal(id);
            return result;
        }
        [Route("Material/{id:long}"), HttpGet]
        public ModelResponse GetTipoMaterialByCliente(long id)
        {
            var result = wrapper.GetTipoMaterialByCliente(id);
            return result;
        }
    }
}
