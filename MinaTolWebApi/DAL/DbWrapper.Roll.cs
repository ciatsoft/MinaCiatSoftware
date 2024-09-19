using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
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
        public ModelResponse GetAllRoll()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllRoll", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoRoles>((reader) =>
                    {
                        var r = FillEntity<DtoRoles>(reader);
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

        public ModelResponse SaveOrUpdateRoll(DtoRoles t)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(t);
                var result = GetObject("SaveOrUpdateRoll", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoRoles>((reader) =>
                    {
                        var r = FillEntity<DtoRoles>(reader);
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