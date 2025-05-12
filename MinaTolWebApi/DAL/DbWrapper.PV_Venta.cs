using MinaTolEntidades;
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
        public ModelResponse SaveOrUpdatePV_Venta(PV_Ventas v)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", v.Id),
                    new SqlParameter("@Folio", v.Folio),
                    new SqlParameter("@Ubicacion", v.Ubicacion.Id),
                    new SqlParameter("@TipoMaterial", v.TipoMaterial.Id),
                    new SqlParameter("@FormaDePago", v.FormaDePago),
                    new SqlParameter("@CantidadRecibida", v.CantidadRecibida),
                    new SqlParameter("@PrecioUnidad", v.PrecioUnidad),
                    new SqlParameter("@Transporte", v.Transporte),
                    new SqlParameter("@Placa", v.Placa),
                    new SqlParameter("@Cantidad", v.Cantidad),
                    new SqlParameter("@UnidadMedida", v.UnidadMedida.Id),
                    new SqlParameter("@Usuario", v.Usuario.Id),
                    new SqlParameter("@Fecha", v.Fecha),
                    new SqlParameter("@Estatus", v.Estatus),
                    new SqlParameter("@TotalPago", v.TotalPago),
                    new SqlParameter("@CreatedBy", v.CreatedBy),
                    new SqlParameter("@CreatedDt", v.CreatedDt),
                    new SqlParameter("@UpdatedBy", v.UpdatedBy),
                    new SqlParameter("@UpdatedDt", v.UpdatedDt)
                };

                var result = ExecuteScalar("SaveOrUpdatePV_Ventas", CommandType.StoredProcedure, parameters);
                v.Id = Convert.ToInt64(result);

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

        public ModelResponse GetAllPV_Venta()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPV_Ventas", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Ventas>((reader) =>
                    {
                        var r = FillEntity<PV_Ventas>(reader);
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

        public ModelResponse GetPV_VentaById(int id)
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

                var result = GetObject("GetPV_VentaById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Precio>((reader) =>
                    {
                        var r = FillEntity<PV_Precio>(reader);
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

        public ModelResponse ActualizarEstatusVenta(int id, string valor)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                // Crear la lista de parámetros correctamente
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter()
                    {
                        ParameterName = "@Id",
                        Value = id,
                        SqlDbType = System.Data.SqlDbType.Int
                    },
                    new SqlParameter()
                    {
                        ParameterName = "@Valor",
                        Value = valor,
                        SqlDbType = System.Data.SqlDbType.NVarChar,
                        Size = 10
                    }
                };

                var result = GetObject("ActualizarVenta", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Precio>((reader) =>
                    {
                        var r = FillEntity<PV_Precio>(reader);
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