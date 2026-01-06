using SqlProxy;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Branches.Proxy
{
    public class BranchesProxy : DbWrapper, IBranchesProxy
    {
        #region UnitMeasurement
        public DataTable GetAllUnitMeasurement()
        {
            DataTable result = GetObject("GetAllUnidadMedida", CommandType.StoredProcedure);
            return result;
        }
        public DataTable GetUnitMeasurementById(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id),
            };

            DataTable result = GetObject("GetUnidadMedidaById", CommandType.StoredProcedure, parameter);
            return result;
        }
        public int SaveOrUpdateUnitMeasurement(long id, string nombre, string descripcion, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", id),
                new SqlParameter("@Nombre", nombre),
                new SqlParameter("@Descripcion", descripcion),
                new SqlParameter("@Estatus", estatus),
                new SqlParameter("@CreatedBy", createdBy),
                new SqlParameter("@CreatedDt", createdDt),
                new SqlParameter("@UpdatedBy", createdBy),
                new SqlParameter("@UpdatedDt", createdDt)
            };

            var result = ExecuteScalar("SaveOrUpdateUnidadMedida", CommandType.StoredProcedure, parameters);
            return Convert.ToInt32(result);
        }
        public int DeleteUnitMeasurement(int id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id)
            };

            var result = ExecuteScalar("DeleteUnidadMedida", CommandType.StoredProcedure, parameter);
            return Convert.ToInt32(result);
        }
        #endregion
    }
}
