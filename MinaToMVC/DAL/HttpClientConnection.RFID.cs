using MinaTolEntidades.DtoRfid;
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

        public async Task<ModelResponse> SaveOrUpdateRFID(Rfid r)
        {
            MappingColumSecurity(r);
            var result = await RequestAsync<object>("api/Rfid", HttpMethod.Post, r,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> GetAllRFID()
        {
            var result = await RequestAsync<object>("api/Rfid", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> GetRFIDById(long id)
        {
            var result = await RequestAsync<object>($"api/Rfid/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> DeleteRFID(long id)
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