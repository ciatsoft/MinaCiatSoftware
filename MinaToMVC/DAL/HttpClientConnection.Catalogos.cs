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

        #endregion

    }
}