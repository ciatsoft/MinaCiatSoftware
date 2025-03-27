using MinaTolEntidades;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentas;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {

        public ModelResponse SaveOrUpdatePV_Planta(PV_Planta p)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(p);
                var result = GetObject("SaveOrUpdatePV_Planta", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Planta>((reader) =>
                    {
                        var r = FillEntity<PV_Planta>(reader);
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

        public ModelResponse GetAllUnidadPV_Planta()
        {
            var response = new ModelResponse();

            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPV_Planta", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Planta>((reader) =>
                    {
                        var r = FillEntity<PV_Planta>(reader);
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
        public ModelResponse GetUnidadPV_PlantaById(long id)
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

                var result = GetObject("GetAllPV_PlantaById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Planta>((reader) =>
                    {
                        var r = FillEntity<PV_Planta>(reader);
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



