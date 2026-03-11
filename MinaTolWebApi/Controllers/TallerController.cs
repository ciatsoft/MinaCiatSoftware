using MinaTolEntidades;
using MinaTolEntidades.DtoTaller;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [RoutePrefix("api/Taller")]
    public class TallerController : ApiController
    {
        private DbWrapper wrapper { get; set; }
        public TallerController()
        {
            wrapper = new DbWrapper();
        }

        #region Inventario

        [HttpPost, Route("Inventario/")]
        public ModelResponse SaveOrUpdateInventario(Inventario inventario)
        {
            var result = wrapper.SaveOrUpdateInventario(inventario);
            return result;
        }

        [HttpGet, Route("Inventario/List")]
        public ModelResponse GetAllInventario()
        {
            var result = wrapper.GetAllInventario();
            return result;
        }

        [HttpGet, Route("Inventario/{id:long}")]
        public ModelResponse GetInventarioById(long id)
        {
            var result = wrapper.GetInventarioById(id);
            return result;
        }

        [HttpPost, Route("Inventario/{id:long}")]
        public ModelResponse DeleteInventarioById(long id)
        {
            var result = wrapper.DeleteInventarioById(id);
            return result;
        }

        #endregion
        #region CategoriaInventario

        [HttpPost, Route("CategoriaInventario/")]
        public ModelResponse SaveOrUpdateCategoriaInventario(CategoriaInventario ci)
        {
            var result = wrapper.SaveOrUpdateCategoriaInventario(ci);
            return result;
        }

        [HttpGet, Route("CategoriaInventario/List")]
        public ModelResponse GetAllCategoriaInventario()
        {
            var result = wrapper.GetAllCategoriaInventario();
            return result;
        }

        [HttpGet, Route("CategoriaInventario/{id:long}")]
        public ModelResponse GetCategoriaInventarioById(long id)
        {
            var result = wrapper.GetCategoriaInventarioById(id);
            return result;
        }

        [HttpPost, Route("CategoriaInventario/{id:long}")]
        public ModelResponse DeleteCategoriaInventarioById(long id)
        {
            var result = wrapper.DeleteCategoriaInventarioById(id);
            return result;
        }

        #endregion
        #region ComponenteVehiculo

        [HttpPost, Route("ComponenteVehiculo/")]
        public ModelResponse SaveOrUpdateComponenteVehiculo(ComponenteVehiculo ci)
        {
            var result = wrapper.SaveOrUpdateComponenteVehiculo(ci);
            return result;
        }

        [HttpGet, Route("ComponenteVehiculo/List")]
        public ModelResponse GetAllComponenteVehiculo()
        {
            var result = wrapper.GetAllComponenteVehiculo();
            return result;
        }

        [HttpGet, Route("ComponenteVehiculo/{id:long}")]
        public ModelResponse GetComponenteVehiculoById(long id)
        {
            var result = wrapper.GetComponenteVehiculoById(id);
            return result;
        }

        [HttpPost, Route("ComponenteVehiculo/{id:long}")]
        public ModelResponse DeleteComponenteVehiculoById(long id)
        {
            var result = wrapper.DeleteComponenteVehiculoById(id);
            return result;
        }

        #endregion
        #region ReparacionVehiculos
        [HttpPost, Route("ReparacionVehiculos/")]
        public ModelResponse SaveOrUpdateReparacionVehiculos(ReparacionVehiculos rv)
        {
            var result = wrapper.SaveOrUpdateReparacionVehiculos(rv);
            return result;
        }
        [HttpGet, Route("ReparacionVehiculos/List")]
        public ModelResponse GetAllReparacionVehiculos()
        {
            var result = wrapper.GetAllReparacionVehiculos();
            return result;
        }
        [HttpGet, Route("ReparacionVehiculos/{id:long}")]
        public ModelResponse GetReparacionVehiculosById(long id)
        {
            var result = wrapper.GetReparacionVehiculosById(id);
            return result;
        }
        [HttpPost, Route("ReparacionVehiculos/{id:long}")]
        public ModelResponse DeleteReparacionVehiculosById(long id)
        {
            var result = wrapper.DeleteReparacionVehiculosById(id);
            return result;
        }
        [HttpGet, Route("ReparacionVehiculos/AllList")]
        public ModelResponse GetAllRegistersReparacionVehiculos()
        {
            var result = wrapper.GetAllRegistersReparacionVehiculos();
            return result;
        }
        #endregion
    }
}
