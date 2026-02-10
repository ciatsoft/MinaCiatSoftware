using MinaTolEntidades;
using MinaTolEntidades.VehiculoCarga;
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
        #region VehiculoCarga
        public async Task<ModelResponse> GetAllVehiculoCarga()
        {
            var result = await RequestAsync<object>("api/VehiculoCarga/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetVehiculoCargaById(long id)
        {
            var result = await RequestAsync<object>($"api/VehiculoCarga/{id}", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> SaveOrUpdateVehiculoCarga(VehiculoCarga vc)
        {
            MappingColumSecurity(vc);
            var result = await RequestAsync<object>("api/VehiculoCarga/", HttpMethod.Post, vc,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteVehiculoCarga(long id)
        {
            var result = await RequestAsync<object>($"api/VehiculoCarga/{id}", HttpMethod.Post, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        #endregion

        #region RFIDCarga
        public async Task<ModelResponse> GetAllRFIDCarga()
        {
            var result = await RequestAsync<object>("api/VehiculoCarga/RFIDCarga/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetRFIDCargaById(long id)
        {
            var result = await RequestAsync<object>($"api/VehiculoCarga/RFIDCarga/{id}", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetRFIDCargaByRFID(string rfid)
        {
            var result = await RequestAsync<object>($"api/VehiculoCarga/RFIDCarga/RFID/{rfid}", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> SaveOrUpdateRFIDCarga(RFIDCarga vc)
        {
            MappingColumSecurity(vc);
            var result = await RequestAsync<object>("api/VehiculoCarga/RFIDCarga/", HttpMethod.Post, vc,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteRFIDCarga(long id)
        {
            var result = await RequestAsync<object>($"api/VehiculoCarga/RFIDCarga/Delete/{id}", HttpMethod.Post, null,
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