using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoViajes;
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
        public async Task<ModelResponse> GetTipoMaterialByCliente (long id)
        {
            var result = await RequestAsync<object>($"api/Viajes/Material/{id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        public async Task<ModelResponse> GetClienteTipoMaterialByMaterial(long clienteid, long materialid)
        {
            var result = await RequestAsync<object>($"api/ClienteTipoMaterial/{clienteid}/{materialid}", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>

                {
                    return responseString;
                }));
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }

            public async Task<ModelResponse> SaveOrUpdateClienteTipoMaterial(ClienteTipoMaterial t)
        {
            var result = await RequestAsync<object>("api/ClienteTipoMaterial/Agregar", HttpMethod.Post, t,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> DeleteClienteTipoMaterial(ClienteTipoMaterial t)
        {
            var result = await RequestAsync<object>("api/ClienteTipoMaterial/Eliminar", HttpMethod.Post, t,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
    }
}