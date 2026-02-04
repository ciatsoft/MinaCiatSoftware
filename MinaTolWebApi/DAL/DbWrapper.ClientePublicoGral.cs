using MinaTolEntidades;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace MinaTolWebApi.DAL
{
    partial class DbWrapper
    {
        #region ClientePublicoGeneral
        public ModelResponse SaveOrUpdateClientePublicoGral(ClientePublicoGral c)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(c);
                var result = GetObject("SaveOrUpdateClientePublicoGral", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ClientePublicoGral>((reader) =>
                    {
                        var r = FillEntity<ClientePublicoGral>(reader);
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

        public ModelResponse GetAllClientePublicoGral()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllClientePublicoGral", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ClientePublicoGral>((reader) =>
                    {
                        var r = FillEntity<ClientePublicoGral>(reader);
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

        public ModelResponse GetClientePublicoGralById(long id)
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

                var result = GetObject("GetClientePublicoGralById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ClientePublicoGral>((reader) =>
                    {
                        var r = FillEntity<ClientePublicoGral>(reader);
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

        public ModelResponse DeleteClientePublicoGral(long id)
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

                var result = ExecuteNonQuery("DeleteClientePublicoGral", System.Data.CommandType.StoredProcedure, parameters);
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

        #region HistoricoRFID
        public ModelResponse SaveOrUpdateHistoricoRFID(HistoricoRFID c)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(c);
                var result = GetObject("SaveOrUpdateHistoricoRFID", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, HistoricoRFID>((reader) =>
                    {
                        var r = FillEntity<HistoricoRFID>(reader);
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
        public ModelResponse GetAllHistoricoRFID()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllHistoricoRFID", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, HistoricoRFID>((reader) =>
                    {
                        var r = FillEntity<HistoricoRFID>(reader);
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
        public ModelResponse GetHistoricoRFIDById(long id)
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

                var result = GetObject("GetHistoricoRFIDById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, HistoricoRFID>((reader) =>
                    {
                        var r = FillEntity<HistoricoRFID>(reader);
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
        public ModelResponse DeleteHistoricoRFID(long id)
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

                var result = ExecuteNonQuery("DeleteHistoricoRFID", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse GetAllHistoricoRFIDByIdCliente(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@IdCliente", SqlDbType.BigInt) // Cambiado a BigInt
                    {
                        Value = id,
                        Direction = ParameterDirection.Input
                    }
                };

                var result = GetObjects("GetAllHistoricoRFIDByIdCliente",
                    CommandType.StoredProcedure,
                    parameters,
                    (reader) => FillEntity<HistoricoRFID>(reader));

                response.Response = result;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"Error al obtener historial RFID: {ex.Message}";
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse TotalHistoricoRFIDByIdCliente(long id)
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
                    ParameterName = "@IdCliente",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = GetObject("TotalHistoricoRFIDByIdCliente", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Reporte>((reader) =>
                    {
                        var r = FillEntity<Reporte>(reader);
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
        #endregion
    }
}