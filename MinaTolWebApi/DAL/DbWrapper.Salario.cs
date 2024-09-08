using MinaTolEntidades.Security;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using MinaTolEntidades.DtoEmpleados;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetSalarioByTrabajador(long trabajadaorId)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@TrabajadorId", trabajadaorId));

            try
            {
                var user = GetObjects($"GetSalarioByTrabajador", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoSalario>((reader) =>
                    {
                        var r = FillEntity<DtoSalario>(reader);

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
        public ModelResponse SaveOrUpdateSalario(DtoSalario s)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var salarioId = ExecuteScalar($"SaveOrUpdateSalario", CommandType.StoredProcedure, GenerateSQLParameters(s));
                s.Id = Convert.ToInt64(salarioId);

                modelResponse.Response = s;
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