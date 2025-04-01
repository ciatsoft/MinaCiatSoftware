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
        public ModelResponse SaveOrUpdateVehiculo(Vehiculo v)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(v);
                var result = GetObject("SaveOrUpdateVehiculo", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Vehiculo>((reader) =>
                    {
                        var r = FillEntity<Vehiculo>(reader);
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
         public ModelResponse GetAllVehiculo ()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllVehiculo", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Vehiculo>((reader) =>
                    {
                        var r = FillEntity<Vehiculo>(reader);

                        r.TipoVehiculo.Nombre = MappingProperties<string>(reader["TipoVehiculoNombre"]);
                        

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
         public ModelResponse GetVehiculoById (int id)
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

                var result = GetObject("GetVehiculoById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Vehiculo>((reader) =>
                    {
                        var r = FillEntity<Vehiculo>(reader);
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