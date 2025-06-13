using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.Security;
using System.Data;
using MinaTolEntidades.DtoClientes;

namespace MinaTolWebApi.DAL
{
    partial class DbWrapper
    {
        public ModelResponse GetAllPrestamos()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();

                var result = GetObjects("GetAllPrestamos", CommandType.StoredProcedure,
                    parameters, new Func<IDataReader, DtoCatalogoPrestamo>((reader) =>
                    {
                        var prestamo = new DtoCatalogoPrestamo
                        {
                            Id = reader.GetInt64(reader.GetOrdinal("Id")),
                            Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
                            Descripcion = reader.GetString(reader.GetOrdinal("Descripcion")),
                            Monto = reader.GetDecimal(reader.GetOrdinal("Monto")),
                            Fecha = reader.GetDateTime(reader.GetOrdinal("Fecha")),
                            UsuarioName = reader.GetString(reader.GetOrdinal("UsuarioName")),
                            IdTrabajador = new DtoTrabajador
                            {
                                Id = reader.GetInt64(reader.GetOrdinal("IdTrabajador")),
                                Nombre = reader.GetString(reader.GetOrdinal("NombreTrabajador"))
                                // Agrega más campos de DtoTrabajador si tu SP los devuelve
                            },
                        };

                        return prestamo;
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

        public ModelResponse GetPrestamosById(int id)
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
                    "GetPrestamosById",
                    CommandType.StoredProcedure,
                    parameters,
                    reader =>
                    {
                        return new DtoCatalogoPrestamo
                        {
                            Id = reader.GetInt64(reader.GetOrdinal("Id")),
                            IdTrabajador = new DtoTrabajador
                            {
                                Id = reader.GetInt64(reader.GetOrdinal("IdTrabajador"))
                                // Puedes mapear más propiedades si tu SP las retorna
                            },
                            Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
                            Descripcion = reader.GetString(reader.GetOrdinal("Descripcion")),
                            Monto = reader.GetDecimal(reader.GetOrdinal("Monto")),
                            Fecha = reader.GetDateTime(reader.GetOrdinal("Fecha")),
                            UsuarioName = reader.GetString(reader.GetOrdinal("UsuarioName"))
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

        public ModelResponse SaveOrUpdatePrestamos(DtoCatalogoPrestamo u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdatePrestamos", CommandType.StoredProcedure, GenerateSQLParameters(u));
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

        public ModelResponse DeletePrestamos(int id)
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

                var result = ExecuteNonQuery("DeletePrestamos", System.Data.CommandType.StoredProcedure, parameters);
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