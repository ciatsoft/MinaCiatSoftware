using MinaTolEntidades.DtoClientes;
using MinaTolEntidades;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {
        // Guarda o actualiza un tipo de vehículo
        public async Task<ModelResponse> SaveOrUpdateTipoVehiculo(TipoVehiculo tipoVehiculo)
        {
            // Asegura que se establezca la seguridad por columnas si es necesario
            MappingColumSecurity(tipoVehiculo);

            // Envío del objeto como JSON a la API
            var result = await RequestAsync<object>(
                "api/TipoVehiculo",
                HttpMethod.Post,
                tipoVehiculo,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }),
                token.Token.access_token
            );

            // Deserializa la respuesta
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        // Obtiene todos los tipos de vehículo
        public async Task<ModelResponse> GetAllTipoVehiculo()
        {
            var result = await RequestAsync<object>(
                "api/TipoVehiculo",
                HttpMethod.Get,
                null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }),
                token.Token.access_token
            );

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        // Obtiene un tipo de vehículo por ID
        public async Task<ModelResponse> GetTipoDeVehiculoById(long id)
        {
            var result = await RequestAsync<object>(
                $"api/TipoVehiculo/{id}",
                HttpMethod.Get,
                null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }),
                token.Token.access_token
            );

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        // Elimina (o da de baja) un tipo de vehículo por ID
        public async Task<ModelResponse> DeleteTipoVehiculo(long id)
        {
            var result = await RequestAsync<object>(
                $"api/TipoVehiculo/{id}",
                HttpMethod.Delete,
                null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }),
                token.Token.access_token
            );

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
    }
}
