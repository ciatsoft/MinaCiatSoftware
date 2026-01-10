using MinaTolEntidades;
using MinaTolEntidades.DtoEmpleados;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        #region BajasEmpleado
        public ModelResponse SaveOrUpdateBajasEmpleado(DtoBajasEmpleado u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateBajasEmpleado", CommandType.StoredProcedure, GenerateSQLParameters(u));
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

        public ModelResponse GetAllBajasEmpleado()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllBajasEmpleado", CommandType.StoredProcedure,
                    parameters, new Func<IDataReader, DtoBajasEmpleado>((reader) =>
                    {
                        var r = FillEntity<DtoBajasEmpleado>(reader);
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

        public ModelResponse GetBajasEmpleadoById(long id)
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
                        ParameterName = "@Id",
                        SqlDbType = SqlDbType.Int
                    }
                };

                var result = GetObject("GetBajasEmpleadoById", CommandType.StoredProcedure,
                    parameters, new Func<IDataReader, DtoBajasEmpleado>((reader) =>
                    {
                        var r = FillEntity<DtoBajasEmpleado>(reader);
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

        public ModelResponse DeleteBajasEmpleadoById(long id)
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
                        ParameterName = "@IdTrabajador"
                    }
                };

                var result = ExecuteNonQuery("DeleteBajasEmpleadoById", CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }
        #endregion
    }
}
