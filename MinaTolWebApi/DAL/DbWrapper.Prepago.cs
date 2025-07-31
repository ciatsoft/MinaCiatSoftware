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
    partial class DbWrapper
    {
        public ModelResponse SaveOrUpdatePrepago(Prepago p)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", p.Id),
                    new SqlParameter("@Folio", p.Folio),
                    new SqlParameter("@NoVale", p.NoVale),
                    new SqlParameter("@RFID", p.RFID),
                    new SqlParameter("@IdCliente", p.IdCliente),
                    new SqlParameter("@NombreCliente", p.NombreCliente),
                    new SqlParameter("@ImporteVenta", p.ImporteVenta),
                    new SqlParameter("@Fecha", p.Fecha),
                    new SqlParameter("@Estatus", p.Estatus),
                    new SqlParameter("@CreatedBy", p.CreatedBy),
                    new SqlParameter("@CreatedDt", p.CreatedDt),
                    new SqlParameter("@UpdatedBy", p.UpdatedBy),
                    new SqlParameter("@UpdatedDt", p.UpdatedDt),
                };

                var result = ExecuteScalar("SaveOrUpdatePrepago", CommandType.StoredProcedure, parameters);
                p.Id = Convert.ToInt64(result);

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
    }
}