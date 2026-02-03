using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using Newtonsoft.Json;
using MinaTolEntidades.DtoVentaPublicoGeneral;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {
        public async Task<ModelResponse> SaveOrUpdatePV_CorteCaja(PV_CorteCaja u)
        {
            MappingColumSecurity(u);
            var result = await RequestAsync<object>("api/PV_CorteCaja", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetAllPV_CorteCaja()
        {
            var result = await RequestAsync<object>("api/PV_CorteCaja", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetPV_CorteCajaById(long id)
        {
            var result = await RequestAsync<object>($"api/PV_CorteCaja/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> DeletePV_CorteCaja(long id)
        {
            var result = await RequestAsync<object>($"api/PV_CorteCaja/{id}", HttpMethod.Post, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        //Obtener Filtrado por Usuario Logueado y Fecha
        public async Task<ModelResponse> SearchPV_DineroCajaByDateAndUser(string userName, DateTime fecha)
        {
            // Armar la URL con parámetros de consulta correctamente
            string url = $"api/PV_CorteCaja/search?userName={HttpUtility.UrlEncode(userName)}&fecha={fecha.ToString("yyyy-MM-dd")}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
    }
}