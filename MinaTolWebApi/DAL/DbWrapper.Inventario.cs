using MinaTolEntidades;
using MinaTolEntidades.DtoTaller;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using MinaTolEntidades.DtoVentas;
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
        #region Inventario
        public ModelResponse SaveOrUpdateInventario(Inventario u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateInventario", CommandType.StoredProcedure, GenerateSQLParameters(u));
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

        public ModelResponse GetAllInventario()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllInventario", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Inventario>((reader) =>
                    {
                        var r = FillEntity<Inventario>(reader);
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
        public ModelResponse GetInventarioById(long id)
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

                var result = GetObject("GetInventarioById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Inventario>((reader) =>
                    {
                        var r = FillEntity<Inventario>(reader);
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
        public ModelResponse DeleteInventarioById(long id)
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

                var result = ExecuteNonQuery("DeleteInventarioById", System.Data.CommandType.StoredProcedure, parameters);
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
        #region CategoriaInventario
        public ModelResponse SaveOrUpdateCategoriaInventario(CategoriaInventario u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateCategoriaInventario", CommandType.StoredProcedure, GenerateSQLParameters(u));
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

        public ModelResponse GetAllCategoriaInventario()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllCategoriaInventario", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, CategoriaInventario>((reader) =>
                    {
                        var r = FillEntity<CategoriaInventario>(reader);
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
        public ModelResponse GetCategoriaInventarioById(long id)
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

                var result = GetObject("GetCategoriaInventarioById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, CategoriaInventario>((reader) =>
                    {
                        var r = FillEntity<CategoriaInventario>(reader);
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
        public ModelResponse DeleteCategoriaInventarioById(long id)
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

                var result = ExecuteNonQuery("DeleteCategoriaInventarioById", System.Data.CommandType.StoredProcedure, parameters);
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
        #region ComponenteInventario
        public ModelResponse SaveOrUpdateComponenteVehiculo(ComponenteVehiculo u)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateComponenteVehiculo", CommandType.StoredProcedure, GenerateSQLParameters(u));
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

        public ModelResponse GetAllComponenteVehiculo()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllComponenteVehiculo", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ComponenteVehiculo>((reader) =>
                    {
                        var r = FillEntity<ComponenteVehiculo>(reader);
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

        public ModelResponse GetAllPiezasAsignadasReparacionByIdVehiculo(int tipoVehiculo, long idVehiculo, long idReparacion)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = idVehiculo,
                    IsNullable = true,
                    ParameterName = "@IdVehiculo",
                    SqlDbType = System.Data.SqlDbType.Int
                });
                parameters.Add(new SqlParameter()
                {
                    Value = tipoVehiculo,
                    IsNullable = true,
                    ParameterName = "@TipoVehiculo",
                    SqlDbType = System.Data.SqlDbType.Int
                });
                parameters.Add(new SqlParameter()
                {
                    Value = idReparacion,
                    IsNullable = true,
                    ParameterName = "@IdReparacion",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = GetObjects("GetAllPiezasAsignadasReparacionByIdVehiculo", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ComponenteVehiculo>((reader) =>
                    {
                        var r = FillEntity<ComponenteVehiculo>(reader);
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

        public ModelResponse GetAsignarPiezaVehiculoReparacionById(long id)
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

                var result = GetObject("GetAsignarPiezaVehiculoReparacionById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ComponenteVehiculo>((reader) =>
                    {
                        var r = FillEntity<ComponenteVehiculo>(reader);
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

        public ModelResponse DeleteComponenteVehiculoById(long id)
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

                var result = ExecuteNonQuery("DeleteComponenteVehiculoById", System.Data.CommandType.StoredProcedure, parameters);
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
        #region ReparacionVehiculos
        public ModelResponse SaveOrUpdateReparacionVehiculos(ReparacionVehiculos rv)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateReparacionVehiculos", CommandType.StoredProcedure, GenerateSQLParameters(rv));
                rv.Id = Convert.ToInt64(userID);

                modelResponse.Response = rv;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse GetAllReparacionVehiculos()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllReparacionVehiculos", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ReparacionVehiculos>((reader) =>
                    {
                        var r = FillEntity<ReparacionVehiculos>(reader);
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
        public ModelResponse GetReparacionVehiculosById(long id)
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

                var result = GetObject("GetReparacionVehiculosById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ReparacionVehiculos>((reader) =>
                    {
                        var r = FillEntity<ReparacionVehiculos>(reader);
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
        public ModelResponse DeleteReparacionVehiculosById(long id, long idVehiculo, int tipoVehiculo)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>();
                // Corrección: Crear cada parámetro individualmente
                parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id,
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                parameters.Add(new SqlParameter()
                {
                    ParameterName = "@IdVehiculo",
                    Value = idVehiculo,
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TipoVehiculo",
                    Value = tipoVehiculo,
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = ExecuteNonQuery("DeleteReparacionVehiculosById", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }
        public ModelResponse LiberarVehiculo(long id, long idVehiculo, int tipoVehiculo)
        {
            var response = new ModelResponse();
            try
            {
                var parameters = new List<SqlParameter>();

                // Corrección: Crear cada parámetro individualmente
                parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id,
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                parameters.Add(new SqlParameter()
                {
                    ParameterName = "@IdVehiculo",
                    Value = idVehiculo,
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TipoVehiculo",
                    Value = tipoVehiculo,
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = ExecuteNonQuery("LiberarVehiculo", System.Data.CommandType.StoredProcedure, parameters);

                response.IsSuccess = true;
                response.Message = "Vehículo liberado correctamente";
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }
        public ModelResponse GetAllRegistersReparacionVehiculos()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllRegistersReparacionVehiculos", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, ReparacionVehiculos>((reader) =>
                    {
                        var r = FillEntity<ReparacionVehiculos>(reader);
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
        #region RetirarPiezaVehiculoReparacion
        public ModelResponse SaveOrUpdateRetirarPiezaVehiculoReparacion(RetirarPiezaVehiculoReparacion rv)
        {
            var modelResponse = new ModelResponse();

            try
            {
                var userID = ExecuteScalar($"SaveOrUpdateRetirarPiezaVehiculoReparacion", CommandType.StoredProcedure, GenerateSQLParameters(rv));
                rv.Id = Convert.ToInt64(userID);

                modelResponse.Response = rv;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }
        public ModelResponse GetAllRetirarPiezaVehiculoReparacion()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllRetirarPiezaVehiculoReparacion", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, RetirarPiezaVehiculoReparacion>((reader) =>
                    {
                        var r = FillEntity<RetirarPiezaVehiculoReparacion>(reader);
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
        public ModelResponse GetRetirarPiezaVehiculoReparacionById(long id)
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

                var result = GetObject("GetRetirarPiezaVehiculoReparacionById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, RetirarPiezaVehiculoReparacion>((reader) =>
                    {
                        var r = FillEntity<RetirarPiezaVehiculoReparacion>(reader);
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
        public ModelResponse DeleteRetirarPiezaVehiculoReparacionById(long id)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;

                var parameters = new List<SqlParameter>();
                // Corrección: Crear cada parámetro individualmente
                parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id,
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                var result = ExecuteNonQuery("DeleteRetirarPiezaVehiculoReparacionById", System.Data.CommandType.StoredProcedure, parameters);
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }

            return response;
        }
        public ModelResponse GetAllRetirarPiezaVehiculoReparacionByIdVehiculo(int tipoVehiculo, long idVehiculo, long idReparacion)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = idVehiculo,
                    IsNullable = true,
                    ParameterName = "@IdVehiculo",
                    SqlDbType = System.Data.SqlDbType.Int
                });
                parameters.Add(new SqlParameter()
                {
                    Value = tipoVehiculo,
                    IsNullable = true,
                    ParameterName = "@TipoVehiculo",
                    SqlDbType = System.Data.SqlDbType.Int
                });
                parameters.Add(new SqlParameter()
                {
                    Value = idReparacion,
                    IsNullable = true,
                    ParameterName = "@IdReparacion",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = GetObjects("GetAllRetirarPiezaVehiculoReparacionByIdVehiculo", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, RetirarPiezaVehiculoReparacion>((reader) =>
                    {
                        var r = FillEntity<RetirarPiezaVehiculoReparacion>(reader);
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
        #region AsignarPiezas
        public ModelResponse GetAllInventarioReutilizableByCategoria(long categoriaInventario)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = categoriaInventario,
                    IsNullable = true,
                    ParameterName = "@CategoriaInventario",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = GetObjects("GetAllInventarioReutilizableByCategoria", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, RetirarPiezaVehiculoReparacion>((reader) =>
                    {
                        var r = FillEntity<RetirarPiezaVehiculoReparacion>(reader);
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
        public ModelResponse GetAllInventarioByCategoria(long categoriaInventario)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter()
                {
                    Value = categoriaInventario,
                    IsNullable = true,
                    ParameterName = "@CategoriaInventario",
                    SqlDbType = System.Data.SqlDbType.Int
                });

                var result = GetObjects("GetAllInventarioByCategoria", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, Inventario>((reader) =>
                    {
                        var r = FillEntity<Inventario>(reader);
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