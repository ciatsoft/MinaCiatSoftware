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
using MinaTolEntidades.DtoViajes;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {

        public async Task<ModelResponse> SaveOrUpdateViajeLocal(DtoViajeLocal u)
        {
            MappingColumSecurity(u);
            var result = await RequestAsync<object>("api/Viajes/Local", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetAllViajeLocal(string token)
        {
            var result = await RequestAsync<object>("api/Viajes/Listlocal", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> SaveOrUpdateViajeInterno(DtoViajeInterno u)
        {
            MappingColumSecurity(u);
            var result = await RequestAsync<object>("api/Viajes/Interno", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetAllViajeInterno(string token)
        {
            var result = await RequestAsync<object>("api/Viajes/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> GetViajeInternoById(long id)
        {
            var result = await RequestAsync<object>($"api/Viajes/Interno/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>

            {
                return responseString;
            }));

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetViajeLocalById(long id)
        {
            var result = await RequestAsync<object>($"api/Viajes/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>

            {
                return responseString;
            }));

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetFoliadorByNombre(string Nombre)
        {
            var result = await RequestAsync<object>($"api/Foliador/{Nombre}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }


    }
}