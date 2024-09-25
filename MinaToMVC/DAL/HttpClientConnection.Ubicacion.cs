using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
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
        public async Task<ModelResponse> GetAllUbicacion(string token)
        {

            var result = await RequestAsync<object>("api/Ubicacion/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> SaveOrUpdateUbicacion(DtoUbicacion u)
        {
            var result = await RequestAsync<object>("api/Ubicacion", HttpMethod.Post, u,
           new Func<string, string>((responseString) =>
           {
               return responseString;
           }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> GetUbicacionById(long Id)
        {
            var result = await RequestAsync<object>($"api/Ubicacion/{Id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse =JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
    }
}