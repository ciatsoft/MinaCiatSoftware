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
    }

}
