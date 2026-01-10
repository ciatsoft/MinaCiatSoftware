using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.DtoTaller;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdatePrecioCombustible(PrecioCombustible t)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(t);
                var result = ExecuteScalar($"SaveOrUpdatePrecioCombustible", System.Data.CommandType.StoredProcedure, parameters);
                t.Id = Convert.ToInt64(result);

                response.Response = t;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;

        }
        public ModelResponse GetPrecioActivoCombustible()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var user = GetObject($"GetPrecioActivoCombustible", System.Data.CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, PrecioCombustible>((reader) =>
                    {
                        var r = FillEntity<PrecioCombustible>(reader);
                        return r;
                    }));

                modelResponse.Response = user;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse GetAllPrecioCombustible()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var user = GetObjects($"GetAllPrecioCombustible", System.Data.CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, PrecioCombustible>((reader) =>
                    {
                        var r = FillEntity<PrecioCombustible>(reader);
                        return r;
                    }));

                modelResponse.Response = user;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse GetPrecioCombustibleById(long id)
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

                var result = GetObject("GetPrecioCombustibleById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PrecioCombustible>((reader) =>
                    {
                        var r = FillEntity<PrecioCombustible>(reader);
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
        public ModelResponse DeletePrecioCombustibleById(long id)
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
                    ParameterName = "@Id"
                });

                var result = ExecuteNonQuery("DeletePrecioCombustibleById", System.Data.CommandType.StoredProcedure, parameters);
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