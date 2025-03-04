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