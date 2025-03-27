using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdatePV_Material(PV_Material u)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(u);
                var result = GetObject("SaveOrUpdatePV_Material", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Material>((reader) =>
                    {
                        var r = FillEntity<PV_Material>(reader);
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

        public ModelResponse GetAllPV_Material()
        {
            var response = new ModelResponse();

            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPV_Material", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Material>((reader) =>
                    {
                        var r = FillEntity<PV_Material>(reader);
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

        public ModelResponse GetPV_Material(long id)
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

                var result = GetObject("GetPV_MaterialById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Material>((reader) =>
                    {
                        var r = FillEntity<PV_Material>(reader);
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