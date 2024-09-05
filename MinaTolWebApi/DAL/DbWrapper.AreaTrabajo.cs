using MinaTolEntidades.Security;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllAreaTrabajo()
        {
            var modelResponse = new ModelResponse();

            try
            {
                var result = GetObjects($"GetAllAreaTrabajo", CommandType.StoredProcedure, null,
                    new Func<IDataReader, DtoAreaTrabajo>((reader) =>
                    {
                        var r = FillEntity<DtoAreaTrabajo>(reader);

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
    }
}