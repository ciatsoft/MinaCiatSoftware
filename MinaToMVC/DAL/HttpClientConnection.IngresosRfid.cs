using MinaTolEntidades.DtoIngresosRfid;
using MinaTolEntidades;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.DtoCatalogos;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection

    {
        public async Task<ModelResponse> SaveOrUpdateIngresosRfid(IngresosRfid u)
        {
            MappingColumSecurity(u);
            var result = await RequestAsync<object>("api/IngresosRfid", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetAllIngresosRfid()
        {
            var result = await RequestAsync<object>("api/IngresosRfid", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetIngresosRfidById(int id)
        {
            var result = await RequestAsync<object>($"api/IngresosRfid/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> DeleteIngresosRfid(long id)
        {
            var result = await RequestAsync<object>($"api/IngresosRfid/{id}", HttpMethod.Delete, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

    }
}