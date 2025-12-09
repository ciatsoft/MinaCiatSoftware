using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades;
using Newtonsoft.Json;
using MinaTolEntidades.DtoVentaPublicoGeneral;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {
        public async Task<ModelResponse> SaveOrUpdateClientePublicoGral(ClientePublicoGral c)
        {
            var result = await RequestAsync<object>("api/ClientePublicoGral", HttpMethod.Post, c,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetAllClientePublicoGral()
        {
            var result = await RequestAsync<object>("api/ClientePublicoGral/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetClientePublicoGralById(long id)
        {
            var result = await RequestAsync<object>($"api/ClientePublicoGral/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> DeleteClientePublicoGral(long id)
        {
            var result = await RequestAsync<object>($"api/ClientePublicoGral/{id}", HttpMethod.Post, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
    }
}