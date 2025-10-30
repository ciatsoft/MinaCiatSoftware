using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades.DtoSucursales;
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
    [RoutePrefix("api/Trabajador")]
    public class TrabajadorController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public TrabajadorController()
        {
            wrapper = new DbWrapper();
        }
        #region Salario
        [HttpGet, Route("Salario/Trabajador/{id:long}")]
        public ModelResponse GetSalarioByTrabajador(int id)
        {
            var result = wrapper.GetSalarioByTrabajador(id);
            return result;
        }
        [HttpPost, Route("Salario")]
        public ModelResponse SaveOrUpdateSalario(DtoSalario s)
        {
            var result = wrapper.SaveOrUpdateSalario(s);
            return result;
        }
        #endregion

        #region Empleado
        [HttpPost, Route("")]
        public ModelResponse SaveOrupdateEmpleado(Empleado t)
        {
            var result = wrapper.SaveOrupdateEmpleado(t);
            return result;
        }
        [HttpGet, Route("List")]
        public ModelResponse GetAllEmpleados()
        {
            var result = wrapper.GetAllEmpleados();
            return result;
        }
        [HttpGet, Route("ObtenerDatosEmpleado/{id:long}")]
        public ModelResponse ObtenerDatosEmpleado(long id)
        {
            var result = wrapper.ObtenerDatosEmpleado(id);
            return result;
        }

        [HttpGet, Route("{id:long}")]
        public ModelResponse GetTrabajadorById(long id)
        {
            var result = wrapper.GetTrabajadorById(id);
            return result;
        }
        [HttpDelete, Route("{id:long}")]
        public ModelResponse DeleteEmpleadoById(long id)
        {
            var result = wrapper.DeleteEmpleadoById(id);
            return result;
        }
        #endregion

        #region BajasEmpleados
        [HttpGet, Route("Bajas/")]
        public ModelResponse GetAllBajasEmpleado()
        {
            var result = wrapper.GetAllBajasEmpleadoList();
            return result;
        }

        [HttpPost, Route("Recontratacion/{id:long}")]
        public ModelResponse Recontratacion(long id)
        {
            var result = wrapper.Recontratacion(id);
            return result;
        }
        #endregion

        #region DocumentosEmpleados
        [HttpPost, Route("DocumentosTrabajador/")]
        public ModelResponse SaveOrUpdateDocumentosEmpleado(DocumentosEmpleado s)
        {
            var result = wrapper.SaveOrUpdateDocumentosEmpleado(s);
            return result;
        }

        [HttpDelete, Route("DocumentosTrabajador/{id:long}")]
        public ModelResponse DeleteDocuentoEmpleadoById(long id)
        {
            var result = wrapper.DeleteDocumentoEmpleadoById(id);
            return result;
        }

        [HttpGet, Route("DocumentosTrabajador/List")]
        public ModelResponse GetAllDocumentosEmpleado()
        {
            var result = wrapper.GetAllDocumentosEmpleado();
            return result;
        }


        [HttpGet, Route("DocumentosTrabajador/{id:long}")]
        public ModelResponse GetDocumentoEmpleadoById(long id)
        {
            var result = wrapper.GetDocumentoEmpleadoById(id);
            return result;
        }
        #endregion

        #region ConceptosEmpleados
        [HttpPost, Route("ConceptosEmpleados/")]
        public ModelResponse SaveOrUpdateConceptosEmpleados(ConceptosEmpleado ce)
        {
            var result = wrapper.SaveOrUpdateConceptosEmpleados(ce);
            return result;
        }

        [HttpDelete, Route("ConceptosEmpleados/{id:long}")]
        public ModelResponse DeleteConceptosEmpleadosById(long id)
        {
            var result = wrapper.DeleteConceptosEmpleadosById(id);
            return result;
        }

        [HttpGet, Route("ConceptosEmpleados/List")]
        public ModelResponse GetAllConceptosEmpleados()
        {
            var result = wrapper.GetAllConceptosEmpleados();
            return result;
        }

        [HttpGet, Route("ConceptosEmpleados/{id:long}")]
        public ModelResponse GetConceptosEmpleadosById(long id)
        {
            var result = wrapper.GetConceptosEmpleadosById(id);
            return result;
        }
        #endregion

        #region ConceptoEmpleadoByIdEmpleado

        [HttpGet, Route("GetAllConceptoEmpleadoByIdEmpleado/{id:long}")]
        public ModelResponse GetAllConceptoEmpleadoByIdEmpleado(long id)
        {
            var result = wrapper.GetAllConceptoEmpleadoByIdEmpleado(id);
            return result;
        }
        [HttpGet, Route("GetSalarioActivoByIdEmpleado/{id:long}")]
        public ModelResponse GetSalarioActivoByIdEmpleado(long id)
        {
            var result = wrapper.GetSalarioActivoByIdEmpleado(id);
            return result;
        }
        [HttpPost, Route("SaveOrUpdateConceptoEmpleadoByIdEmpleado/")]
        public ModelResponse SaveOrUpdateConceptoEmpleadoByIdEmpleado(ConceptoEmpleado ce)
        {
            var result = wrapper.SaveOrUpdateConceptoEmpleadoByIdEmpleado(ce);
            return result;
        }
        [HttpPost, Route("DeleteConceptoEmpleadoById/{id:long}")]
        public ModelResponse DeleteConceptoEmpleadoById(long id)
        {
            var result = wrapper.DeleteConceptoEmpleadoById(id);
            return result;
        }
        #endregion

        #region NominaEmpleado
        [HttpGet, Route("GetAllNominasByIdEmpleado/{id:long}")]
        public ModelResponse GetAllNominasByIdEmpleado(long id)
        {
            var result = wrapper.GetAllNominasByIdEmpleado(id);
            return result;
        }
        [HttpPost, Route("SaveOrUpdateNominasByIdEmpleado/")]
        public ModelResponse SaveOrUpdateNominasByIdEmpleado(NominaEmpleado ce)
        {
            var result = wrapper.SaveOrUpdateNominasByIdEmpleado(ce);
            return result;
        }
        [HttpPost, Route("DeleteNominasByIdEmpleado/{id:long}")]
        public ModelResponse DeleteNominasByIdEmpleado(long id)
        {
            var result = wrapper.DeleteNominasByIdEmpleado(id);
            return result;
        }
        [HttpGet, Route("GetAllConceptoEmpleadoByIdEmpleadoDates/{id:long}/{fechaInicio}/{fechaFinal}")]
        public ModelResponse GetAllConceptoEmpleadoByIdEmpleadoDates(long id, DateTime fechaInicio, DateTime fechaFinal)
        {
            var result = wrapper.GetAllConceptoEmpleadoByIdEmpleadoDates(id, fechaInicio, fechaFinal);
            return result;
        }
        [HttpGet, Route("GetAllPrestamosByIdEmpleadoDates/{id:long}/{fechaInicio}/{fechaFinal}")]
        public ModelResponse GetAllPrestamosByIdEmpleadoDates(long id, DateTime fechaInicio, DateTime fechaFinal)
        {
            var result = wrapper.GetAllPrestamosByIdEmpleadoDates(id, fechaInicio, fechaFinal);
            return result;
        }
        [HttpGet, Route("SearchNominaEmpleadoByDates/{id:long}/{fechaInicio}/{fechaFinal}")]
        public ModelResponse SearchNominaEmpleadoByDates(long id, DateTime fechaInicio, DateTime fechaFinal)
        {
            var result = wrapper.SearchNominaEmpleadoByDates(id, fechaInicio, fechaFinal);
            return result;
        }
        #endregion

        #region Reportes
        [HttpGet, Route("GetNomiasReporte/{fechaInicio}/{fechaFinal}")]
        public ModelResponse GetNomiasReporte(DateTime fechaInicio, DateTime fechaFinal)
        {
            var result = wrapper.GetNomiasReporte(fechaInicio, fechaFinal);
            return result;
        }
        [HttpGet, Route("GetConceptosReporte/{fechaInicio}/{fechaFinal}")]
        public ModelResponse GetConceptosReporte(DateTime fechaInicio, DateTime fechaFinal)
        {
            var result = wrapper.GetConceptosReporte(fechaInicio, fechaFinal);
            return result;
        }
        #endregion
    }
}
