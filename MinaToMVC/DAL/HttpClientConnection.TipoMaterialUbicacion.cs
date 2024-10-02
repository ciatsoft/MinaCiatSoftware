using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
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
        public async Task<ModelResponse> GetAllTipoMaterialUbicacion(string token)
        {
            var result = await RequestAsync<object>("api/TipoMaterialUbicacion/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> SaveOrUpdateTipoMaterialUbicacion(DtoTipoMaterialUbicacion tmu)
        {
            MappingColumSecurity(tmu);
            var result = await RequestAsync<object>("api/TipoMaterialUbicacion", HttpMethod.Post, tmu,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetTipoMaterialUbicacionById(long TipoMaterialUbicacionId)
        {
            var result = await RequestAsync($"api/TipoMaterialUbicacion/{TipoMaterialUbicacionId}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }

        public async Task<ModelResponse> GetTipoMaterialByUnicacion(long id)
        {
            var result = await RequestAsync($"api/TipoMaterialUbicacion/Ubicacion/{id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
    }
}