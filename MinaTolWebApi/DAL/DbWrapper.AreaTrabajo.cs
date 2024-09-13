using MinaTolEntidades.Security;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllAreaTrabajo()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var result = GetObjects($"GetAllAreaTrabajo", CommandType.Text,parameters,
                    new Func<IDataReader, DtoAreaTrabajo>((reader) =>
                    {
                        var r = FillEntity<DtoAreaTrabajo>(reader);

                        return r;
                    }));

                modelResponse.Response = result;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse SaveOrUpdateAreaTrabajo(DtoAreaTrabajo at)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(at);
                var areatrabajoId = ExecuteScalar($"SaveOrUpdateAreaTrabajo",System.Data.CommandType.StoredProcedure, parameters);
                at.Id = Convert.ToInt64(areatrabajoId);

                response.Response = at;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse GetAreaTrabajoById(long id)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@Id",id));
            try
            {

                var result = GetObjects("GetAreaTrabajoById", CommandType.StoredProcedure, parameters,
                     new Func<IDataReader, DtoAreaTrabajo>((reader) =>
                     {
                         var r = FillEntity<DtoAreaTrabajo>(reader);

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
    }
}