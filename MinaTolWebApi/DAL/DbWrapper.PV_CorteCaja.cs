using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using System.Data;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdatePV_CorteCaja(PV_CorteCaja tv)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", tv.Id),
                    new SqlParameter("@VentaVale", tv.VentaVale),
                    new SqlParameter("@VentaTransferencia", tv.VentaTransferencia),
                    new SqlParameter("@VentaEfectivo", tv.VentaEfectivo),
                    new SqlParameter("@MontoTotal", tv.MontoTotal),
                    new SqlParameter("@Ingreso", tv.Ingreso),
                    new SqlParameter("@Egreso", tv.Egreso),
                    new SqlParameter("@TotalUtilidad", tv.TotalUtilidad),
                    new SqlParameter("@UsuarioName", tv.UsuarioName ?? (object)DBNull.Value),
                    new SqlParameter("@Comentario", tv.Comentarios),
                    new SqlParameter("@B1000", tv.B1000),
                    new SqlParameter("@B500", tv.B500),
                    new SqlParameter("@B200", tv.B200),
                    new SqlParameter("@B100", tv.B100),
                    new SqlParameter("@B50", tv.B50),
                    new SqlParameter("@B20", tv.B20),
                    new SqlParameter("@M10", tv.M10),
                    new SqlParameter("@M5", tv.M5),
                    new SqlParameter("@M2", tv.M2),
                    new SqlParameter("@M1", tv.M1),
                    new SqlParameter("@M050", tv.M050),
                    new SqlParameter("@Estatus", 1),
                    new SqlParameter("@CreatedBy", tv.CreatedBy),
                    new SqlParameter("@CreatedDT", DateTime.Now),
                    new SqlParameter("@UpdateBy", tv.UpdatedBy),
                    new SqlParameter("@UpdateDT", DateTime.Now)
                };

                var result = GetObject("SaveOrUpdatePV_CorteCaja", CommandType.StoredProcedure,
                    parameters.ToArray(), reader =>
                    {
                        var r = FillEntity<PV_CorteCaja>(reader);
                        return r;
                    });

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

        public ModelResponse GetAllPV_CorteCaja()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPV_CorteCaja", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_CorteCaja>((reader) =>
                    {
                        var r = FillEntity<PV_CorteCaja>(reader);
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

        public ModelResponse GetPV_CorteCajaById(int id)
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

                var result = GetObject("GetPV_CorteCajaById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_CorteCaja>((reader) =>
                    {
                        var r = FillEntity<PV_CorteCaja>(reader);
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
        public ModelResponse DeletePV_CorteCaja(int id)
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

                var result = ExecuteNonQuery("DeletePV_CorteCaja", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        //Obtener Dinero en Caja por Usuario y Fecha
        public ModelResponse SearchPV_DineroCajaByDateAndUser(string userName, DateTime fecha)
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
                    "SearchPV_DineroCajaByDateAndUser",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<PV_CorteCaja>(reader)
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