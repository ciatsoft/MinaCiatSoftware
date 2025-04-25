
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using MinaTolEntidades.DtoCatalogos;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllMetodoPago()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllMetodoPago", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, MetodoPago>((reader) =>
                    {
                        var r = FillEntity<MetodoPago>(reader);
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
        public ModelResponse GetMetodoPagoById(long id)
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

                var result = GetObject("GetMetodoPagoById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, MetodoPago>((reader) =>
                    {
                        var r = FillEntity<MetodoPago>(reader);
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
        public ModelResponse DeleteMetodoPago(long id)
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

                var result = ExecuteNonQuery("DeleteMetodoPago", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse SaveOrUpdateMetodoPago(MetodoPago tv)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(tv);
                var result = GetObject("SaveOrUpdateMetodoPago", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, MetodoPago>((reader) =>
                    {
                        var r = FillEntity<MetodoPago>(reader);
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