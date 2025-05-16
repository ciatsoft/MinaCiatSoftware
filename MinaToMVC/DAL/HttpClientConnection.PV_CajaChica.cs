using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoViajes;
using System.Web.Mvc;
using System.Web;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {
        public async Task<ModelResponse> SaveOrUpdatePV_CajaChica(PV_CajaChica u)
        {
            MappingColumSecurity(u);
            var result = await RequestAsync<object>("api/PV_CajaChica", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetAllPV_CajaChica()
        {
            var result = await RequestAsync<object>("api/PV_CajaChica", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetPV_CajaChicaById(long id)
        {
            var result = await RequestAsync<object>($"api/PV_CajaChica/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> DeletePV_CajaChica(long id)
        {
            var result = await RequestAsync<object>($"api/PV_CajaChica/{id}", HttpMethod.Delete, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        //Obtener Filtrado por Usuario Logueado y Fecha
        public async Task<ModelResponse> SearchPV_VajaChicaByDateAndUser(string userName, DateTime fecha)
        {
            // Armar la URL con parámetros de consulta correctamente
            string url = $"api/PV_CajaChica/search?userName={HttpUtility.UrlEncode(userName)}&fecha={fecha.ToString("yyyy-MM-dd")}";

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