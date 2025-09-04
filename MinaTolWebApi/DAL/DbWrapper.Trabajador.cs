using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades.DtoCatalogos;
using System.Data.SqlClient;
using System.Data;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        #region Empleados
        public ModelResponse GetAllEmpleados()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var user = GetObjects($"GetAllTrabajador", System.Data.CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, Empleado>((reader) =>
                    {
                        var r = FillEntity<Empleado>(reader);
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
                    new Func<IDataReader, Empleado>((reader) =>
                    {
                        var r = FillEntity<Empleado>(reader);
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
        public ModelResponse SaveOrupdateEmpleado(Empleado t)
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
        public ModelResponse DeleteEmpleadoById(long id)
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
                    ParameterName = "@Id"
                });

                var result = ExecuteNonQuery("DeleteEmpleadoById", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }
        #endregion

        #region DocumentosEmpleados
        public ModelResponse SaveOrUpdateDocumentosEmpleado(DocumentosEmpleados s)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var salarioId = ExecuteScalar($"SaveOrUpdateDocumentosEmpleado", CommandType.StoredProcedure, GenerateSQLParameters(s));
                s.Id = Convert.ToInt64(salarioId);

                modelResponse.Response = s;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse DeleteDocumentoEmpleadoById(long id)
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
                    ParameterName = "@Id"
                });

                var result = ExecuteNonQuery("DeleteDocumentoEmpleadoById", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }

        public ModelResponse GetAllDocumentosEmpleado()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var result = GetObjects($"GetAllDocumentosEmpleado", CommandType.Text, parameters,
                    new Func<IDataReader, DocumentosEmpleados>((reader) =>
                    {
                        var r = FillEntity<DocumentosEmpleados>(reader);

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

        public ModelResponse GetDocumentoEmpleadoById(long id)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
        {
            new SqlParameter
            {
                Value = id,
                ParameterName = "@Id",
                SqlDbType = SqlDbType.Int
            }

        };

                var result = GetObject("GetDocumentoEmpleadoById", CommandType.StoredProcedure,
                    parameters, reader => FillEntity<DocumentosEmpleados>(reader));

                response.IsSuccess = true;
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
        #endregion
    }
}