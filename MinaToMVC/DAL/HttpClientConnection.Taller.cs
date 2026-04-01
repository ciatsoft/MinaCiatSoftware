using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoTaller;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {
        #region Inventario
        public async Task<ModelResponse> SaveOrUpdateInventario(Inventario inventario)
        {
            var result = await RequestAsync<object>("api/Taller/Inventario/", HttpMethod.Post, inventario,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetAllInventario()
        {

            var result = await RequestAsync<object>("api/Taller/Inventario/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> GetInventarioById(long id)
        {
            var result = await RequestAsync<object>($"api/Taller/Inventario/{id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteInventarioById(long Id)
        {
            var result = await RequestAsync($"api/Taller/Inventario/{Id}", HttpMethod.Post, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        #endregion
        #region CategoriaInventario
        public async Task<ModelResponse> SaveOrUpdateCategoriaInventario(CategoriaInventario ci)
        {
            var result = await RequestAsync<object>("api/Taller/CategoriaInventario/", HttpMethod.Post, ci,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetAllCategoriaInventario()
        {

            var result = await RequestAsync<object>("api/Taller/CategoriaInventario/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> GetCategoriaInventarioById(long id)
        {
            var result = await RequestAsync<object>($"api/Taller/CategoriaInventario/{id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteCategoriaInventarioById(long Id)
        {
            var result = await RequestAsync($"api/Taller/CategoriaInventario/{Id}", HttpMethod.Post, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        #endregion
        #region ComponenteVehiculo
        public async Task<ModelResponse> SaveOrUpdateComponenteVehiculo(ComponenteVehiculo ci)
        {
            var result = await RequestAsync<object>("api/Taller/ComponenteVehiculo/", HttpMethod.Post, ci,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetAllComponenteVehiculo()
        {

            var result = await RequestAsync<object>("api/Taller/ComponenteVehiculo/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> GetAllPiezasAsignadasReparacionByIdVehiculo(int tipoVehiculo, long idVehiculo, long idReparacion)
        {
            var result = await RequestAsync<object>($"api/Taller/AsignarComponenteVehiculo/ByVehiculo/{tipoVehiculo}/{idVehiculo}/{idReparacion}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteComponenteVehiculoById(long Id)
        {
            var result = await RequestAsync($"api/Taller/ComponenteVehiculo/{Id}", HttpMethod.Post, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        public async Task<ModelResponse> GetAsignarPiezaVehiculoReparacionById(long id)
        {
            var result = await RequestAsync<object>($"api/Taller/AsignarPiezaVehiculoReparacion/{id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        #endregion
        #region ReparacionVehiculos
        public async Task<ModelResponse> SaveOrUpdateReparacionVehiculos(ReparacionVehiculos reparacionVehiculos)
        {
            var result = await RequestAsync<object>("api/Taller/ReparacionVehiculos/", HttpMethod.Post, reparacionVehiculos,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetAllReparacionVehiculos()
        {

            var result = await RequestAsync<object>("api/Taller/ReparacionVehiculos/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> GetReparacionVehiculosById(long id)
        {
            var result = await RequestAsync<object>($"api/Taller/ReparacionVehiculos/{id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteReparacionVehiculosById(long Id, long IdVehiculo, int TipoVehiculo)
        {
            string url = $"api/Taller/ReparacionVehiculos/{Id}/{IdVehiculo}/{TipoVehiculo}";

            var result = await RequestAsync(url, HttpMethod.Post, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        public async Task<ModelResponse> LiberarVehiculo(long Id, long IdVehiculo, int TipoVehiculo)
        {
            string url = $"api/Taller/ReparacionVehiculos/LiberarVehiculo/{Id}/{IdVehiculo}/{TipoVehiculo}";

            var result = await RequestAsync(url, HttpMethod.Post, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        public async Task<ModelResponse> GetAllRegistersReparacionVehiculos()
        {

            var result = await RequestAsync<object>("api/Taller/ReparacionVehiculos/AllList", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        #endregion
        #region RetirarPiezaVehiculoReparacion
        public async Task<ModelResponse> SaveOrUpdateRetirarPiezaVehiculoReparacion(RetirarPiezaVehiculoReparacion reparacionVehiculos)
        {
            var result = await RequestAsync<object>("api/Taller/RetirarPiezaVehiculoReparacion/", HttpMethod.Post, reparacionVehiculos,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetAllRetirarPiezaVehiculoReparacion()
        {

            var result = await RequestAsync<object>("api/Taller/RetirarPiezaVehiculoReparacion/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> GetRetirarPiezaVehiculoReparacionById(long id)
        {
            var result = await RequestAsync<object>($"api/Taller/RetirarPiezaVehiculoReparacion/{id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteRetirarPiezaVehiculoReparacionById(long Id)
        {
            string url = $"api/Taller/RetirarPiezaVehiculoReparacion/{Id}";

            var result = await RequestAsync(url, HttpMethod.Post, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        public async Task<ModelResponse> GetAllRetirarPiezaVehiculoReparacionByIdVehiculo(int tipoVehiculo, long idVehiculo, long idReparacion)
        {
            var result = await RequestAsync<object>($"api/Taller/RetirarPiezaVehiculoReparacion/ByVehiculo/{tipoVehiculo}/{idVehiculo}/{idReparacion}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        #endregion
        #region AsignarPiezas
        public async Task<ModelResponse> GetAllInventarioReutilizableByCategoria(long categoriaInventario)
        {
            var result = await RequestAsync<object>($"api/Taller/GetAllInventarioReutilizableByCategoria/{categoriaInventario}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetAllInventarioByCategoria(long categoriaInventario)
        {
            var result = await RequestAsync<object>($"api/Taller/GetAllInventarioByCategoria/{categoriaInventario}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        #endregion
        #region ResumenReparacion
        public async Task<ModelResponse> ActualizarEstado(long Id, int Estado)
        {
            var result = await RequestAsync<object>($"api/Taller/ActualizarEstado/{Id}/{Estado}", HttpMethod.Post, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        #endregion
        #region Reportes
        public async Task<ModelResponse> GetAllRetirarPiezasReutilizables()
        {

            var result = await RequestAsync<object>("api/Taller/PiezasReutilizables/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> GetAllRetirarPiezasNoReutilizables()
        {

            var result = await RequestAsync<object>("api/Taller/PiezasNoReutilizables/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> ReparacionVehiculosByDates(DateTime fechaInicio, DateTime fechaFin)
        {
            var url = $"api/Taller/ReparacionVehiculosByDates?fechaInicio={fechaInicio.ToString("yyyy-MM-dd")}&fechaFin={fechaFin.ToString("yyyy-MM-dd")}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        #endregion
    }
}