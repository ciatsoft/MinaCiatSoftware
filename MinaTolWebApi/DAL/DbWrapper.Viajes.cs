using MinaTolEntidades.DtoEmpleados;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoViajes;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllViajeInterno()
            {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var user = GetObjects($"GetAllViajeInterno", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeInterno>((reader) =>
                    {
                        var r = FillEntity<DtoViajeInterno>(reader);

                        r.UbicacionOrigen.NombreUbicacion = MappingProperties<string>(reader["Origen"]);
                        r.ClienteVI.Nombre = MappingProperties<string>(reader["Clientes"]);
                        r.Transportista.Nombre = MappingProperties<string>(reader["Chofer"]);
                        r.TipoMaterial.NombreTipoMaterial = MappingProperties<string>(reader["Material"]);
                        r.Vehiculo.Placa = MappingProperties<string>(reader["Auto"]);

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
        public ModelResponse GetViajeLocalById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@Id", id));

            try
            {
                var user = GetObject($"GetViajeLocalById", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeLocal>((reader) =>
                    {
                        var r = FillEntity<DtoViajeLocal>(reader);
                        r.UbicacionOrigen = new MinaTolEntidades.DtoCatalogos.DtoUbicacion()
                        {
                            Id = MappingProperties<long>(reader["UbicacionOrigenId"])
                        };
                        r.DireccionDestino = new MinaTolEntidades.DtoClientes.DireccionCliente()
                        {
                            Id = MappingProperties<long>(reader["DireccionDestinoId"])
                        };
                        r.TipoMaterial = new MinaTolEntidades.DtoCatalogos.DtoTipoMaterialUbicacion()
                        {
                            Id = MappingProperties<long>(reader["MaterialId"])
                        };
                        r.Transportista = new MinaTolEntidades.DtoSucursales.DtoTrabajador()
                        {
                            Id = MappingProperties<long>(reader["ChoferId"])
                        };
                        r.Vehiculo = new MinaTolEntidades.DtoClientes.Vehiculo()
                        {
                            Id = MappingProperties<long>(reader["VehiculoId"])
                        };
                        r.Cliente = new MinaTolEntidades.DtoClientes.Cliente()
                        {
                            Id = MappingProperties<long>(reader["ClienteId"])
                        };
                        r.UnidadMedida = new MinaTolEntidades.DtoSucursales.UnidadMedida()
                        {
                            Id = MappingProperties<long>(reader["UnidadId"])
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
        public ModelResponse GetAllViajeLocal()
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                var user = GetObjects($"GetAllViajeLocal", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeLocal>((reader) =>
                    {
                        var r = FillEntity<DtoViajeLocal>(reader);
                        r.UbicacionOrigen.NombreUbicacion = MappingProperties<string>(reader["Origen"]);
                        r.Transportista.Nombre = MappingProperties<string>(reader["Chofer"]);
                        r.TipoMaterial.NombreTipoMaterial = MappingProperties<string>(reader["Material"]);
                        r.Vehiculo.Placa = MappingProperties<string>(reader["Auto"]);
                        r.Cliente.Nombre = MappingProperties<string>(reader["ClienteNombre"]);

                        // CORRECCIÓN: Asignar TipoCliente directamente al DTO, no al cliente
                        r.Cliente.TipoCliente = MappingProperties<int>(reader["TipoCliente"]);

                        r.UnidadMedida.Nombre = MappingProperties<string>(reader["Unidad"]);

                        return r;
                    }));

                modelResponse.Response = user;
                modelResponse.IsSuccess = true; // Asegurar que IsSuccess sea true en caso de éxito
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse GetAllViajeLocalByDates(DateTime fecha1, DateTime fecha2)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                // Agregar los parámetros de fecha a la lista
                parameters.Add(new SqlParameter("@Fecha1", fecha1));
                parameters.Add(new SqlParameter("@Fecha2", fecha2));

                var user = GetObjects($"GetAllViajeLocalByDates", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeLocal>((reader) =>
                    {
                        var r = FillEntity<DtoViajeLocal>(reader);
                        r.UbicacionOrigen.NombreUbicacion = MappingProperties<string>(reader["Origen"]);
                        r.Transportista.Nombre = MappingProperties<string>(reader["Chofer"]);
                        r.TipoMaterial.NombreTipoMaterial = MappingProperties<string>(reader["Material"]);
                        r.Vehiculo.Placa = MappingProperties<string>(reader["Auto"]);
                        r.Cliente.Nombre = MappingProperties<string>(reader["ClienteNombre"]);
                        r.UnidadMedida.Nombre = MappingProperties<string>(reader["Unidad"]);

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
        public ModelResponse GetAllViajeLocalByDatesFacturado(DateTime fecha1, DateTime fecha2)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                // Agregar los parámetros de fecha a la lista
                parameters.Add(new SqlParameter("@Fecha1", fecha1));
                parameters.Add(new SqlParameter("@Fecha2", fecha2));

                var user = GetObjects($"GetAllViajeLocalByDatesFacturado", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeLocal>((reader) =>
                    {
                        var r = FillEntity<DtoViajeLocal>(reader);
                        r.UbicacionOrigen.NombreUbicacion = MappingProperties<string>(reader["Origen"]);
                        r.Transportista.Nombre = MappingProperties<string>(reader["Chofer"]);
                        r.TipoMaterial.NombreTipoMaterial = MappingProperties<string>(reader["Material"]);
                        r.Vehiculo.Placa = MappingProperties<string>(reader["Auto"]);
                        r.Cliente.Nombre = MappingProperties<string>(reader["ClienteNombre"]);
                        r.UnidadMedida.Nombre = MappingProperties<string>(reader["Unidad"]);

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
        public ModelResponse CheckPreFactura(long id, bool facturado)
        {
            var modelResponse = new ModelResponse();

            try
            {
                // Crear parámetros para el stored procedure
                var parameters = new[]
                {
                    new SqlParameter("@Id", id),
                    new SqlParameter("@Facturado", facturado)
                };

                var salarioId = ExecuteScalar($"CheckPreFactura", CommandType.StoredProcedure, parameters);

                modelResponse.IsSuccess = true;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse GetAllViajeLocalByDatesClientDireccion(DateTime fecha1, DateTime fecha2, long idCliente, long idDireccion)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();

            try
            {
                // Agregar los parámetros de fecha a la lista
                parameters.Add(new SqlParameter("@Fecha1", fecha1));
                parameters.Add(new SqlParameter("@Fecha2", fecha2));
                parameters.Add(new SqlParameter("@idCliente", idCliente));
                parameters.Add(new SqlParameter("@idDireccion", idDireccion));

                var user = GetObjects($"GetAllViajeLocalByDatesClientDireccion", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeLocal>((reader) =>
                    {
                        var r = FillEntity<DtoViajeLocal>(reader);
                        r.UbicacionOrigen.NombreUbicacion = MappingProperties<string>(reader["Origen"]);
                        r.Transportista.Nombre = MappingProperties<string>(reader["Chofer"]);
                        r.TipoMaterial.NombreTipoMaterial = MappingProperties<string>(reader["Material"]);
                        r.Vehiculo.Placa = MappingProperties<string>(reader["Auto"]);
                        r.Cliente.Nombre = MappingProperties<string>(reader["ClienteNombre"]);
                        r.UnidadMedida.Nombre = MappingProperties<string>(reader["Unidad"]);

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
        public ModelResponse GetViajeInternoById(long id)
        {
            var modelResponse = new ModelResponse();
            var parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@Id", id));

            try
            {
                var user = GetObject($"GetViajeInternoById", CommandType.StoredProcedure, parameters,
                    new Func<IDataReader, DtoViajeInterno>((reader) =>
                    {
                        var r = FillEntity<DtoViajeInterno>(reader);

                        r.UbicacionOrigen = new MinaTolEntidades.DtoCatalogos.DtoUbicacion()
                        {
                            Id = MappingProperties<long>(reader["UbicacionOrigenId"])
                        };
                        r.ClienteVI = new MinaTolEntidades.DtoClientes.Cliente()
                        {
                            Id = MappingProperties<long>(reader["ClienteId"])
                        };
                        r.TipoMaterial = new MinaTolEntidades.DtoCatalogos.DtoTipoMaterialUbicacion()
                        {
                            Id = MappingProperties<long>(reader["MaterialId"])
                        };
                        r.Transportista = new MinaTolEntidades.DtoSucursales.DtoTrabajador()
                        {
                            Id = MappingProperties<long>(reader["ChoferId"])
                        };
                        r.Vehiculo = new MinaTolEntidades.DtoClientes.Vehiculo()
                        {
                            Id = MappingProperties<long>(reader["VehiculoId"])
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
        public ModelResponse SaveOrUpdateViajeInterno(DtoViajeInterno vi)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var salarioId = ExecuteScalar($"SaveOrUpdateViajeInterno", CommandType.StoredProcedure, GenerateSQLParameters(vi));
                vi.Id = Convert.ToInt64(salarioId);

                modelResponse.Response = vi;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse SaveOrUpdateViajeLocal(DtoViajeLocal vi)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var salarioId = ExecuteScalar($"SaveOrUpdateViajeLocal", CommandType.StoredProcedure, GenerateSQLParameters(vi));
                vi.Id = Convert.ToInt64(salarioId);

                modelResponse.Response = vi;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse UpdateFoliador(string nombre)
        {
            var modelResponse = new ModelResponse();

            try
            {
                // Parámetros para el procedimiento almacenado UpdateFoliador
                var foliadorParameters = new List<SqlParameter>
        {
            new SqlParameter("@Nombre", SqlDbType.VarChar) { Value = nombre }
        };

                // Ejecuta el procedimiento almacenado
                ExecuteNonQuery("UpdateFoliador", CommandType.StoredProcedure, foliadorParameters);

                // Asigna un resultado de éxito
                modelResponse.IsSuccess = true;
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