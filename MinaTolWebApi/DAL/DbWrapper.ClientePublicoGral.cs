using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades;
using System.Data.SqlClient;

namespace MinaTolWebApi.DAL
{
    partial class DbWrapper
    {
        public ModelResponse SaveOrUpdateClientePublicoGral(ClientePublicoGral c)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(c);
                var result = GetObject("SaveOrUpdateClientePublicoGral", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ClientePublicoGral>((reader) =>
                    {
                        var r = FillEntity<ClientePublicoGral>(reader);
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

        public ModelResponse GetAllClientePublicoGral()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllClientePublicoGral", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ClientePublicoGral>((reader) =>
                    {
                        var r = FillEntity<ClientePublicoGral>(reader);
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

        public ModelResponse GetClientePublicoGralById(long id)
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

                var result = GetObject("GetClientePublicoGralById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ClientePublicoGral>((reader) =>
                    {
                        var r = FillEntity<ClientePublicoGral>(reader);
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

        public ModelResponse DeleteClientePublicoGral(long id)
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

                var result = ExecuteNonQuery("DeleteClientePublicoGral", System.Data.CommandType.StoredProcedure, parameters);
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