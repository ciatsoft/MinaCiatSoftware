using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllHoraExtraTrabajador()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var horasExtras = GetObjects("GetAllHoraExtraTrabajador", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoHoraExtraTrabajador>((reader) =>
                    {
                        var r = FillEntity<DtoHoraExtraTrabajador>(reader);
                        return r;
                    }));

                modelResponse.Response = horasExtras;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }
            return modelResponse;
        }

        public ModelResponse GetHoraExtraTrabajadorById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var horaExtra = GetObject($"SELECT * FROM HoraExtraTrabajador WHERE Id = {id}", CommandType.Text, parameters,
                    new Func<IDataReader, DtoHoraExtraTrabajador>((reader) =>
                    {
                        var r = FillEntity<DtoHoraExtraTrabajador>(reader);
                        return r;
                    }));

                modelResponse.Response = horaExtra;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }
            return modelResponse;
        }

        public ModelResponse SaveOrUpdateHoraExtraTrabajador(DtoHoraExtraTrabajador horaExtra)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(horaExtra);
                var result = ExecuteScalar("SaveOrUpdateHoraExtraTrabajador", CommandType.StoredProcedure, parameters);
                horaExtra.Id = Convert.ToInt64(result);

                response.Response = horaExtra;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse DeleteHoraExtraTrabajadorById(long id)
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
                        ParameterName = "@Id"
                    }
                };

                var result = ExecuteNonQuery("DeleteHoraExtraTrabajadorById", CommandType.StoredProcedure, parameters);
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
