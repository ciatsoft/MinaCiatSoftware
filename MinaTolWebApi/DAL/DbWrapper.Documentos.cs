using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllDocumentos()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var documentos = GetObjects("GetAllDocumentos", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, Documentos>((reader) =>
                    {
                        var r = FillEntity<Documentos>(reader);
                        return r;
                    }));

                modelResponse.Response = documentos;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }
            return modelResponse;
        }
        public ModelResponse GetDocumentoById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var documento = GetObject($"SELECT * FROM DOCUMENTO WHERE Id = {id}", CommandType.Text, parameters,
                    new Func<IDataReader, Documentos>((reader) =>
                    {
                        var r = FillEntity<Documentos>(reader);
                        return r;
                    }));

                modelResponse.Response = documento;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }
            return modelResponse;
        }
        public ModelResponse SaveOrUpdateDocumento(Documentos doc)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(doc);
                var result = ExecuteScalar("SaveOrUpdateDocumento", CommandType.StoredProcedure, parameters);
                doc.Id = Convert.ToInt64(result);

                response.Response = doc;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse DeleteDocumentoById(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>
            {
                new SqlParameter()
                {
                    Value = id,
                    IsNullable = true,
                    ParameterName = "@Id"
                }
            };

                var result = ExecuteNonQuery("DeleteDocumentoById", CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse GetAllDocumentosEmpleadoByIdTrabajador(long id)
        {
            var modelResponse = new ModelResponse();

            try
            {
                // Crear el parámetro correctamente
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", id)
                };

                // Usar CommandType.StoredProcedure y NO concatenar el id al nombre
                var documentos = GetList($"GetAllDocumentosEmpleadoByIdTrabajador", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DocumentosEmpleado>((reader) =>
                    {
                        var r = FillEntity<DocumentosEmpleado>(reader);
                        return r;
                    }));

                modelResponse.Response = documentos;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }
            return modelResponse;
        }
    }
}