using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using MinaTolEntidades.DtoVentas;
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
using MinaTolEntidades.DtoVentaPublicoGeneral;
using System.Web;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {

        #region TipoGastos

        public async Task<ModelResponse> SaveOrUpdateTipoGastos(DtoTipoGasto tipoGasto)
        {
            MappingColumSecurity(tipoGasto);
            var result = await RequestAsync<object>("api/Catalogos/TipoGastos/", HttpMethod.Post, tipoGasto,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> GetAllTipoGastos()
        {
            var result = await RequestAsync<object>("api/Catalogos/TipoGastos/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> DeleteTipoGastos(long id)
        {
            var result = await RequestAsync<ModelResponse>($"api/Catalogos/TipoGastos/{id}", HttpMethod.Delete, null,
            (responseString) =>
            {
                return JsonConvert.DeserializeObject<ModelResponse>(responseString);
            }, token.Token.access_token);

            return result;
        }

        public async Task<ModelResponse> GetTipoGastosById(long id)
        {
            var responseString = await RequestAsync<string>(
                $"api/Catalogos/TipoGastos/{id}",
                HttpMethod.Get,
                null,
                response => response // Si necesitas un transformador, aunque esto es redundante
            );

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(responseString);
            return modelResponse;
        }


        #endregion

    }
}