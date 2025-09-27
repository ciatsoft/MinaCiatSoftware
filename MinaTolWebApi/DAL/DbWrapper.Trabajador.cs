using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoTaller;
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
        public ModelResponse ObtenerDatosEmpleado(long id)
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
        public ModelResponse SaveOrUpdateDocumentosEmpleado(DocumentosEmpleado u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateDocumentosEmpleado", CommandType.StoredProcedure, GenerateSQLParameters(u));
                u.Id = Convert.ToInt64(userID);

                modelResponse.Response = u;
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
                    new Func<IDataReader, DocumentosEmpleado>((reader) =>
                    {
                        var r = FillEntity<DocumentosEmpleado>(reader);

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
                    parameters, reader => FillEntity<DocumentosEmpleado>(reader));

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

        #region ConceptosEmpleado
        public ModelResponse GetAllConceptosEmpleados()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var user = GetObjects($"GetAllConceptosEmpleados", System.Data.CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, ConceptosEmpleado>((reader) =>
                    {
                        var r = FillEntity<ConceptosEmpleado>(reader);
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
        public ModelResponse GetConceptosEmpleadosById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var user = GetObject($"SELECT * FROM ConceptosEmpleados WHERE Id = {id} AND Estatus = 1", CommandType.Text, parameters,
                    new Func<IDataReader, ConceptosEmpleado>((reader) =>
                    {
                        var r = FillEntity<ConceptosEmpleado>(reader);
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
        public ModelResponse SaveOrUpdateConceptosEmpleados(ConceptosEmpleado ce)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(ce);
                var result = ExecuteScalar($"SaveOrUpdateConceptosEmpleados", System.Data.CommandType.StoredProcedure, parameters);
                ce.Id = Convert.ToInt64(result);

                response.Response = ce;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;

        }
        public ModelResponse DeleteConceptosEmpleadosById(long id)
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

                var result = ExecuteNonQuery("DeleteConceptosEmpleadosById", System.Data.CommandType.StoredProcedure, parameters);
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

        #region ConceptoEmpleadoByIdEmpleado
        public ModelResponse GetAllConceptoEmpleadoByIdEmpleado(long id)
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
                        SqlDbType = SqlDbType.BigInt  // Cambiado a BigInt para coincidir con tu parámetro
                    }
                };

                // Cambiar GetObject por GetList para obtener múltiples registros
                var result = GetList("GetAllConceptoEmpleadoByIdEmpleado", CommandType.StoredProcedure,
                    parameters, reader => FillEntity<ConceptoEmpleado>(reader));

                response.IsSuccess = true;
                response.Response = result;  // Ahora result será una List<ConceptoEmpleado>
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }
        public ModelResponse GetSalarioActivoByIdEmpleado(long id)
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

                var result = GetObject("GetSalarioActivoByIdEmpleado", CommandType.StoredProcedure,
                    parameters, reader => FillEntity<DtoSalario>(reader));

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
        public ModelResponse SaveOrUpdateConceptoEmpleadoByIdEmpleado(ConceptoEmpleado u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateConceptoEmpleadoByIdEmpleado", CommandType.StoredProcedure, GenerateSQLParameters(u));
                u.Id = Convert.ToInt64(userID);

                modelResponse.Response = u;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse DeleteConceptoEmpleadoById(long id)
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

                var result = ExecuteNonQuery("DeleteConceptoEmpleadoById", System.Data.CommandType.StoredProcedure, parameters);
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

        #region NominaEmpleado
        public ModelResponse GetAllNominasByIdEmpleado(long id)
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
                        SqlDbType = SqlDbType.BigInt
                    }
                };

                // Cambiar GetObject por GetList para obtener múltiples registros
                var result = GetList("GetAllNominasByIdEmpleado", CommandType.StoredProcedure,
                    parameters, reader => FillEntity<NominaEmpleado>(reader));

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
        public ModelResponse GetAllConceptoEmpleadoByIdEmpleadoDates(long id, DateTime fechaInicio, DateTime fechaFinal)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter
                    {
                        Value = id,
                        ParameterName = "@IdTrabajador",
                        SqlDbType = SqlDbType.BigInt
                    },
                    new SqlParameter
                    {
                        Value = fechaInicio,
                        ParameterName = "@FechaInicio",
                        SqlDbType = SqlDbType.DateTime
                    },
                    new SqlParameter
                    {
                        Value = fechaFinal,
                        ParameterName = "@FechaFin",
                        SqlDbType = SqlDbType.DateTime
                    }
                };

                var result = GetList("GetAllConceptoEmpleadoByIdEmpleadoDates", CommandType.StoredProcedure,
                    parameters, reader => FillEntity<ConceptoEmpleado>(reader));

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
        public ModelResponse GetAllPrestamosByIdEmpleadoDates(long id, DateTime fechaInicio, DateTime fechaFinal)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter
                    {
                        Value = id,
                        ParameterName = "@IdTrabajador",
                        SqlDbType = SqlDbType.BigInt
                    },
                    new SqlParameter
                    {
                        Value = fechaInicio,
                        ParameterName = "@FechaInicio",
                        SqlDbType = SqlDbType.DateTime
                    },
                    new SqlParameter
                    {
                        Value = fechaFinal,
                        ParameterName = "@FechaFin",
                        SqlDbType = SqlDbType.DateTime
                    }
                };

                var result = GetList("GetAllPrestamosByIdEmpleadoDates", CommandType.StoredProcedure,
                    parameters, reader => FillEntity<DtoCatalogoPrestamo>(reader));

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
        public ModelResponse SaveOrUpdateNominasByIdEmpleado(NominaEmpleado u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateNominasByIdEmpleado", CommandType.StoredProcedure, GenerateSQLParameters(u));
                u.Id = Convert.ToInt64(userID);

                modelResponse.Response = u;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse DeleteNominasByIdEmpleado(long id)
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

                var result = ExecuteNonQuery("DeleteNominasByIdEmpleado", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }
        public ModelResponse SearchNominaEmpleadoByDates(long id, DateTime fechaInicio, DateTime fechaFinal)
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
                        SqlDbType = SqlDbType.BigInt
                    },
                    new SqlParameter
                    {
                        Value = fechaInicio,
                        ParameterName = "@FechaInicio",
                        SqlDbType = SqlDbType.DateTime
                    },
                    new SqlParameter
                    {
                        Value = fechaFinal,
                        ParameterName = "@FechaFinal",
                        SqlDbType = SqlDbType.DateTime
                    }
                };

                var result = GetList("SearchNominaEmpleadoByDates", CommandType.StoredProcedure,
                    parameters, reader => FillEntity<NominaEmpleado>(reader));

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