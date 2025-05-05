using MinaTolEntidades;
using MinaTolEntidades.Dto_Rfid;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
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
        public ModelResponse SearchRfid(string rfid)
        {
            var response = new ModelResponse();
            try
            {
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@rfid", rfid)
                };

                // Usando ExecuteScalar para obtener un solo valor (1 o 0)
                int result = (int)ExecuteScalar("SearchRfid", CommandType.StoredProcedure, parameters);

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

        // Método auxiliar ExecuteScalar (deberías tenerlo en tu DbWrapper)
        private object ExecuteScalar(string commandText, CommandType commandType, IEnumerable<SqlParameter> parameters = null)
        {
            using (var connection = new SqlConnection(SQLConnectionString))
            {
                using (var command = new SqlCommand(commandText, connection))
                {
                    command.CommandType = commandType;

                    if (parameters != null)
                    {
                        command.Parameters.AddRange(parameters.ToArray());
                    }

                    connection.Open();
                    return command.ExecuteScalar();
                }
            }
        }
        public ModelResponse SaveOrUpdateRfid(Rfid tv)

        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(tv);
                var result = GetObject("SaveOrUpdateRfid", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Rfid>((reader) =>
                    {
                        var r = FillEntity<Rfid>(reader);
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
        public ModelResponse GetAllRfid()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllRfid", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Rfid>((reader) =>
                    {
                        var r = FillEntity<Rfid>(reader);
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

        public ModelResponse GetRfidById(int id)
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

                var result = GetObject("GetRfidById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Rfid>((reader) =>
                    {
                        var r = FillEntity<Rfid>(reader);
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
        public ModelResponse DeleteRfid(int id)
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

                var result = ExecuteNonQuery("DeleteRfid", System.Data.CommandType.StoredProcedure, parameters);
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