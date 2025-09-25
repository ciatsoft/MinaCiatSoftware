using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.DtoEmpleados;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection
    {
        public async Task<ModelResponse> SaveOrupdateEmpleado(Empleado t)
        {
            var result = await RequestAsync<object>("api/Trabajador", HttpMethod.Post, t,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetAllEmpleados()
        {
            var result = await RequestAsync<object>("api/Trabajador/List", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> GetTrabajadorById(long id)
        {
            var result = await RequestAsync<object>($"api/Trabajador/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> DeleteEmpleadoById(long Id)
        {
            var result = await RequestAsync($"api/Trabajador/{Id}", HttpMethod.Delete, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }

        public async Task<ModelResponse> GetSalarioByTrabajador(long id)
        {
            var result = await RequestAsync<object>($"api/Trabajador/Salario/Trabajador/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        public async Task<ModelResponse> SaveOrUpdateSalario(DtoSalario s)
        {
            var result = await RequestAsync<object>("api/Trabajador/Salario", HttpMethod.Post, s,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }

        #region ConceptosEmpleados
        public async Task<ModelResponse> SaveOrUpdateConceptosEmpleados(ConceptosEmpleado ce)
        {
            var result = await RequestAsync<object>("api/Trabajador/ConceptosEmpleados", HttpMethod.Post, ce,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> GetAllConceptosEmpleados()
        {
            var result = await RequestAsync<object>("api/Trabajador/ConceptosEmpleados/List", HttpMethod.Get, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);

            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> GetConceptosEmpleadosById(long id)
        {
            var result = await RequestAsync<object>($"api/Trabajador/ConceptosEmpleados/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }

        public async Task<ModelResponse> DeleteConceptosEmpleadosById(long Id)
        {
            var result = await RequestAsync($"api/Trabajador/ConceptosEmpleados/{Id}", HttpMethod.Delete, null,
                new Func<string, string>((responseString) =>
                {
                    return responseString;
                }), token.Token.access_token);
            return Newtonsoft.Json.JsonConvert.DeserializeObject<ModelResponse>(result.ToString());
        }
        #endregion

        #region ConceptoEmpleadoByIdEmpleado
        public async Task<ModelResponse> GetAllConceptoEmpleadoByIdEmpleado(long id)
        {
            var result = await RequestAsync<object>($"api/Trabajador/GetAllConceptoEmpleadoByIdEmpleado/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> GetSalarioActivoByIdEmpleado(long id)
        {
            var result = await RequestAsync<object>($"api/Trabajador/GetSalarioActivoByIdEmpleado/{id}", HttpMethod.Get, null,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }), token.Token.access_token);
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;

        }
        public async Task<ModelResponse> SaveOrUpdateConceptoEmpleadoByIdEmpleado(ConceptoEmpleado ce)
        {
            var result = await RequestAsync<object>("api/Trabajador/SaveOrUpdateConceptoEmpleadoByIdEmpleado", HttpMethod.Post, ce,
            new Func<string, string>((responseString) =>
            {
                return responseString;
            }));
            var modelResponse = JsonConvert.DeserializeObject<ModelResponse>(result.ToString());

            return modelResponse;
        }
        public async Task<ModelResponse> DeleteConceptoEmpleadoById(long id)
        {
            var result = await RequestAsync<object>($"api/Trabajador/DeleteConceptoEmpleadoById/{id}", HttpMethod.Post, null,
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