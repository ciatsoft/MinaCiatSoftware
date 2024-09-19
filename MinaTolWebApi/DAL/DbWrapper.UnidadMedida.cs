using MinaTolEntidades;
using MinaTolEntidades.DtoSucursales;
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
        public ModelResponse SaveOrUpdateUnidadMedida(UnidadMedida u)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(u);
                var unidadmedidaId = ExecuteScalar($"SaveOrUpdateUnidadMedida", System.Data.CommandType.StoredProcedure, parameters);
                u.Id = Convert.ToInt64(unidadmedidaId);

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

        public ModelResponse GetAllUnidadMedida()
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                           
                var result = GetObjects($"GetAllUnidadMedida", CommandType.Text, parameters,
                   new Func<IDataReader, UnidadMedida>((reader) =>
                   {
                       var r = FillEntity<UnidadMedida>(reader);
                                        
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

        public ModelResponse GetUnidadMedidaById(int id)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@Id", id));
            try
            {


                var result = GetObject("GetUnidadMedidaById", CommandType.StoredProcedure, parameters,
                     new Func<IDataReader, UnidadMedida>((reader) =>
                     {
                         var r = FillEntity<UnidadMedida>(reader);

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