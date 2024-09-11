using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrupdateTrabajador(DtoTrabajador t)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(t);
                var result = GetObjects("SaveOrupdateTrabajador", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoTrabajador>((reader) =>
                    {
                        var r = FillEntity<DtoTrabajador>(reader);
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