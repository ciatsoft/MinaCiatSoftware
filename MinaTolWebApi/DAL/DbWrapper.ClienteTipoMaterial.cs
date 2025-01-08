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
        public ModelResponse SaveOrUpdateClienteTipoMaterial(ClienteTipoMaterial t)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@ClienteId", t.Cliente.Id));
            parameters.Add(new SqlParameter("@MaterialId", t.TipoMaterial.Id));
            parameters.Add(new SqlParameter("@Estatus", t.Estatus));
            parameters.Add(new SqlParameter("@CreatedBy", t.CreatedBy));
            parameters.Add(new SqlParameter("@CreatedDt", t.CreatedDt));

            parameters.Add(new SqlParameter("@P_Mta_M3", clienteTipoMaterial.P_Mta_M3));
            parameters.Add(new SqlParameter("@P_Flete_M3", clienteTipoMaterial.P_Flete_M3));
            parameters.Add(new SqlParameter("@Precio_M3", clienteTipoMaterial.Precio_M3));
            parameters.Add(new SqlParameter("@KM_Cargado", clienteTipoMaterial.KM_Cargado));
            parameters.Add(new SqlParameter("@KM_Basico", clienteTipoMaterial.KM_Basico));
            parameters.Add(new SqlParameter("@Total_KM_Recorridos", clienteTipoMaterial.Total_KM_Recorridos));
            parameters.Add(new SqlParameter("@Carga_Disel", clienteTipoMaterial.Carga_Disel));
            parameters.Add(new SqlParameter("@Total_Diesel_Precio_XLT", clienteTipoMaterial.Total_Diesel_Precio_XLT));
            parameters.Add(new SqlParameter("@Casetas", clienteTipoMaterial.Casetas));
            parameters.Add(new SqlParameter("@Mano_De_Obra", clienteTipoMaterial.Mano_De_Obra));
            parameters.Add(new SqlParameter("@Material_Viajes_De_30M3", clienteTipoMaterial.Material_Viajes_De_30M3));
            parameters.Add(new SqlParameter("@Total_Gastos", clienteTipoMaterial.Total_Gastos));
            parameters.Add(new SqlParameter("@Subtotal_Ingreso_Viajes_M3", clienteTipoMaterial.Subtotal_Ingreso_Viajes_M3));

            var result = ExecuteScalar("SaveOrUpdateClienteTipoMaterial", CommandType.StoredProcedure, parameters);
            t.Id = Convert.ToInt64(result);
            response.Response = t;

            return response;
        }
        public ModelResponse DeleteClienteTipoMaterial(ClienteTipoMaterial t)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@ClienteId", t.Cliente.Id));
            parameters.Add(new SqlParameter("@MaterialId", t.TipoMaterial.Id));

            var result = ExecuteScalar("DeleteClienteTipoMaterial", CommandType.StoredProcedure, parameters);
            t.Id = Convert.ToInt64(result);
            response.Response = t;

            return response;
        }
    }
}