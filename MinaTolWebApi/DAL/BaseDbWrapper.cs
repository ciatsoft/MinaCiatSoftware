using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MinaTolWebApi.DAL
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
        protected T GetObject<T>(string cmdText, Func<IDataReader, T> readerFunctionPointer) where T : class =>
            GetObject(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>(), readerFunctionPointer);

        protected T GetObject<T>(string cmdText, CommandType cmdType, Func<IDataReader, T> readerFunctionPointer) where T : class =>
            GetObject(cmdText, cmdType, Enumerable.Empty<SqlParameter>(), readerFunctionPointer);

        protected T GetObject<T>(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters,
            Func<IDataReader, T> readerFunctionPointer) where T : class
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

                    using (var reader = sqlCommand.ExecuteReader())
                    {

                        if (typeof(T) == typeof(DataTable))
                        {
                            return readerFunctionPointer?.Invoke(reader);
                        }

                        if (reader.Read())
                        {
                            return readerFunctionPointer?.Invoke(reader);
                        }
                    }
                }
            }
            return default(T);
        }
        #endregion

        #region GetObjectAsync
        protected async Task<T> GetObjectAsync<T>(string cmdText, Func<IDataReader, T> readerFunctionPointer) where T : class =>
            await GetObjectAsync(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>(), readerFunctionPointer);

        protected async Task<T> GetObjectAsync<T>(string cmdText, CommandType cmdType, Func<IDataReader, T> readerFunctionPointer) where T : class =>
            await GetObjectAsync(cmdText, cmdType, Enumerable.Empty<SqlParameter>(), readerFunctionPointer);
        /// <summary>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="cmdText"></param>
        /// <param name="cmdType"></param>
        /// <param name="sqlParameters"></param>
        /// <param name="readerFunctionPointer"></param>
        /// <returns></returns>
        protected async Task<T> GetObjectAsync<T>(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters,
            Func<IDataReader, T> readerFunctionPointer) where T : class
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
                        using (var reader = await sqlCommand.ExecuteReaderAsync())
                        {

                            if (await reader.ReadAsync())
                            {
                                return readerFunctionPointer?.Invoke(reader);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                }
            }
            return default(T);
        }
        #endregion

        #region GetObjects
        protected IEnumerable<T> GetObjects<T>(string cmdText, Func<IDataReader, T> readerFunctionPointer) where T : class =>
            GetObjects(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>(), readerFunctionPointer);

        protected IEnumerable<T> GetObjects<T>(string cmdText, CommandType cmdType, Func<IDataReader, T> readerFunctionPointer) where T : class =>
            GetObjects(cmdText, cmdType, Enumerable.Empty<SqlParameter>(), readerFunctionPointer);

        protected IEnumerable<T> GetObjects<T>(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters,
            Func<IDataReader, T> readerFunctionPointer) where T : class
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

                    using (var reader = sqlCommand.ExecuteReader())
                    {

                        var objList = new List<T>();

                        while (reader.Read())
                        {
                            objList.Add(readerFunctionPointer?.Invoke(reader));
                            //yield return readerFunctionPointer?.Invoke(reader);
                        }

                        return objList;
                    }
                }
            }
        }
        #endregion

        #region GetObjectsAsync
        protected async Task<IEnumerable<T>> GetObjectsAsync<T>(string cmdText, Func<IDataReader, T> readerFunctionPointer) where T : class =>
            await GetObjectsAsync(cmdText, CommandType.StoredProcedure, Enumerable.Empty<SqlParameter>(), readerFunctionPointer);

        protected async Task<IEnumerable<T>> GetObjectsAsync<T>(string cmdText, CommandType cmdType, Func<IDataReader, T> readerFunctionPointer)
            where T : class => await GetObjectsAsync(cmdText, cmdType, Enumerable.Empty<SqlParameter>(), readerFunctionPointer);
        /// <summary>
        /// 
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="cmdText"></param>
        /// <param name="cmdType"></param>
        /// <param name="sqlParameters"></param>
        /// <param name="readerFunctionPointer"></param>
        /// <returns></returns>
        protected async Task<IEnumerable<T>> GetObjectsAsync<T>(string cmdText, CommandType cmdType, IEnumerable<SqlParameter> sqlParameters,
            Func<IDataReader, T> readerFunctionPointer) where T : class
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

                    using (var reader = await sqlCommand.ExecuteReaderAsync())
                    {

                        var objectList = new List<T>();

                        while (await reader.ReadAsync())
                        {
                            objectList.Add(readerFunctionPointer?.Invoke(reader));
                            //objectList.Add(FillEntity<T>(reader));
                        }

                        return objectList;
                    }
                }
            }
        }
        #endregion
    }
}