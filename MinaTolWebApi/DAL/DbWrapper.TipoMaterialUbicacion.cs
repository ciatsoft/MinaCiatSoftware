using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentaPublicoGeneral;
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
                var result = GetObjects($"GetAllTipoMaterialUbicacion", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoTipoMaterialUbicacion>((reader) =>
                    {
                        var r = FillEntity<DtoTipoMaterialUbicacion>(reader);
                        r.UnidadMedida = new UnidadMedida()
                        {
                            Id = reader["UnidadMedidaID"] != DBNull.Value ? Convert.ToInt64(reader["UnidadMedidaID"]) : 0,
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

        public ModelResponse GetGetMaterialUbicacionByUbicacion(long id)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@UbicacionId", id));
            try
            {
                var result = GetList(
                    "GetMaterialUbicacionByUbicacion",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<DtoTipoMaterialUbicacion>(reader)
                );

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
        
        // Guardar relacion 
        public ModelResponse SaveOrUpdateMaterialUbicacion(DtoTipoMaterialUbicacion t)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new SqlParameter[]
                {
                    new SqlParameter("@Id", t.Id),
                    new SqlParameter("@UbicacionId", t.UbicacionId),
                    new SqlParameter("@MaterialId", t.MaterialId),
                    new SqlParameter("@CreatedBy", (object)t.CreatedBy ?? DBNull.Value),
                    new SqlParameter("@CreatedDt", (object)t.CreatedDt ?? DBNull.Value),
                    new SqlParameter("@UpdatedBy", (object)t.UpdatedBy ?? DBNull.Value),
                    new SqlParameter("@UpdatedDt", (object)t.UpdatedDt ?? DBNull.Value),
                };

                var tipoMaterialU = ExecuteScalar("SaveOrUpdateMaterialUbicacion", CommandType.StoredProcedure, parameters);
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

        // Quitar relacion
        public ModelResponse QuitMaterialUbicacion(DtoTipoMaterialUbicacion t)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new SqlParameter[]
                {
                    new SqlParameter("@Id", t.Id),
                };

                var tipoMaterialU = ExecuteScalar("QuitMaterialUbicacion", CommandType.StoredProcedure, parameters);
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
    }
}