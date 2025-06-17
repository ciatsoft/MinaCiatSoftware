using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllPermisos()

        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var result = GetObjects($"GetAllPermisos", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoPermisos>((reader) =>
                    {
                        var r = FillEntity<DtoPermisos>(reader);
                        return r;
                    }));
                //más facil
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

        public ModelResponse GetPermisosByIdRol(long id)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>
    {
        new SqlParameter("@Id", id)
    };

            try
            {
                var result = GetObjects("GetPermisosByIdRol", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, RolPermiso>((reader) =>
                    {
                        return FillEntity<RolPermiso>(reader);
                    }));

                response.Response = result; // ahora es List<RolPermiso>
                response.IsSuccess = true;
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