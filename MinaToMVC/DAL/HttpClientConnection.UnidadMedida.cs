﻿using MinaTolEntidades;
using MinaTolEntidades.DtoSucursales;
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
        public async Task<ModelResponse> GetAllUnidadMedida()
        {
            var result = await RequestAsync<object>("api/UnidadMedida/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
    }
}