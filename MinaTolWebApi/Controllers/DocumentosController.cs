using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/Documento")]
    public class DocumentoController : ApiController
    {
        private DbWrapper wrapper { get; set; }

        public DocumentoController()
        {
            wrapper = new DbWrapper();
        }

        // Obtener todos los documentos
        [HttpGet, Route("List")]
        public ModelResponse GetAllDocumentos()
        {
            var result = wrapper.GetAllDocumentos();
            return result;
        }

        // Obtener documento por Id
        [HttpGet, Route("{id:long}")]
        public ModelResponse GetDocumentoById(long id)
        {
            var result = wrapper.GetDocumentoById(id);
            return result;
        }

        // Guardar o actualizar documento
        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateDocumento(Documentos doc)
        {
            var result = wrapper.SaveOrUpdateDocumento(doc);
            return result;
        }

        // Eliminar documento por Id
        [HttpDelete, Route("{id:long}")]
        public ModelResponse DeleteDocumentoById(long id)
        {
            var result = wrapper.DeleteDocumentoById(id);
            return result;
        }
    }
}
