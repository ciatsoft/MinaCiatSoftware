using MinaTolEntidades;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.DtoVentaPublicoGeneral;
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
        public ModelResponse SaveOrUpdateReporte_Venta(Reporte_Venta r)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", r.Id),
                    new SqlParameter("@UsuarioId", r.UsuarioId),
                    new SqlParameter("@UsuarioName", r.UsuarioName),
                    new SqlParameter("@Fecha", DateTime.Now),
                    new SqlParameter("@FechaFiltro", r.FechaFiltro),
                    new SqlParameter("@Estatus", r.Estatus),
                    new SqlParameter("@CreatedBy", r.CreatedBy),
                    new SqlParameter("@CreatedDt", DateTime.Now),
                    new SqlParameter("@UpdatedBy", r.UpdatedBy),
                    new SqlParameter("@UpdatedDt", DateTime.Now)
                };

                var result = ExecuteScalar("SaveOrUpdateReporte_Venta", CommandType.StoredProcedure, parameters);
                r.Id = Convert.ToInt64(result);

                response.IsSuccess = true;
                response.Response = result;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"Error inesperado: {ex.Message}";
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }

        public ModelResponse GetAllReporte_Ventas()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllReporte_Ventas", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Reporte_Venta>((reader) =>
                    {
                        var r = FillEntity<Reporte_Venta>(reader);
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

        public ModelResponse GetReporte_VentaById(int id)
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

                var result = GetObject("GetReporte_VentaById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Reporte_Venta>((reader) =>
                    {
                        var r = FillEntity<Reporte_Venta>(reader);
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