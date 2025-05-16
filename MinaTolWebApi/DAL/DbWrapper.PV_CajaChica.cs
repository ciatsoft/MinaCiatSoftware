using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades;
using MinaTolEntidades.DtoSucursales;
using MinaTolWebApi.Controllers;
using System.Drawing;
using System.Data;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdatePV_CajaChica(PV_CajaChica tv)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new SqlParameter[]
                {
            new SqlParameter("@Id", tv.Id),
            new SqlParameter("@Monto", tv.Monto),
            new SqlParameter("@Comentario", tv.Comentarios ?? (object)DBNull.Value),
            new SqlParameter("@Estatus", tv.Estatus),
            new SqlParameter("@CreatedBy", tv.CreatedBy ?? (object)DBNull.Value),
            new SqlParameter("@CreatedDT", tv.CreatedDt),
            new SqlParameter("@UpdateBy", tv.UpdatedBy ?? (object)DBNull.Value),
            new SqlParameter("@UpdateDT", tv.UpdatedDt) 
                };

                var result = GetObject("SaveOrUpdatePV_CajaChica", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_CajaChica>((reader) =>
                    {
                        var r = FillEntity<PV_CajaChica>(reader);
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
        public ModelResponse GetAllPV_CajaChica()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPV_CajaChica", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_CajaChica>((reader) =>
                    {
                        var r = FillEntity<PV_CajaChica>(reader);
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

        public ModelResponse GetPV_CajaChicaById(int id)
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

                var result = GetObject("GetPV_CajaChicaById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_CajaChica>((reader) =>
                    {
                        var r = FillEntity<PV_CajaChica>(reader);
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
        public ModelResponse DeletePV_CajaChica(int id)
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

                var result = ExecuteNonQuery("DeletePV_CajaChica", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        //Obtener Caja Chica por Usuario y Fecha
        public ModelResponse SearchPV_VajaChicaByDateAndUser(string userName, DateTime fecha)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var fechaSolo = fecha.Date;

                var parameters = new List<SqlParameter>
        {
            new SqlParameter("@UserName", SqlDbType.NVarChar, 100) { Value = userName },
            new SqlParameter("@Fecha",    SqlDbType.Date)          { Value = fechaSolo }
        };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "SearchPV_VajaChicaByDateAndUser",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<PV_CajaChica>(reader)
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
    }
}