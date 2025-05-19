using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
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
        public async Task<ModelResponse> GetGetMaterialUbicacionByUbicacion(long Id)
        {
            var result = await RequestAsync<object>($"api/TipoMaterialUbicacion/MaterialesUbicacion/{Id}", HttpMethod.Get, null,
               new Func<string, string>((responseString) =>
               {
                   return responseString;
               }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
    }
}