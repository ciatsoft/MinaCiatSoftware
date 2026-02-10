using MinaTolEntidades;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
using MinaTolEntidades.DtoViajes;
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
        public ModelResponse SaveOrUpdatePV_Venta(PV_Ventas v)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", v.Id),
                    new SqlParameter("@Folio", v.Folio),
                    new SqlParameter("@Ubicacion", v.Ubicacion.Id),
                    new SqlParameter("@TipoMaterial", v.TipoMaterial.Id),
                    new SqlParameter("@FormaDePago", v.FormaDePago),
                    new SqlParameter("@CantidadRecibida", v.CantidadRecibida),
                    new SqlParameter("@PrecioUnidad", v.PrecioUnidad),
                    new SqlParameter("@Transporte", v.Transporte),
                    new SqlParameter("@Placa", v.Placa),
                    new SqlParameter("@Cantidad", Convert.ToInt32(v.Cantidad)),
                    new SqlParameter("@UnidadMedida", v.UnidadMedida.Id),
                    new SqlParameter("@Usuario", v.Usuario.Id),
                    new SqlParameter("@Estatus", v.Estatus),
                    new SqlParameter("@TotalPago", v.TotalPago),
                    new SqlParameter("@CreatedBy", v.CreatedBy),
                    new SqlParameter("@CreatedDt", v.CreatedDt),
                    new SqlParameter("@UpdatedBy", v.UpdatedBy),
                    new SqlParameter("@UpdatedDt", v.UpdatedDt),
                    new SqlParameter("@RFID", v.RFID),
                    new SqlParameter("@NombreCliente", v.NombreCliente)
                };

                var result = ExecuteScalar("SaveOrUpdatePV_Ventas", CommandType.StoredProcedure, parameters);
                v.Id = Convert.ToInt64(result);

                response.IsSuccess = true;
                response.Response = result;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"Error inesperado: {ex.Message}";
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }

        public ModelResponse UpdateCarga(int id)
        {
            var response = new ModelResponse();

            try
            {
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", id),
                };

                var result = ExecuteScalar("UpdateCarga", CommandType.StoredProcedure, parameters);

                response.IsSuccess = true;
                response.Response = result;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = $"Error inesperado: {ex.Message}";
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }

        public ModelResponse GetAllPV_Venta()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPV_Ventas", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Ventas>((reader) =>
                    {
                        var r = FillEntity<PV_Ventas>(reader);
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

        public ModelResponse GetPV_VentaById(int id)
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

                var result = GetObject("GetPV_VentaById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Precio>((reader) =>
                    {
                        var r = FillEntity<PV_Precio>(reader);
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

        public ModelResponse ActualizarEstatusVenta(int id, string valor)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                // Crear la lista de parámetros correctamente
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter()
                    {
                        ParameterName = "@Id",
                        Value = id,
                        SqlDbType = System.Data.SqlDbType.Int
                    },
                    new SqlParameter()
                    {
                        ParameterName = "@Valor",
                        Value = valor,
                        SqlDbType = System.Data.SqlDbType.NVarChar,
                        Size = 10
                    }
                };

                var result = GetObject("ActualizarVenta", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Precio>((reader) =>
                    {
                        var r = FillEntity<PV_Precio>(reader);
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

        //Para el modulo de Corte de Caja Diario
        public ModelResponse SearchPV_VentasByDateAndUser(long usuarioId, DateTime fecha)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var fechaSolo = fecha.Date;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@UsuarioId",    SqlDbType.BigInt)   { Value = usuarioId },
                    new SqlParameter("@Fecha",    SqlDbType.Date)   { Value = fechaSolo }
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "SearchPV_VentasByDateAndUser",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<PV_Ventas>(reader)
                );

                response.Response = result; // ahora será una lista de PV_CajaChica
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse SearchPV_VentasByDate(DateTime fecha)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var fechaSolo = fecha.Date;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Fecha",    SqlDbType.Date)   { Value = fechaSolo }
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "SearchPV_VentasByDate",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<PV_Ventas>(reader)
                );

                response.Response = result; // ahora será una lista de PV_CajaChica
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;
        }

        public ModelResponse SearchDeduccionesByDate(DateTime fechaDeducciones)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var fechaSolo = fechaDeducciones.Date;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Fecha",    SqlDbType.Date)   { Value = fechaSolo }
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "SearchDeduccionesByDate",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<Deducciones>(reader)
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
        public ModelResponse SearchDeduccionesByDates(DateTime fechaDeduccionesInicio, DateTime fechaDeduccionesFin)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var fechaSolo1 = fechaDeduccionesInicio.Date;
                var fechaSolo2 = fechaDeduccionesFin.Date;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@FechaInicio",    SqlDbType.Date)   { Value = fechaSolo1 },
                    new SqlParameter("@FechaFin",    SqlDbType.Date)   { Value = fechaSolo2 }
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "SearchDeduccionesByDates",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<Deducciones>(reader)
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
        
        public ModelResponse TotalPlantaByFecha(DateTime Fecha)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var fechaSolo = Fecha.Date;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Fecha",    SqlDbType.Date)   { Value = fechaSolo }
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "TotalPlantaByFecha",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<TotalPlanta>(reader)
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

        public ModelResponse TotalPlantaByFecha2(DateTime fecha2, DateTime fecha3)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var fechaSolo2 = fecha2.Date;
                var fechaSolo3 = fecha3.Date;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Fecha2",    SqlDbType.Date)   { Value = fechaSolo2 },
                    new SqlParameter("@Fecha3",    SqlDbType.Date)   { Value = fechaSolo3 }
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "TotalPlantaByFecha2",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<TotalPlanta>(reader)
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

        public ModelResponse SearchClienteByRFID(string rfid)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = rfid,
                    IsNullable = true,
                    ParameterName = "@RFID",
                    SqlDbType = System.Data.SqlDbType.NVarChar
                });

                var result = GetObject("SearchClienteByRFID", System.Data.CommandType.StoredProcedure,
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
        public ModelResponse SearchClienteByNombre(string nombre)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = nombre,
                    IsNullable = true,
                    ParameterName = "@Nombre",
                    SqlDbType = System.Data.SqlDbType.NVarChar
                });

                var result = GetObject("SearchClienteByName", System.Data.CommandType.StoredProcedure,
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

        // Obtener lo vehiculos relacionados al Cliente
        public ModelResponse GetVehiculosPublicoGralByIdCliente(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                
                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Id", SqlDbType.BigInt) { Value = id},
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "GetVehiculosPublicoGralByIdCliente",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => {
                        var dto = new DtoClientesVehiculoPublicoGral();
                        dto.Id = Convert.ToInt64(reader["Id"]);
                        dto.Nombre = reader["Nombre"].ToString();
                        dto.Capacidad = Convert.ToInt32(reader["Capacidad"]);
                        dto.ClienteID = new ClientePublicoGral
                        {
                            Id = Convert.ToInt64(reader["ClienteID"])
                        };
                        dto.Color = reader["Color"].ToString();
                        dto.Placa = reader["Placa"].ToString();
                        return dto;
                    }
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

        public ModelResponse SearchDeduccionesByDateAndUser(string userName, DateTime Fecha)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var fechaSolo = Fecha.Date;

                var parameters = new List<SqlParameter>
                {
                    new SqlParameter("@Fecha",    SqlDbType.Date)   { Value = fechaSolo },
                    new SqlParameter("@UserName",    SqlDbType.NVarChar)   { Value = userName }
                };

                // CORREGIDO: usar GetList para obtener varios registros
                var result = GetList(
                    "SearchDeduccionesByDateAndUser",
                    CommandType.StoredProcedure,
                    parameters,
                    reader => FillEntity<Deducciones>(reader)
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
    }
}