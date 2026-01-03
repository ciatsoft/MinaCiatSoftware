using SqlProxy;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        public int SaveOrUpdateLoansCatalog(long idLoansCatalog, long idWorker, string nameWorker, string name, string description, decimal monto, DateTime date, string userName, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, bool estatus)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", idLoansCatalog),
                new SqlParameter("@Nombre", name),
                new SqlParameter("@Descripcion", description),
                new SqlParameter("@Monto", monto),
                new SqlParameter("@Fecha", date),
                new SqlParameter("@UsuarioName", userName),
                new SqlParameter("@IdTrabajador", idWorker),
                new SqlParameter("@NombreTrabajador", nameWorker),
                new SqlParameter("@Estatus", estatus),
                new SqlParameter("@CreatedBy", createdBy),
                new SqlParameter("@CreatedDt", createdDt),
                new SqlParameter("@UpdatedBy", createdBy),
                new SqlParameter("@UpdatedDt", createdDt)
            };

            var result = ExecuteScalar("SaveOrUpdatePrestamos", CommandType.StoredProcedure, parameters);
            return Convert.ToInt32(result);
        }
        public int DeleteLoansCatalog(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id)
            };

            var result = ExecuteScalar("DeletePrestamos", CommandType.StoredProcedure, parameter);
            return Convert.ToInt32(result);
        }

        #endregion

        #region Roll
        public DataTable GetAllRoll()
        {
            DataTable result = GetObject("GetAllRoll", CommandType.StoredProcedure);
            return result;
        }

        public DataTable GetRollById(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id),
            };

            DataTable result = GetObject("GetRollById", CommandType.StoredProcedure, parameter);
            return result;
        }

        public int SaveOrUpdateRoll(long idRol, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", idRol),
                new SqlParameter("@Nombre", name),
                new SqlParameter("@Descripcion", description),
                new SqlParameter("@Estatus", estatus),
                new SqlParameter("@CreatedBy", createdBy),
                new SqlParameter("@CreatedDt", createdDt),
                new SqlParameter("@UpdatedBy", createdBy),
                new SqlParameter("@UpdatedDt", createdDt)
            };

            var result = ExecuteScalar("SaveOrUpdateRoll", CommandType.StoredProcedure, parameters);
            return Convert.ToInt32(result);
        }

        public int DeleteRoll(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id)
            };

            var result = ExecuteScalar("DeleteRoll", CommandType.StoredProcedure, parameter);
            return Convert.ToInt32(result);
        }
        #endregion

        #region TypeExpense
        public DataTable GetAllTypeExpense()
        {
            DataTable result = GetObject("GetAllTipoGastos", CommandType.StoredProcedure);
            return result;
        }
        public DataTable GetTypeExpenseById(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id),
            };

            DataTable result = GetObject("GetTipoGastosById", CommandType.StoredProcedure, parameter);
            return result;
        }

        public int SaveOrUpdateTypeExpense(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", id),
                new SqlParameter("@Nombre", name),
                new SqlParameter("@Descripcion", description),
                new SqlParameter("@Estatus", estatus),
                new SqlParameter("@CreatedBy", createdBy),
                new SqlParameter("@CreatedDt", createdDt),
                new SqlParameter("@UpdatedBy", createdBy),
                new SqlParameter("@UpdatedDt", createdDt)
            };

            var result = ExecuteScalar("SaveOrUpdateTipoGastos", CommandType.StoredProcedure, parameters);
            return Convert.ToInt32(result);
        }

        public int DeleteTypeExpense(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id)
            };

            var result = ExecuteScalar("DeleteTipoGastos", CommandType.StoredProcedure, parameter);
            return Convert.ToInt32(result);
        }
        #endregion

        #region RolPermission
        public DataTable GetAllRolPermission()
        {
            DataTable result = GetObject("GetAllTipoGastos", CommandType.StoredProcedure);
            return result;
        }
        public DataTable GetRolPermissionById(long id)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id),
            };

            DataTable result = GetObject("GetPermisosByIdRol", CommandType.StoredProcedure, parameter);
            return result;
        }
        public int SaveOrUpdateRolPermission(long id, long idRol, long permisoId,bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            var parameters = new[]
            {
                new SqlParameter("@Id", id),
                new SqlParameter("@IdRol", idRol),
                new SqlParameter("@PermisoId", permisoId),
                new SqlParameter("@Estatus", estatus),
                new SqlParameter("@CreatedBy", createdBy),
                new SqlParameter("@CreatedDt", createdDt),
                new SqlParameter("@UpdatedBy", createdBy),
                new SqlParameter("@UpdatedDt", createdDt)
            };

            var result = ExecuteScalar("SaveOrUpdatePermisosRol", CommandType.StoredProcedure, parameters);
            return Convert.ToInt32(result);
        }
        public int DeleteRolPermission(long id, long idRol)
        {
            var parameter = new[]
            {
                new SqlParameter("@Id", id),
                new SqlParameter("@IdRol", idRol)
            };

            var result = ExecuteScalar("DeletePermiso", CommandType.StoredProcedure, parameter);
            return Convert.ToInt32(result);
        }
        #endregion
    }
}
