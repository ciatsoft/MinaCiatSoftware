using MinaTolEntidades.Security;
using MinaTolEntidades;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using MinaTolEntidades.DtoEmpleados;

namespace MinaToMVC.DAL
{
	public partial class HttpClientConnection
	{
		public async Task<ModelResponse> GetAllDocumentos()
		{

			var result = await RequestAsync<object>("api/Documento/List", HttpMethod.Get, null,
				new Func<string, string>((responseString) =>
				{
					return responseString;
				}), token.Token.access_token);

			var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

			return modelResponse;
		}
		public async Task<ModelResponse> SaveOrUpdateDocumento(Documentos ar)
		{
			MappingColumSecurity(ar);
			var result = await RequestAsync<object>("api/Documento/", HttpMethod.Post, ar,
			new Func<string, string>((responseString) =>
			{
				return responseString;
			}), token.Token.access_token);
			var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
			return modelResponse;
		}
		public async Task<ModelResponse> GetDocumentoById(long id)
		{
			var result = await RequestAsync<object>($"api/Documento/{id}", HttpMethod.Get, null,
			new Func<string, string>((responseString) =>
			{
				return responseString;
			}), token.Token.access_token);
			var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

			return modelResponse;

		}
		public async Task<ModelResponse> DeleteDocumentoById(long id)
		{
			var result = await RequestAsync<object>($"api/Documento/{id}", HttpMethod.Delete, null,
			new Func<string, string>((responseString) =>
			{
				return responseString;
			}), token.Token.access_token);
			var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

			return modelResponse;

		}

        // Documentos del Empleado
        public async Task<ModelResponse> GetAllDocumentosEmpleadoByIdTrabajador(long id)
        {
            var result = await RequestAsync<object>($"api/Documento/DocumentosEmpleado/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
    }
}