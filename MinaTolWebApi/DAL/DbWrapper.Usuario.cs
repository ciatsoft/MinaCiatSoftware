using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades;
using MinaTolEntidades.Security;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse Autentication(string userName, string password)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var user = GetObject($"GetUsuarioByUserNameAndPass", CommandType.StoredProcedure,
                    new[] {
                    new SqlParameter("@UserName", userName),
                    new SqlParameter("@Password", password)
                    },
                new Func<IDataReader, Usuario>((reader) =>
                    {
                        var r = FillEntity<Usuario>(reader);

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
        public ModelResponse GetUserById(long userID)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var user = GetObject($"GetUsuarioById", CommandType.StoredProcedure,
                    new[] {
                    new SqlParameter("@Id", userID)
                    },
                    new Func<IDataReader, Usuario>((reader) =>
                    {
                        var r = FillEntity<Usuario>(reader);

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
        public ModelResponse ValidateUserName(string userName)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var user = GetObject($"ValidateUserName", CommandType.StoredProcedure,
                    new[] {
                    new SqlParameter("@Email", userName)
                    },
                    new Func<IDataReader, Usuario>((reader) =>
                    {
                        var r = FillEntity<Usuario>(reader);

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
        public ModelResponse GetAllUsuario()
        {
            var modelResponse = new ModelResponse();

            try
            {
                var user = GetObjects($"GetAllUsuario", CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>(),
                    new Func<IDataReader, Usuario>((reader) =>
                    {
                        var r = FillEntity<Usuario>(reader);

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
        public ModelResponse SaveOrUpdateUsuario(Usuario u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateUsuario", CommandType.StoredProcedure, GenerateSQLParameters(u));
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
    }
}