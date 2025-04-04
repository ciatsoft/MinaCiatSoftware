using MinaTolEntidades.Security;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllDireccionCliente()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var result = GetObjects($"GetAll", CommandType.Text,parameters,
                    new Func<IDataReader, DtoAreaTrabajo>((reader) =>
                    {
                        var r = FillEntity<DtoAreaTrabajo>(reader);

                        return r;
                    }));

                modelResponse.Response = result;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse SaveOrUpdateDireccionCliente(DireccionCliente at)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(at);
                var DireccionClienteId = ExecuteScalar($"SaveOrUpdateDireccionCliente",System.Data.CommandType.StoredProcedure, parameters);
                at.Id = Convert.ToInt64(DireccionClienteId);

                response.Response = at;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse GetDireccionClienteById(int id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = id,
                    IsNullable = true,
                    ParameterName = "@Id",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = GetObject("GetDireccionClienteById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DireccionCliente>((reader) =>
                    {
                        var r = FillEntity<DireccionCliente>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse DeleteDireccionCliente(int id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = id,
                    IsNullable = true,
                    ParameterName = "@Id",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = ExecuteNonQuery("DeleteDireccionCliente", System.Data.CommandType.StoredProcedure, parameters);

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
    }
}