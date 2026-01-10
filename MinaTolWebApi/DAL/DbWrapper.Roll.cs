using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSeguridad;
using MinaTolEntidades.Security;
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
        public ModelResponse SaveOrUpdateRoll(DtoRoll tv)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(tv);
                var result = GetObject("SaveOrUpdateRoll", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoRoll>((reader) =>
                    {
                        var r = FillEntity<DtoRoll>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch(Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;

            }
            return response;
        }
        public ModelResponse GetAllRoll()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllRoll", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoRoll>((reader) =>
                    {
                        var r = FillEntity<DtoRoll>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch(Exception ex )
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse GetRollById (int id)
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
                    ParameterName = "@Id",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = GetObject("GetRollById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoRoll>((reader) =>
                    {
                        var r = FillEntity<DtoRoll>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch(Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse DeleteRoll(int id)
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
                    ParameterName = "@Id",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = ExecuteNonQuery("DeleteRoll", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse GetPermisosByIdRol(long idRol)
        {
            var response = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@Id", idRol));
            try
            {
                var result = GetList(
                    "GetPermisosByIdRol",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<RolPermiso>(reader)
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

        public ModelResponse GetAllPermisos()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPermisos", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Permisos>((reader) =>
                    {
                        var r = FillEntity<Permisos>(reader);
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

        public ModelResponse SaveOrUpdatePermisosRol(RolPermiso rp)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                // Armamos manualmente los parámetros que tu SP requiere
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", rp.Id),
                    new SqlParameter("@IdRol", rp.IdRol),
                    new SqlParameter("@PermisoId", rp.PermisoId),
                    new SqlParameter("@Estatus", rp.Estatus),
                    new SqlParameter("@CreatedBy", rp.CreatedBy),
                    new SqlParameter("@CreatedDt", rp.CreatedDt),
                    new SqlParameter("@UpdatedBy", rp.UpdatedBy),
                    new SqlParameter("@UpdatedDt", rp.UpdatedDt)
                };

                var result = GetObject(
                    "SaveOrUpdatePermisosRol",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<RolPermiso>(reader)
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

        public ModelResponse DeletePermiso(long id, long idRol)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@Id", id));
                parameters.Add(new SqlParameter("@IdRol", idRol));

                var result = ExecuteNonQuery("DeletePermiso", System.Data.CommandType.StoredProcedure, parameters);

                // Considera agregar validación del resultado
                if (result <= 0)
                {
                    response.IsSuccess = false;
                    response.Message = "No se pudo eliminar el permiso";
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }

        public ModelResponse GetPermisosByUsuarioId(long userID)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var permisos = GetObjects($"GetPermisosByUsuarioId", CommandType.StoredProcedure,
                    new[] {
                    new SqlParameter("@UsuarioId", userID)
                    },
                    new Func<IDataReader, Permisos>((reader) =>
                    {
                        var r = FillEntity<Permisos>(reader);

                        if (!string.IsNullOrEmpty(reader["PermisoPadreId"].ToString()))
                        {
                            r.PermisoPadre = new Permisos()
                            {
                                Id = Convert.ToInt64(reader["PermisoPadreId"]),
                                Nombre = reader["PermisoPadreNombre"].ToString()
                            };
                        }

                        return r;
                    }));

                modelResponse.Response = permisos;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse GetAllUsuarioRolByUsuarioId(long userID)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var permisos = GetObjects($"GetAllUsuarioRolByUsuarioId", CommandType.StoredProcedure,
                    new[] {
                    new SqlParameter("@Id", userID)
                    },
                    new Func<IDataReader, UsuarioRol>((reader) =>
                    {
                        var r = FillEntity<UsuarioRol>(reader);
                        return r;
                    }));

                modelResponse.Response = permisos;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse SaveOrUpdateUsuarioRol(UsuarioRol u)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(u);
                var result = GetObject("SaveOrUpdateUsuarioRol", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, UsuarioRol>((reader) =>
                    {
                        var r = FillEntity<UsuarioRol>(reader);
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

        public ModelResponse DeleteUsuarioRolById(long id)
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

                var result = ExecuteNonQuery("DeleteUsuarioRolById", System.Data.CommandType.StoredProcedure, parameters);
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