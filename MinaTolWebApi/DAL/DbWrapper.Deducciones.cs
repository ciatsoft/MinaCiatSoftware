using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using System.Data;

namespace MinaTolWebApi.DAL
{
    partial class DbWrapper
    {
        public ModelResponse GetAllDeducciones()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();

                var result = GetObjects("GetAllDeducciones", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Deducciones>((reader) =>
                    {
                        var r = FillEntity<Deducciones>(reader);
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

        public ModelResponse SaveOrUpdateDeducciones(Deducciones u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateDeducciones", CommandType.StoredProcedure, GenerateSQLParameters(u));
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

        public ModelResponse DeleteDeducciones(long id)
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

                var result = ExecuteNonQuery("DeleteDeducciones", System.Data.CommandType.StoredProcedure, parameters);
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