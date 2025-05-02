using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using MinaTolEntidades.DtoVentas;
using System.Data.SqlClient;
using System.Threading.Tasks;
using MinaTolWebApi.Controllers;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrMaterialUbicacion(MaterialUbicacion mu)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(mu);
                var result = ExecuteScalar("SaveOrMaterialUbicacion", System.Data.CommandType.StoredProcedure, parameters);
                mu.Id = Convert.ToInt64(result);
                response.Response = mu;

            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;

            }
            return response;
        }
        public ModelResponse DeleteMaterialUbicacion(long id)
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
                    ParameterName = "@UbicacionId",
                    SqlDbType = System.Data.SqlDbType.BigInt
                });
                parameters.Add(new SqlParameter()
                {
                    Value = id,
                    IsNullable = true,
                    ParameterName = "@MaterialId",
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                var result = ExecuteNonQuery("DeleteMaterialUbicacion", System.Data.CommandType.StoredProcedure,parameters);
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
        public ModelResponse GetMaterialUbicacionByUbicacion(long id)
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
                    ParameterName = "@UbicacionId",
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                var result = GetObjects("GetMaterialUbicacionByUbicacion", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, MaterialUbicacion>((reader) =>
                    {
                        var r = FillEntity<MaterialUbicacion>(reader);
                        r.Material = new DtoTipoMaterialUbicacion()
                        { 
                            Id = MappingProperties<long>(reader["MaterialId"])
                        };
                        r.Ubicacion = new DtoUbicacion()
                        {
                            Id = MappingProperties<long>(reader["UbicacionId"])
                        };
                        return r;
                    }));

                foreach (var i in result)
                {
                    i.Material = (DtoTipoMaterialUbicacion)GetTipoMaterialUbicacionById(i.Material.Id).Response;
                    i.Ubicacion = (DtoUbicacion)GetUbicacionById(i.Ubicacion.Id).Response;
                }

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