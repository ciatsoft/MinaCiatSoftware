using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoViajes;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllViajeInterno()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var user = GetObjects($"GetAllViajeInterno", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeInterno>((reader) =>
                    {
                        var r = FillEntity<DtoViajeInterno>(reader);

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

        public ModelResponse GetAllViajeLocal()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var user = GetObjects($"GetAllViajeLocal", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeLocal>((reader) =>
                    {
                        var r = FillEntity<DtoViajeLocal>(reader);

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
        public ModelResponse GetViajeInternoById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@Id", id));

            try
            {
                var user = GetObject($"GetViajeInternoById", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeInterno>((reader) =>
                    {
                        var r = FillEntity<DtoViajeInterno>(reader);

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
        public ModelResponse SaveOrUpdateViajeInterno(DtoViajeInterno vi)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var salarioId = ExecuteScalar($"SaveOrUpdateViajeInterno", CommandType.StoredProcedure, GenerateSQLParameters(vi));
                vi.Id = Convert.ToInt64(salarioId);

                modelResponse.Response = vi;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse SaveOrUpdateViajeLocal(DtoViajeLocal vi)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var salarioId = ExecuteScalar($"SaveOrUpdateViajeLocal", CommandType.StoredProcedure, GenerateSQLParameters(vi));
                vi.Id = Convert.ToInt64(salarioId);

                modelResponse.Response = vi;
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