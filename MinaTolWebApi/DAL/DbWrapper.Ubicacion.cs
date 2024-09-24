using MinaTolEntidades;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using MinaTolEntidades.DtoCatalogos;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllUbicacion()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            
            try
            {
                var result = GetObjects($"GetAllUbicacion", CommandType.Text, parameters,
                    new Func<IDataReader, DtoUbicacion>((reader) =>
                    {
                        var r = FillEntity<DtoUbicacion>(reader);

                        return r;
                    }));
                modelResponse.Response = result;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }
            return modelResponse;
          
        }

        public ModelResponse SaveOrUpdateUbicacion(DtoUbicacion u)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(u);
                var ubicacionId = ExecuteScalar($"SaveOrUpdateUbicacion", System.Data.CommandType.StoredProcedure, parameters);
                u.Id = Convert.ToInt64(ubicacionId);

                response.Response = u;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse GetUbicacionById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            //parameters.Add(new SqlParameter("@Id", id));
            try
            {
                var user = GetObject($"SELECT * FROM Ubicacion where id = {id}", CommandType.Text, parameters,
                   new Func<IDataReader, DtoUbicacion>((reader) =>
                   {
                       var r = FillEntity<DtoUbicacion>(reader);

                       return r;
                   }));

                modelResponse.Response = user;
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