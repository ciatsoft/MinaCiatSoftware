using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.Dto_Rfid;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {

        public async Task<ModelResponse> SaveOrUpdateRfid(Rfid u)
        {
            MappingColumSecurity(u);
            var result = await RequestAsync<object>("api/Rfid", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetAllRfid()
        {
            var result = await RequestAsync<object>("api/Rfid", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetRfidById(long id)
        {
            var result = await RequestAsync<object>($"api/Rfid/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> DeleteRfid(long id)
        {
            var result = await RequestAsync<object>($"api/Rfid/{id}", HttpMethod.Delete, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
    }
}