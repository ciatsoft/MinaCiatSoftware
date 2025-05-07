using MinaTolEntidades;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoViajes;
using MinaTolEntidades.DtoVentaPublicoGeneral;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoVentas;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse SaveOrUpdatePV_Precio(PV_Precio p)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(p);
                var result = ExecuteScalar("SaveOrUpdatePV_Precio", System.Data.CommandType.StoredProcedure, parameters);
                p.Id = Convert.ToInt64(result);

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
        public ModelResponse GetAllPV_Precio()
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = new List<SqlParameter>();
                var result = GetObjects("GetAllPV_Precio", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Precio>((reader) =>
                    {
                        var r = FillEntity<PV_Precio>(reader);
                        return r;
                    }));
                response.Response = result;

            }
            catch (Exception ex )
            {
                response.IsSuccess = false;
                response.Message = ex.Message;
                response.Enum = Enumeration.ErrorNoControlado;
            }
            return response;

        }
        public ModelResponse GetPV_PrecioById(int id)
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

                var result = GetObject("GetPV_PrecioById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, PV_Precio>((reader) =>
                    {
                        var r = FillEntity<PV_Precio>(reader);
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
<<<<<<< HEAD


        public ModelResponse GetPV_PrecioByPV_Material(long id)
=======
        public ModelResponse GetPV_PrecioByMaterial(long id)
>>>>>>> DEV
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
<<<<<<< HEAD
                    ParameterName = "@Material",
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                var result = GetObjects("GetPV_PrecioByPV_Material", System.Data.CommandType.StoredProcedure,
=======
                    ParameterName = "@Id",
                    SqlDbType = System.Data.SqlDbType.BigInt
                });

                var result = GetObjects("GetPV_PrecioByMaterialId", System.Data.CommandType.StoredProcedure,
>>>>>>> DEV
                    parameters, new Func<System.Data.IDataReader, PV_Precio>((reader) =>
                    {
                        var r = FillEntity<PV_Precio>(reader);
                        r.Material = new PV_Material()
                        {
<<<<<<< HEAD
                            Id = MappingProperties<long>(reader["Material"])
=======
                            Id = MappingProperties<long>(reader["MaterialId"])
>>>>>>> DEV
                        };
                        
                        return r;
                    }));

<<<<<<< HEAD
                foreach (var i in result)
                {
                    i.Material = (PV_Material)GetPV_PrecioByPV_Material(i.Id).Response;
=======
                //foreach (var i in result)
                //{
                //    i.Material = (PV_Material)GetPV_PrecioByMaterial(i.Id).Response;
>>>>>>> DEV
                    
                //}

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