using MinaTolEntidades.Security;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoVentas;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetDireccionesCliente(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@ClienteId", SqlDbType.BigInt) { Value = id },
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "GetDireccionesCliente",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<DireccionCliente>(reader)
                );

                response.Response = result; // ahora será una lista de PV_CajaChica
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse SaveOrUpdateDireccionCliente(DireccionCliente at)
        {
            var response = new ModelResponse();

            try
            {
                response.IsSuccess = true;

                // Generar los parámetros esperados por el SP
                var parameters = new SqlParameter[]
                {
                    new SqlParameter("@Id", at.Id),
                    new SqlParameter("@ClienteId", at.ClienteId),
                    new SqlParameter("@Calle", at.Calle ?? ""),
                    new SqlParameter("@Colonia", at.Colonia ?? ""),
                    new SqlParameter("@Delegacion", at.Delegacion ?? ""),
                    new SqlParameter("@Municipio", at.Municipio ?? ""),
                    new SqlParameter("@Estado", at.Estado ?? ""),
                    new SqlParameter("@CP", at.CP),
                    new SqlParameter("@NoExterno", at.NoExterno ?? ""),
                    new SqlParameter("@NoInterno", at.NoInterno ?? ""),
                    new SqlParameter("@Estatus", at.Estatus),
                    new SqlParameter("@CreatedBy", at.CreatedBy ?? ""),
                    new SqlParameter("@CreatedDt", at.CreatedDt == DateTime.MinValue ? DateTime.Now : at.CreatedDt),
                    new SqlParameter("@UpdatedBy", at.UpdatedBy ?? ""),
                    new SqlParameter("@UpdatedDt", at.UpdatedDt == DateTime.MinValue ? DateTime.Now : at.UpdatedDt)
                };

                // Ejecutar el procedimiento almacenado
                var DireccionClienteId = ExecuteScalar("SaveOrUpdateDireccionCliente", CommandType.StoredProcedure, parameters);

                // Asignar el ID retornado
                at.Id = Convert.ToInt64(DireccionClienteId);
                response.Response = at;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }

        public ModelResponse GetDireccionClienteById(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", SqlDbType.BigInt) { Value = id },
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "GetDireccionClienteById",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<DireccionCliente>(reader)
                );

                response.Response = result; // ahora será una lista de PV_CajaChica
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse ObtenerDireccionCliente(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", SqlDbType.BigInt) { Value = id },
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "ObtenerDireccionCliente",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<DireccionCliente>(reader)
                );

                response.Response = result; // ahora será una lista de PV_CajaChica
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse DeleteDireccionCliente(long id)
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

                var result = ExecuteNonQuery("DeleteDireccionCliente", System.Data.CommandType.StoredProcedure, parameters);

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