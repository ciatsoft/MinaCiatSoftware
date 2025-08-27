using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {
        public async Task<ModelResponse> GetMaterialUbicacionByUbicacion(int id)
        {
            var result = await RequestAsync<object>($"api/VentaPublicoGeneral/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }



        //--------------PREPAGO---------------------//

        public async Task<ModelResponse> SaveOrUpdatePrepago(List<Prepago> prepagos)
        {
            var result = await RequestAsync<object>("api/VentaPublicoGeneral/Prepagos", HttpMethod.Post, prepagos,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> DeletePrepago(long Id)
        {
            var result = await RequestAsync($"api/VentaPublicoGeneral/Prepago/{Id}", HttpMethod.Delete, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }

        public async Task<ModelResponse> GetAllPrepagos()
        {

            var result = await RequestAsync<object>("api/VentaPublicoGeneral/Prepago/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> GetUltimoFolio()
        {

            var result = await RequestAsync<object>("api/VentaPublicoGeneral/Prepago/UltimoFolio", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> GetAllPrepagosByRFID(string rfid)
        {
            var result = await RequestAsync<object>($"api/VentaPublicoGeneral/Prepago/{rfid}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> GetAllPrepagosByFolio(string folio)
        {
            var result = await RequestAsync<object>($"api/VentaPublicoGeneral/Prepago/folio/{folio}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> VentasDiariasPrepago(DateTime fecha)
        {
            string url = $"api/VentaPublicoGeneral/Prepago/VentasDiarias/{fecha.ToString("yyyy-MM-dd")}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }


        // ---------------- Canjeo Vale ----------------
        public async Task<ModelResponse> ObtenerVentaPorFolio(string folio)
        {
            var result = await RequestAsync<object>($"api/VentaPublicoGeneral/Folio/{folio}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
        public async Task<ModelResponse> ProcesarCanjeo(Canjeo canjeo)
        {
            var result = await RequestAsync<object>("api/VentaPublicoGeneral/Prepago/Canjeo", HttpMethod.Post, canjeo,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
    }
}
