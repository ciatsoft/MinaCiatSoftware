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

        public async Task<ModelResponse> SaveOrUpdateReporte_Venta(Reporte_Venta r)
        {
            MappingColumSecurity(r);
            var result = await RequestAsync<object>("api/ReporteVenta", HttpMethod.Post, r,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetAllReporte_Ventas()
        {
            var result = await RequestAsync<object>("api/ReporteVenta/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }


    }
}