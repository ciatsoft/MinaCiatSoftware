using MinaTolEntidades;
using MinaTolEntidades.DtoSucursales;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdateUnidadMedida(UnidadMedida u)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(u);
                var result = GetObject("SaveOrUpdateUnidadMedida", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, UnidadMedida>((reader) =>
                    {
                        var r = FillEntity<UnidadMedida>(reader);
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

        public ModelResponse GetAllUnidadMedida()
        {
            var response = new ModelResponse();

            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllUnidadMedida", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, UnidadMedida>((reader) =>
                    {
                        var r = FillEntity<UnidadMedida>(reader);
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

        public ModelResponse GetUnidadMedidaById(long id)
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

                var result = GetObject("GetUnidadMedidaById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, UnidadMedida>((reader) =>
                    {
                        var r = FillEntity<UnidadMedida>(reader);
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