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

        [HttpPost, Route("")]
        public ModelResponse SaveOrupdateTrabajador(DtoTrabajador t)
        {
            var result = wrapper.SaveOrupdateTrabajador(t);
            return result;
        }
        [HttpGet, Route("")]
        public ModelResponse GetAllTrabajador()
        {
            var result = wrapper.GetAllTrabajador();
            return result;
        }
    }

}
