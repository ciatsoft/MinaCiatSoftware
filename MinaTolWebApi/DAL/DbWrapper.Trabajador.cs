using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoEmpleados;
using System.Data.SqlClient;
using System.Data;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllTrabajador()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var user = GetObjects($"SELECT * FROM TRABAJADOR", CommandType.Text, parameters,
                    new Func<IDataReader, DtoTrabajador>((reader) =>
                    {
                        var r = FillEntity<DtoTrabajador>(reader);

                        return r;
                    }));

                modelResponse.Response = user;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse GetTrabajadorById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var user = GetObject($"SELECT * FROM TRABAJADOR where id = {id}", CommandType.Text, parameters,
                    new Func<IDataReader, DtoTrabajador>((reader) =>
                    {
                        var r = FillEntity<DtoTrabajador>(reader);
                        r.AreaTrabajo = new MinaTolEntidades.DtoCatalogos.DtoAreaTrabajo()
                        {
                            Id = MappingProperties<long>(reader["AreaTrabajoID"])
                        };

                        return r;
                    }));

                modelResponse.Response = user;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse SaveOrupdateTrabajador(DtoTrabajador t)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(t);
                var result = ExecuteScalar($"SaveOrupdateTrabajador", System.Data.CommandType.StoredProcedure, parameters);
                t.Id = Convert.ToInt64(result);

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