using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
using MinaTolEntidades.DtoViajes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {

        public async Task<ModelResponse> SaveOrUpdatePV_Venta(PV_Ventas venta)
        {
            MappingColumSecurity(venta);
            var result = await RequestAsync<object>("api/PV_Venta", HttpMethod.Post, venta,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetAllPV_Ventas()
        {
            var result = await RequestAsync<object>("api/PV_Venta/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> ActualizarEstatusVenta(int id, string valor)
        {
            var url = $"api/PV_Venta/EstatusVenta/{id}/{valor}";
            var result = await RequestAsync<object>(url, HttpMethod.Post, null, new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> UpdateCarga(int id)
        {
            var url = $"api/PV_Venta/Cargar/{id}";
            var result = await RequestAsync<object>(url, HttpMethod.Post, null, new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> SearchPV_VentasByDateAndUser(int usuarioId, DateTime fecha)
        {
            // Correct URL with proper query parameter separation
            string url = $"api/PV_Venta/search?usuarioId={usuarioId}&fecha={fecha.ToString("yyyy-MM-dd")}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> SearchPV_VentasByDate(DateTime fecha)
        {
            // Correct URL with proper query parameter separation
            string url = $"api/PV_Venta/searchDate?fecha={fecha.ToString("yyyy-MM-dd")}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> SearchDeduccionesByDate(DateTime fechaDeducciones)
        {
            // Armar la URL con parametros de consulta correctamente
            string url = $"api/PV_Venta/searchDeducciones?fechaDeducciones={fechaDeducciones.ToString("yyyy-MM-dd")}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((resposeString) =>
                {
                    return resposeString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> TotalPlantaByFecha(DateTime fecha)
        {
            // Armar la URL con parametros de consulta correctamente
            string url = $"api/PV_Venta/totalPlanta?fecha={fecha.ToString("yyyy-MM-dd")}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((resposeString) =>
                {
                    return resposeString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> TotalPlantaByFecha2(DateTime fecha2, DateTime fecha3)
        {
            // Armar la URL con parametros de consulta correctamente
            string url = $"api/PV_Venta/totalPlanta2?fecha2={fecha2.ToString("yyyy-MM-dd")}&fecha3={fecha3.ToString("yyyy-MM-dd")}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((resposeString) =>
                {
                    return resposeString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> SearchClienteByRFID(string rfid)
        {
            var url = $"api/PV_Venta/RFID/{rfid}";
            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> GetVehiculosPublicoGralByIdCliente(long id)
        {
            // Armar la URL con parámetros de consulta correctamente
            string url = $"api/PV_Venta/VehiculosCliente/{id}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        // --------------------Parcial para generar Gastos / Deducciones--------------------------------
        public async Task<ModelResponse> GetAllDeducciones()
        {
            var result = await RequestAsync<object>("api/PV_Venta/Deducciones/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> SaveOrUpdateDeducciones(Deducciones tmu)
        {
            MappingColumSecurity(tmu);
            var result = await RequestAsync<object>("api/PV_Venta/Deducciones", HttpMethod.Post, tmu,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> DeleteDeducciones(long deduccionId)
        {
            var result = await RequestAsync($"api/PV_Venta/Deducciones/{deduccionId}", HttpMethod.Post, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }

        public async Task<ModelResponse> GetDeduccionesById(long id)
        {
            // Armar la URL con parámetros de consulta correctamente
            string url = $"api/PV_Venta/Deducciones/{id}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }

        public async Task<ModelResponse> SearchDeduccionesByDateAndUser(string userName, DateTime fecha)
        {
            // Armar la URL con parametros de consulta correctamente
            string url = $"api/PV_Venta/Deducciones/DeduccionesByUserAndDate?userName={userName}&fecha={fecha:yyyy-MM-dd}";

            var result = await RequestAsync<object>(url, HttpMethod.Get, null,
                new Func<string, string>((resposeString) =>
                {
                    return resposeString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
            return modelResponse;
        }
    }
}