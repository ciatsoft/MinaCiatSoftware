using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.Security;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {

        public async Task<ModelResponse> SaveOrUpdateTipoVehiculo(TipoVehiculo u)
        {
            var result = await RequestAsync<object>("api/TipoVehiculo", HttpMethod.Post, u,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        
    }
}