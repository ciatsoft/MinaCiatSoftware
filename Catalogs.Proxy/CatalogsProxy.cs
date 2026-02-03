using SqlProxy;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalogs.Proxy
{
    public class CatalogsProxy : DbWrapper, ICatalogsProxy
    {
        #region WorkArea
        public DataTable GetAllWorkArea()
        {
            DataTable result = GetObject("GetAllAreaTrabajo", CommandType.StoredProcedure);
            return result;
        }

        public DataTable GetWorkAreaById(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id),
            };

            DataTable result = GetObject("GetAreaTrabajoById", CommandType.StoredProcedure, parameter);
            return result;
        }

        public int SaveOrUpdateWorkArea(long id, string nombre, string descripcion, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
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

            var result = ExecuteScalar("SaveOrUpdateAreaTrabajo", CommandType.StoredProcedure, parameters);
            return Convert.ToInt32(result);
        }

        public int DeleteWorkArea(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id)
            };
            
            var result = ExecuteScalar("DeleteAreaTrabajo", CommandType.StoredProcedure, parameter);
            return Convert.ToInt32(result);
        }
        #endregion

        #region LoansCatalog
        public DataTable GetAllLoansCatalog()
        {
            DataTable result = GetObject("GetAllPrestamos", CommandType.StoredProcedure);
            return result;
        }
        public DataTable GetLoansCatalogByIdWorkerDates(long id, DateTime dateStart, DateTime dateEnd)
        {
            var parameter = new[]
            {
                new SqlParameter("@IdTrabajador", id),
                new SqlParameter("@FechaInicio", dateStart),
                new SqlParameter("@FechaFin", dateEnd),
            };

            DataTable result = GetObject("GetAllPrestamosByIdEmpleadoDates", CommandType.StoredProcedure, parameter);
            return result;
        }
        #endregion
    }
}
