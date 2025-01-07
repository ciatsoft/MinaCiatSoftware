using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoViajes;
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
        public ModelResponse GetTipoMaterialByCliente(long id)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@ClienteId", id));
            try
            {
                var result = GetObjects("GetTipoMaterialByCliente", CommandType.StoredProcedure, parameters,
                     new Func<IDataReader, ClienteTipoMaterial>((reader) =>
                     {
                         var r = FillEntity<ClienteTipoMaterial>(reader);

                         r.Cliente = new MinaTolEntidades.DtoClientes.Cliente()
                         {
                             Id = MappingProperties<long>(reader["ClienteId"]),
                             Nombre = MappingProperties<string>(reader["NombreCliente"])
                         };
                         r.TipoMaterial = new MinaTolEntidades.DtoCatalogos.DtoTipoMaterialUbicacion()
                         {
                             Id = MappingProperties<long>(reader["MaterialId"]),
                             NombreTipoMaterial = MappingProperties<string>(reader["Material"])
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
        public ModelResponse SaveOrUpdateClienteTipoMaterial(ClienteTipoMaterial clienteTipoMaterial)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@Id", clienteTipoMaterial.Id));
            parameters.Add(new SqlParameter("@ClienteId", clienteTipoMaterial.Cliente.Id));
            parameters.Add(new SqlParameter("@MaterialId", clienteTipoMaterial.TipoMaterial.Id));
            parameters.Add(new SqlParameter("@Estatus", clienteTipoMaterial.Estatus));
            parameters.Add(new SqlParameter("@CreatedBy", clienteTipoMaterial.CreatedBy));
            parameters.Add(new SqlParameter("@CreatedDt", clienteTipoMaterial.CreatedDt));

            var result = ExecuteScalar("SaveOrUpdateClienteTipoMaterial", CommandType.StoredProcedure, parameters);
            clienteTipoMaterial.Id = Convert.ToInt64(result);
            response.Response = clienteTipoMaterial;

            return response;
        }
        public ModelResponse DeleteClienteTipoMaterial(ClienteTipoMaterial clienteTipoMaterial)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@ClienteId", clienteTipoMaterial.Cliente.Id));
            parameters.Add(new SqlParameter("@MaterialId", clienteTipoMaterial.TipoMaterial.Id));

            var result = ExecuteScalar("DeleteClienteTipoMaterial", CommandType.StoredProcedure, parameters);
            clienteTipoMaterial.Id = Convert.ToInt64(result);
            response.Response = clienteTipoMaterial;

            return response;
        }
    }
}