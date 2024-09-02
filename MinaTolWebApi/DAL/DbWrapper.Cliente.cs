using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdateCliente (Cliente c)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(c);
                var result = GetObject("SaveOrUpdateCliente", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Cliente>((reader) =>
                    {
                        var r = FillEntity<Cliente>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch(Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse GetAllCliente()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllCliente", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Cliente>((reader) =>
                    {
                        var r = FillEntity<Cliente>(reader);
                        return r;
                    }));
                response.Response = result;
            }
            catch(Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
         public ModelResponse GetClienteById (int id )
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

                var result = GetObject("GetClienteById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Cliente>((reader) =>
                    {
                        var r = FillEntity<Cliente>(reader);
                        return r;
                    }));
                response.Response = result;
            }
            catch(Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
    }
}