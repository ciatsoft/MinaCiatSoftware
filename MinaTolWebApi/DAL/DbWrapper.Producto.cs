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
        public ModelResponse SaveOrUpdateProducto(Producto p)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;   
                var parameters = GenerateSQLParameters(p);
                var result = GetObject("SaveOrUpdateProducto", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Producto>((reader) =>
                    {
                        var r = FillEntity<Producto>(reader);
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

        public ModelResponse  GetAllProducto()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllProducto", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Producto>((reader) =>
                    {
                        var r = FillEntity<Producto>(reader);
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

        public ModelResponse GetProductoById(int id)
        {
            var response = new ModelResponse();
            try
            {
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = id,
                    IsNullable = true,
                    ParameterName = "@Id",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = GetObject("GetProductoById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Producto>((reader) =>
                    {
                        var r = FillEntity<Producto>(reader);
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