using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoViajes;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetFoliadorByNombre(string Nombre)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = Nombre,
                    IsNullable = true,
                    ParameterName = "@Nombre",
                    SqlDbType = System.Data.SqlDbType.VarChar // Cambiar a VarChar
                });


                var result = GetObject("GetFoliadorByNombre", System.Data.CommandType.StoredProcedure,
                parameters, new Func<System.Data.IDataReader, DtoFoliador>((reader) =>
                {
                    var r = FillEntity<DtoFoliador>(reader);

                    // Formatear el campo Consecutivo como cadena con ceros a la izquierda
                    if (long.TryParse(r.Consecutivo.ToString(), out long parsedConsecutivo))
                    {
                        r.ConsecutivoString = parsedConsecutivo.ToString("D7"); // Guardar como cadena
                    }

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