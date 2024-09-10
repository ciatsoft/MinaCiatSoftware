﻿using MinaTolEntidades.Security;
using MinaTolEntidades;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using MinaTolEntidades.DtoCatalogos;

namespace MinaTolWebApi.DAL
{
    public partial class DbWrapper
    {
        public ModelResponse GetAllAreaTrabajo()
        {
            var modelResponse = new ModelResponse();

            try
            {
                var result = GetObjects($"GetAllAreaTrabajo", CommandType.StoredProcedure, null,
                    new Func<IDataReader, DtoAreaTrabajo>((reader) =>
                    {
                        var r = FillEntity<DtoAreaTrabajo>(reader);

                        return r;
                    }));

                modelResponse.Response = result;
            }
            catch (Exception ex)
            {
                modelResponse.IsSuccess = false;
                modelResponse.Enum = Enumeration.ErrorNoControlado;
                modelResponse.Message = ex.Message;
            }

            return modelResponse;
        }

        public ModelResponse SaveOrUpdateAreaTrabajo(DtoAreaTrabajo a)
        {
            var response = new ModelResponse();
            try
            {
                response.IsSuccess = true;
                var parameters = GenerateSQLParameters(a);
                var result = GetObject("SaveOrUpdateAreaTrabajo", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoAreaTrabajo>((reader) =>
                    {
                        var r = FillEntity<DtoAreaTrabajo>(reader);
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
        public ModelResponse GetAreaTrabajoById(int id)
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

                var result = GetObject("GetAreaTrabajoById", System.Data.CommandType.StoredProcedure,
                    parameters, new Func<System.Data.IDataReader, DtoAreaTrabajo>((reader) =>
                    {
                        var r = FillEntity<DtoAreaTrabajo>(reader);
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
    }
}