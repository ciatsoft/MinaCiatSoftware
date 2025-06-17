using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using MinaTolEntidades;
using Newtonsoft.Json;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {

        public async Task<ModelResponse> GetAllPermisos()
        {
            var result = await RequestAsync<object>("api/Catalogos/RolPermisos/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetPermisosByIdRol(long id)
        {
            var url = $"api/Catalogos/RolPermisos/{id}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null, new Func<string, string>((responseString) =>
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