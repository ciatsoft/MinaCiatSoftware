using MinaTolEntidades;
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
            var result = await RequestAsync($"api/Taller/Inventario/{Id}", HttpMethod.Delete, null,
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
            var result = await RequestAsync($"api/Taller/CategoriaInventario/{Id}", HttpMethod.Delete, null,
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
                }));
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
        public async Task<ModelResponse> GetComponenteVehiculoById(long id)
        {
            var result = await RequestAsync<object>($"api/Taller/ComponenteVehiculo/{id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteComponenteVehiculoById(long Id)
        {
            var result = await RequestAsync($"api/Taller/ComponenteVehiculo/{Id}", HttpMethod.Delete, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        #endregion
    }
}