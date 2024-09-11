using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
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
        public async Task<ModelResponse> GetAllTipoVehiculo()
        {
            var result = await RequestAsync<object>("api/TipoVehiculo/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> SaveOrUpdateTipoVehiculo(TipoVehiculo u)
        {
            var result = await RequestAsync<object>("api/TipoVehiculo/", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetTipoDeVehiculoById(long tipovehiculoid)
        {
            var result = RequestAsync("api/TipoVehiculo/GetTipoDeVehiculoById/{tipovehiculoid}", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
    }
}