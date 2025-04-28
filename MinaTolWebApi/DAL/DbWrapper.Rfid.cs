using MinaTolEntidades;
using MinaTolEntidades.Dto_Rfid;
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
    }
}