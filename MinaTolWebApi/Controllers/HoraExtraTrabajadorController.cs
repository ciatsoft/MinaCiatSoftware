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
    [RoutePrefix("api/HoraExtraTrabajador")]
    public class HoraExtraTrabajadorController : ApiController
    {
        private DbWrapper wrapper { get; set; }

        public HoraExtraTrabajadorController()
        {
            wrapper = new DbWrapper();
        }

        // Obtener todos los registros
        [HttpGet, Route("List")]
        public ModelResponse GetAllHoraExtraTrabajador()
        {
            var result = wrapper.GetAllHoraExtraTrabajador();
            return result;
        }

        // Obtener registro por Id
        [HttpGet, Route("{id:long}")]
        public ModelResponse GetHoraExtraTrabajadorById(long id)
        {
            var result = wrapper.GetHoraExtraTrabajadorById(id);
            return result;
        }

        // Guardar o actualizar registro
        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateHoraExtraTrabajador(DtoHoraExtraTrabajador horaExtra)
        {
            var result = wrapper.SaveOrUpdateHoraExtraTrabajador(horaExtra);
            return result;
        }

        // Eliminar registro por Id
        [HttpDelete, Route("{id:long}")]
        public ModelResponse DeleteHoraExtraTrabajadorById(long id)
        {
            var result = wrapper.DeleteHoraExtraTrabajadorById(id);
            return result;
        }
    }
}
