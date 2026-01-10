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
        public async Task<ModelResponse> GetAllDireccionCliente()
        {

            var result = await RequestAsync<object>("api/DireccionCliente/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> SaveOrUpdateDireccionCliente(DtoUbicacion u)
        {
            var result = await RequestAsync<object>("api/DireccionCliente", HttpMethod.Post, u,
           new Func<string, string>((responseString) =>
           {
               return responseString;
           }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> GetDireccionClienteById(long Id)
        {
            var result = await RequestAsync<object>($"\"api/TipoMaterialUbicacion/MaterialesUbicacion/{Id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse =JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
    }
}