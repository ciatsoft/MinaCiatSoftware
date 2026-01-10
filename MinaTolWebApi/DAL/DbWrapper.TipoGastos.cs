using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using System.Data;

namespace MinaTolWebApi.DAL
{
    partial class DbWrapper
    {
        public ModelResponse GetAllTipoGastos()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();

                var result = GetObjects("GetAllTipoGastos", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoTipoGasto>((reader) =>
                    {
                        var r = FillEntity<DtoTipoGasto>(reader);
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

        public ModelResponse GetTipoGastosById(int id)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
        {
            new SqlParameter
            {
                Value = id,
                ParameterName = "@Id",
                SqlDbType = SqlDbType.Int
            }
        };

                var result = GetObject("GetTipoGastosById", CommandType.StoredProcedure,
                    parameters, reader => FillEntity<DtoTipoGasto>(reader));

                response.IsSuccess = true;
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


        public ModelResponse SaveOrUpdateTipoGastos(DtoTipoGasto u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateTipoGastos", CommandType.StoredProcedure, GenerateSQLParameters(u));
                u.Id = Convert.ToInt64(userID);

                modelResponse.Response = u;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse DeleteTipoGastos(long id)
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

                var result = ExecuteNonQuery("DeleteTipoGastos", System.Data.CommandType.StoredProcedure, parameters);
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