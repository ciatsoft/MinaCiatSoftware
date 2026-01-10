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
    [RoutePrefix("api/BajasEmpleado")]
    public class BajasEmpleadoController : ApiController
    {
        private DbWrapper wrapper { get; set; }

        public BajasEmpleadoController()
        {
            wrapper = new DbWrapper();
        }

        // Obtener todos los registros
        [HttpGet, Route("List")]
        public ModelResponse GetAllBajasEmpleado()
        {
            var result = wrapper.GetAllBajasEmpleado();
            return result;
        }

        // Obtener registro por Id
        [HttpGet, Route("{id:long}")]
        public ModelResponse GetBajasEmpleadoById(long id)
        {
            var result = wrapper.GetBajasEmpleadoById(id);
            return result;
        }

        // Guardar o actualizar registro
        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateBajasEmpleado(DtoBajasEmpleado bajasEmpleado)
        {
            var result = wrapper.SaveOrUpdateBajasEmpleado(bajasEmpleado);
            return result;
        }

        // Eliminar registro por Id
        [HttpDelete, Route("{id:long}")]
        public ModelResponse DeleteBajasEmpleadoById(long id)
        {
            var result = wrapper.DeleteBajasEmpleadoById(id);
            return result;
        }
    }
}