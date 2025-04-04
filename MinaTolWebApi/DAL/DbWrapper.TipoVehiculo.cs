using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdateTipoVehiculo(TipoVehiculo tv)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(tv);
                var result = GetObject("SaveOrUpdateTipoVehiculo", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, TipoVehiculo>((reader) =>
                    {
                        var r = FillEntity<TipoVehiculo>(reader);
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
        public ModelResponse GetAllTipoVehiculo()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllTipoVehiculo", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, TipoVehiculo>((reader) =>
                    {
                        var r = FillEntity<TipoVehiculo>(reader);
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
        public ModelResponse GetTipoDeVehiculoById (long id)
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

                var result = GetObject("GetTipoDeVehiculoById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, TipoVehiculo>((reader) =>
                    {
                        var r = FillEntity<TipoVehiculo>(reader);
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
        public ModelResponse DeleteTipoVehiculo(long id)
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

                var result = ExecuteNonQuery("DeleteTipoVehiculo", System.Data.CommandType.StoredProcedure, parameters);
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