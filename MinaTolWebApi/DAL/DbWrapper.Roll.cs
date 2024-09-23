using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdateRoll(DtoRoll tv)

        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(tv);
                var result = GetObject("SaveOrUpdateRoll", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoRoll>((reader) =>
                    {
                        var r = FillEntity<DtoRoll>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch(Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;

            }
            return response;
        }
        public ModelResponse GetAllRoll()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllRoll", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoRoll>((reader) =>
                    {
                        var r = FillEntity<DtoRoll>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch(Exception ex )
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse GetRollById (int id)
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

                var result = GetObject("GetRollById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoRoll>((reader) =>
                    {
                        var r = FillEntity<DtoRoll>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch(Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

    }
}