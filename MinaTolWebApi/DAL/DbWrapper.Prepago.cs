using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
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
                    new SqlParameter("@UserName", p.UserName),
                    new SqlParameter("@IdMaterial", p.IdMaterial),
                    new SqlParameter("@NombreMaterial", p.NombreMaterial),
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

        public ModelResponse DeletePrepago(long id)
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

                var result = ExecuteNonQuery("DeletePrepago", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }


        public ModelResponse GetAllPrepagos()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPrepagos", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Prepago>((reader) =>
                    {
                        var r = FillEntity<Prepago>(reader);
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

        public ModelResponse GetAllPrepagosByRFID(string rfid)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            // Agregar parámetro correctamente
            parameters.Add(new SqlParameter("@RFID", rfid));

            try
            {
                var user = GetList("SELECT * FROM Prepago where Rfid = @RFID", CommandType.Text, parameters,
                   new Func<IDataReader, Prepago>((reader) =>
                   {
                       var r = FillEntity<Prepago>(reader);
                       return r;
                   }));

                modelResponse.Response = user;
                modelResponse.IsSuccess = true;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Message = ex.Message;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
            }

            return modelResponse;
        }

        public ModelResponse GetAllPrepagosByFolio(string folio)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            // Agregar parámetro correctamente
            parameters.Add(new SqlParameter("@Folio", folio));

            try
            {
                var user = GetList("SELECT * FROM Prepago where Folio = @Folio", CommandType.Text, parameters,
                   new Func<IDataReader, Prepago>((reader) =>
                   {
                       var r = FillEntity<Prepago>(reader);
                       return r;
                   }));

                modelResponse.Response = user;
                modelResponse.IsSuccess = true;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Message = ex.Message;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
            }

            return modelResponse;
        }


    }
}