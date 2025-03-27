using MinaTolEntidades;
using MinaTolEntidades.DtoSucursales;
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
        public async Task<ModelResponse> GetAllUnidadMedida()
        {
            var result = await RequestAsync<object>("api/UnidadMedida/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> SaveOrUpdateUnidadMedida(UnidadMedida u)
        {
            var result = await RequestAsync<object>("api/UnidadMedida/", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetUnidadMedidaById(long unidadId)
        {
            var result = await RequestAsync($"api/UnidadMedida/{unidadId}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        public async Task<ModelResponse> DeleteUnidadMedida(long unidadId)
        {
            var result = await RequestAsync($"api/UnidadMedida/{unidadId}", HttpMethod.Delete, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
    }
}