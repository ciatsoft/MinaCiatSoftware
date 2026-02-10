using MinaTolEntidades;
using MinaTolEntidades.VehiculoCarga;
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
        #region VehiculoCarga
        public ModelResponse GetAllVehiculoCarga()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var vehiculosCarga = GetObjects("GetAllVehiculoCarga", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, VehiculoCarga>((reader) =>
                    {
                        var r = FillEntity<VehiculoCarga>(reader);
                        return r;
                    }));
                modelResponse.Response = vehiculosCarga;
            }   
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }
            return modelResponse;
        }
        public ModelResponse GetVehiculoCargaById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                parameters.Add(new SqlParameter("@id", id));

                var vehiculosCarga = GetObject("GetVehiculoCargaById",
                    CommandType.StoredProcedure,
                    parameters,
                    new Func<IDataReader, VehiculoCarga>((reader) =>
                    {
                        var r = FillEntity<VehiculoCarga>(reader);
                        return r;
                    }));

                modelResponse.Response = vehiculosCarga;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse SaveOrUpdateVehiculoCarga(VehiculoCarga vc)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(vc);
                var result = ExecuteScalar("SaveOrUpdateVehiculoCarga", CommandType.StoredProcedure, parameters);
                vc.Id = Convert.ToInt64(result);

                response.Response = vc;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse DeleteVehiculoCarga(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter()
                    {
                        Value = id,
                        IsNullable = true,
                        ParameterName = "@Id",
                    }
                };
                var result = ExecuteNonQuery("DeleteVehiculoCarga", CommandType.StoredProcedure, parameters);
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

        #region RFIDCarga
        public ModelResponse GetAllRFIDCarga()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            try
            {
                var vehiculosCarga = GetObjects("GetAllRFIDCarga", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, RFIDCarga>((reader) =>
                    {
                        var r = FillEntity<RFIDCarga>(reader);
                        return r;
                    }));
                modelResponse.Response = vehiculosCarga;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }
            return modelResponse;
        }
        public ModelResponse GetRFIDCargaById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                parameters.Add(new SqlParameter("@Id", id));

                var vehiculosCarga = GetObject("GetRFIDCargaById",
                    CommandType.StoredProcedure,
                    parameters,
                    new Func<IDataReader, RFIDCarga>((reader) =>
                    {
                        var r = FillEntity<RFIDCarga>(reader);
                        return r;
                    }));

                modelResponse.Response = vehiculosCarga;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse GetRFIDCargaByRFID(string rfid)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                parameters.Add(new SqlParameter("@RFID", rfid));

                var vehiculosCarga = GetObject("GetRFIDCargaByRFID",
                    CommandType.StoredProcedure,
                    parameters,
                    new Func<IDataReader, RFIDCarga>((reader) =>
                    {
                        var r = FillEntity<RFIDCarga>(reader);
                        return r;
                    }));

                modelResponse.Response = vehiculosCarga;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse SaveOrUpdateRFIDCarga(RFIDCarga vc)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(vc);
                var result = ExecuteScalar("SaveOrUpdateRFIDCarga", CommandType.StoredProcedure, parameters);
                vc.Id = Convert.ToInt64(result);

                response.Response = vc;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }
        public ModelResponse DeleteRFIDCarga(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter()
                    {
                        Value = id,
                        IsNullable = true,
                        ParameterName = "@Id",
                    }
                };
                var result = ExecuteNonQuery("DeleteRFIDCarga", CommandType.StoredProcedure, parameters);
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