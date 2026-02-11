using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace SqlProxy
{
    public abstract class BaseDbWrapper
    {
        #region properties
        protected abstract string SQLConnectionString { get; }
        protected abstract TimeSpan SQLCommandTimeOut { get; }
        #endregion

        #region ExecuteScalar
        protected object ExecuteScalar(string cmdText) => ExecuteScalar(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>());

        protected object ExecuteScalar(string cmdText, CommandType cmdType) => ExecuteScalar(cmdText, cmdType, Enumerable.Empty<SqlParameter>());

        protected object ExecuteScalar(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters)
        {
            using (var sqlConnection = new SqlConnection(SQLConnectionString))
            {
                sqlConnection.Open();
                using (var sqlCommand = sqlConnection.CreateCommand())
                {
                    sqlCommand.CommandTimeout = (int)SQLCommandTimeOut.TotalSeconds;
                    sqlCommand.CommandText = cmdText;
                    sqlCommand.CommandType = cmdType;
                    sqlCommand.Parameters.AddRange(sqlParameters?.ToArray() ?? Enumerable.Empty<SqlParameter>().ToArray());
                    return sqlCommand.ExecuteScalar();
                }
            }
        }
        #endregion

        #region ExecuteScalarAsync
        protected async Task<object> ExecuteScalarAsync(string cmdText) =>
            await ExecuteScalarAsync(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>());

        protected async Task<object> ExecuteScalarAsync(string cmdText, CommandType cmdType) =>
            await ExecuteScalarAsync(cmdText, cmdType, Enumerable.Empty<SqlParameter>());
        /// <summary>
        /// Creates a sqlConnection and executes a scalar
        /// </summary>
        /// <param name="cmdText"></param>
        /// <param name="cmdType"></param>
        /// <param name="sqlParameters"></param>
        /// <returns>object scalar</returns>
        protected async Task<object> ExecuteScalarAsync(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters)
        {
            using (var sqlConnection = new SqlConnection(SQLConnectionString))
            {
                await sqlConnection.OpenAsync();
                using (var sqlCommand = sqlConnection.CreateCommand())
                {
                    sqlCommand.CommandTimeout = (int)SQLCommandTimeOut.TotalSeconds;
                    sqlCommand.CommandText = cmdText;
                    sqlCommand.CommandType = cmdType;
                    sqlCommand.Parameters.AddRange(sqlParameters?.ToArray() ?? Enumerable.Empty<SqlParameter>().ToArray());

                    try
                    {
                        return await sqlCommand.ExecuteScalarAsync();
                    }
                    catch (Exception EX)
                    {
                        throw EX;
                    }
                }
            }
        }
        #endregion

        #region ExecuteNonQuery
        protected int ExecuteNonQuery(string cmdText) =>
            ExecuteNonQuery(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>());

        protected int ExecuteNonQuery(string cmdText, CommandType cmdType) =>
            ExecuteNonQuery(cmdText, cmdType, Enumerable.Empty<SqlParameter>());

        protected int ExecuteNonQuery(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters)
        {
            using (var sqlConnection = new SqlConnection(SQLConnectionString))
            {
                sqlConnection.Open();
                using (var sqlCommand = sqlConnection.CreateCommand())
                {
                    sqlCommand.CommandTimeout = (int)SQLCommandTimeOut.TotalSeconds;
                    sqlCommand.CommandText = cmdText;
                    sqlCommand.CommandType = cmdType;
                    sqlCommand.Parameters.AddRange(sqlParameters?.ToArray() ?? Enumerable.Empty<SqlParameter>().ToArray());

                    return sqlCommand.ExecuteNonQuery();
                }
            }
        }
        #endregion

        #region ExecuteNonQueryAsync
        protected async Task<int> ExecuteNonQueryAsync(string cmdText) =>
            await ExecuteNonQueryAsync(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>());

        protected async Task<int> ExecuteNonQueryAsync(string cmdText, CommandType cmdType) =>
            await ExecuteNonQueryAsync(cmdText, cmdType, Enumerable.Empty<SqlParameter>());
        /// <summary>
        /// Creates a sqlConnection and executes a nonQuery
        /// </summary>
        /// <param name="cmdText"></param>
        /// <param name="cmdType"></param>
        /// <param name="sqlParameters"></param>
        /// <returns>int rows affected</returns>
        protected async Task<int> ExecuteNonQueryAsync(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters)
        {
            using (var sqlConnection = new SqlConnection(SQLConnectionString))
            {
                await sqlConnection.OpenAsync();
                using (var sqlCommand = sqlConnection.CreateCommand())
                {
                    sqlCommand.CommandTimeout = (int)SQLCommandTimeOut.TotalSeconds;
                    sqlCommand.CommandText = cmdText;
                    sqlCommand.CommandType = cmdType;
                    sqlCommand.Parameters.AddRange(sqlParameters?.ToArray() ?? Enumerable.Empty<SqlParameter>().ToArray());

                    try
                    {
                        return await sqlCommand.ExecuteNonQueryAsync();
                    }
                    catch (SqlException ex)
                    {
                        throw ex;
                    }
                }
            }
        }
        #endregion

        #region GetObject
        protected DataTable GetObject(string cmdText) =>
            GetObject(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>());

        protected DataTable GetObject(string cmdText, CommandType cmdType) =>
            GetObject(cmdText, cmdType, Enumerable.Empty<SqlParameter>());

        protected DataTable GetObject(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters)
        {
            // Aseguramos siempre devolver una instancia de DataTable (puede quedar sin filas).
            var dt = new DataTable();

            using (var sqlConnection = new SqlConnection(SQLConnectionString))
            {
                sqlConnection.Open();

                using (var sqlCommand = sqlConnection.CreateCommand())
                {
                    sqlCommand.CommandTimeout = (int)SQLCommandTimeOut.TotalSeconds;
                    sqlCommand.CommandText = cmdText;
                    sqlCommand.CommandType = cmdType;
                    sqlCommand.Parameters.AddRange(sqlParameters?.ToArray() ?? Enumerable.Empty<SqlParameter>().ToArray());

                    using (var reader = sqlCommand.ExecuteReader())
                    {
                        // Cargar el DataTable; dt quedará vacío si no hay filas
                        dt.Load(reader);
                    }
                }
            }

            return dt;
        }
        #endregion

        #region GetObjectAsync
        protected async Task<DataTable> GetObjectAsync(string cmdText) =>
            await GetObjectAsync(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>());

        protected async Task<DataTable> GetObjectAsync(string cmdText, CommandType cmdType) =>
            await GetObjectAsync(cmdText, cmdType, Enumerable.Empty<SqlParameter>());

        /// <summary>
        /// </summary>
        /// <param name="cmdText"></param>
        /// <param name="cmdType"></param>
        /// <param name="sqlParameters"></param>
        /// <returns></returns>
        protected async Task<DataTable> GetObjectAsync(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters)
        {
            // Aseguramos siempre devolver una instancia de DataTable (puede quedar sin filas).
            var dt = new DataTable();

            using (var sqlConnection = new SqlConnection(SQLConnectionString))
            {
                await sqlConnection.OpenAsync();
                using (var sqlCommand = sqlConnection.CreateCommand())
                {
                    sqlCommand.CommandTimeout = (int)SQLCommandTimeOut.TotalSeconds;
                    sqlCommand.CommandText = cmdText;
                    sqlCommand.CommandType = cmdType;
                    sqlCommand.Parameters.AddRange(sqlParameters?.ToArray() ?? Enumerable.Empty<SqlParameter>().ToArray());

                    try
                    {
                        using (var reader = await sqlCommand.ExecuteReaderAsync())
                        {
                            // Cargar el DataTable; dt quedará vacío si no hay filas
                            dt.Load(reader);
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }

            return dt;
        }
        #endregion
    }
}