using MinaTolEntidades;
using MinaTolEntidades.Security;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {
        public async Task<ModelResponse> FirstValidation(string userName, string password)
        {
            var userTemp = new Usuario()
            {
                Email = userName,
                Password = password
            };

            var result = await RequestAsync<object>("api/Usuario/FirstValidation", HttpMethod.Post, userTemp,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }));

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> ValidateUserName(string userName, string token)
        {
            var userTemp = new Usuario()
            {
                UserName = userName
            };

            var result = await RequestAsync<object>("api/Usuario/ValidateUserName", HttpMethod.Post, userTemp,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
    }
}