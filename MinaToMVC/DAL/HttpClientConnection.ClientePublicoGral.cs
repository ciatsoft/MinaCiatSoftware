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
        #region Cliente Publico General
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
        #endregion

        #region HistoricoRFID
        public async Task<ModelResponse> SaveOrUpdateHistoricoRFID(HistoricoRFID c)
        {
            var result = await RequestAsync<object>("api/ClientePublicoGral/HistoricoRFID", HttpMethod.Post, c,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetAllHistoricoRFID()
        {
            var result = await RequestAsync<object>("api/ClientePublicoGral/List/HistoricoRFID", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetHistoricoRFIDById(long id)
        {
            var result = await RequestAsync<object>($"api/ClientePublicoGral/HistoricoRFID/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> GetAllHistoricoRFIDByIdCliente(long id)
        {
            var result = await RequestAsync<object>($"api/ClientePublicoGral/HistoricoRFID/Cliente/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> TotalHistoricoRFIDByIdCliente(long id)
        {
            var result = await RequestAsync<object>($"api/ClientePublicoGral/HistoricoRFID/TotalCliente/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> DeleteHistoricoRFID(long id)
        {
            var result = await RequestAsync<object>($"api/ClientePublicoGral/HistoricoRFID/{id}", HttpMethod.Post, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        #endregion
    }
}