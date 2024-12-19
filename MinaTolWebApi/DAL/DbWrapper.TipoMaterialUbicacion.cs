using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
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
        public ModelResponse GetAllTipoMaterialUbicacion()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var result = GetObjects($"GetAllTipoMaterialUbicacion", CommandType.Text, parameters,
                    new Func<IDataReader, DtoTipoMaterialUbicacion>((reader) =>
                    {
                        var r = FillEntity<DtoTipoMaterialUbicacion>(reader);
                        r.UnidadMedida = new UnidadMedida()
                        {
                            Id = Convert.ToInt64(reader["UnidadMedidaID"].ToString())
                        };
                        return r;
                    }));
                //más facil
                foreach (var i in result)
                {
                    i.UnidadMedida = (UnidadMedida)GetUnidadMedidaById(i.UnidadMedida.Id).Response;
                }

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

        public ModelResponse SaveOrUpdateTipoMaterialUbicacion (DtoTipoMaterialUbicacion t)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(t);
                var tipoMaterialU = ExecuteScalar($"SaveOrUpdateTipoMaterialUbicacion", System.Data.CommandType.StoredProcedure, parameters);
                t.Id = Convert.ToInt64(tipoMaterialU);

                response.Response = t;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse GetTipoMaterialUbicacionById (long id)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@Id", id));
            try
            {
                var result = GetObject("GetTipoMaterialUbicacionById", CommandType.StoredProcedure, parameters,
                     new Func<IDataReader, DtoTipoMaterialUbicacion>((reader) =>
                     {
                         var r = FillEntity<DtoTipoMaterialUbicacion>(reader);

                         r.UnidadMedida = new MinaTolEntidades.DtoSucursales.UnidadMedida()
                         {
                             Id = MappingProperties<long>(reader["UnidadMedidaId"])
                         };

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

        public ModelResponse GetTipoMaterialByUnicacion(long id)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@UbicacionID", id));
            try
            {
                var result = GetObjects("GetTipoMaterialByUnicacion", CommandType.StoredProcedure, parameters,
                     new Func<IDataReader, DtoTipoMaterialUbicacion>((reader) =>
                     {
                         var r = FillEntity<DtoTipoMaterialUbicacion>(reader);

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