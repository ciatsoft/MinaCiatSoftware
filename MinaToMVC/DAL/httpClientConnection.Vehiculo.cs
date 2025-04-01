using MinaTolEntidades.DtoClientes;
using MinaTolEntidades;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.DtoCatalogos;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection 
    {

        public async Task<ModelResponse> SaveOrUpdateVehiculo(Vehiculo u)
        {
            MappingColumSecurity(u);
            var result = await RequestAsync<object>("api/Vehiculo", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetAllVehiculo()
        {
            var result = await RequestAsync<object>("api/Vehiculo", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> DeleteVehiculo(long id)
        {
            var result = await RequestAsync<object>($"api/Vehiculo/{id}", HttpMethod.Delete, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

    }
}