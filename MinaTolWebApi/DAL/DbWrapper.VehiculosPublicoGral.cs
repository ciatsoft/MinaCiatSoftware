using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades;
using System.Data.SqlClient;
using System.Data;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdateVehiculosPublicoGral(DtoClientesVehiculoPublicoGral u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateVehiculosPublicoGral", CommandType.StoredProcedure, GenerateSQLParameters(u));
                u.Id = Convert.ToInt64(userID);

                modelResponse.Response = u;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse GetAllVehiculosPublicoGral()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();

                var result = GetObjects("GetAllVehiculosPublicoGral", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoClientesVehiculoPublicoGral>((reader) =>
                    {

                        var vehiculoPublicoGral = new DtoClientesVehiculoPublicoGral
                        {
                            Id = reader.GetInt64(reader.GetOrdinal("Id")),
                            Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
                            Capacidad = reader.GetInt32(reader.GetOrdinal("Capacidad")),
                            ClienteID = new Cliente
                            {
                                Id = reader.GetInt64(reader.GetOrdinal("ClienteId")),
                                Nombre = reader.GetString(reader.GetOrdinal("NombreCliente"))
                            },
                            Color = reader.GetString(reader.GetOrdinal("Color")),
                            Placa = reader.GetString(reader.GetOrdinal("Placa")),
                        };

                        return vehiculoPublicoGral;
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

        public ModelResponse GetVehiculosPublicoGralById(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", SqlDbType.BigInt) { Value = id },
                };

                var result = GetList(
                    "GetVehiculosPublicoGralById",
                    CommandType.StoredProcedure,
                    parameters,
                    reader =>
                    {
                        return new DtoClientesVehiculoPublicoGral
                        {
                            Id = reader.GetInt64(reader.GetOrdinal("Id")),
                            ClienteID = new Cliente
                            {
                                Id = reader.GetInt64(reader.GetOrdinal("ClienteID"))
                                // Puedes mapear más propiedades si tu SP las retorna
                            },
                            Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
                            Capacidad = reader.GetInt32(reader.GetOrdinal("Capacidad")),
                            Color = reader.GetString(reader.GetOrdinal("Color")),
                            Placa = reader.GetString(reader.GetOrdinal("Placa"))
                        };
                    }
                );

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

        public ModelResponse DeleteVehiculosPublicoGral(long id)
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

                var result = ExecuteNonQuery("DeleteVehiculosPublicoGral", System.Data.CommandType.StoredProcedure, parameters);
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
