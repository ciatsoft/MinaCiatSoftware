using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
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
                            ClienteID = new ClientePublicoGral
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
                            ClienteID = new ClientePublicoGral
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

        public ModelResponse GetUbicacionesByMaterial(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                // Agregar el parámetro requerido
                parameters.Add(new SqlParameter("@Id", id));

                var result = GetObjects("GetUbicacionesByMaterial", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, UbicacionesMaterial>((reader) =>
                    {
                        var r = FillEntity<UbicacionesMaterial>(reader);
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

        public ModelResponse ProcesarCanjeo(Dictionary<string, object> parametros)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var sqlParameters = parametros.Select(param =>
                    new SqlParameter($"@{param.Key}", param.Value ?? DBNull.Value)
                ).ToArray();

                var result = ExecuteScalar("CanjeoValePrepago", CommandType.StoredProcedure, sqlParameters);

                modelResponse.IsSuccess = true;
                modelResponse.Response = result;
            }
            catch (SqlException ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Message = $"Error SQL: {ex.Message}";
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = $"Error general: {ex.Message}";
            }

            return modelResponse;
        }
    }
}
