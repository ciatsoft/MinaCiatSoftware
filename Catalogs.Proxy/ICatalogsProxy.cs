using Common.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalogs.Proxy
{
    public interface ICatalogsProxy
    {
        #region WorkArea
        DataTable GetAllWorkArea();
        DataTable GetWorkAreaById(long id);
        int SaveOrUpdateWorkArea(long id, string nombre, string descripcion, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt);
        int DeleteWorkArea(long id);
        #endregion

        #region LoansCatalog
        DataTable GetAllLoansCatalog();
        DataTable GetLoansCatalogByIdWorkerDates(long id, DateTime dateStart, DateTime dateEnd);
        int SaveOrUpdateLoansCatalog(long idLoansCatalog, long idWorker, string nameWorker, string name, string description, decimal monto, DateTime date, string userName, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, bool estatus);
        int DeleteLoansCatalog(long id);
        #endregion

        #region Location
        DataTable GetAllLocation();
        DataTable GetLocationById(long id);
        int SaveOrUpdateLocation(long idLocation, string nameLocation, string description, bool isInternal, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt);
        int DeleteLocation(long id);
        #endregion

        #region Roll
        DataTable GetAllRoll();
        DataTable GetRollById(long id);
        int SaveOrUpdateRoll(long idRol, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt);
        int DeleteRoll(long id);
        #endregion

        #region TypeExpense
        DataTable GetAllTypeExpense();
        DataTable GetTypeExpenseById(long id);
        int SaveOrUpdateTypeExpense(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt);
        int DeleteTypeExpense(long id);
        #endregion

        #region RolPermission
        DataTable GetAllRolPermission();
        DataTable GetRolPermissionById(long id);
        int SaveOrUpdateRolPermission(long id, long idRol, long permisoId, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt);
        int DeleteRolPermission(long id, long idRol);
        #endregion

        #region PaymentMethod
        DataTable GetAllPaymentMethod();
        DataTable GetPaymentMethodById(long id);
        int SaveOrUpdatePaymentMethod(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt);
        int DeletePaymentMethod(long id);
        #endregion
    }
}
