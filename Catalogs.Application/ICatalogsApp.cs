using Catalogs.Domain;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalogs.Application
{
    public interface ICatalogsApp
    {
        #region WorkArea
        public List<WorkAreaObj> GetAllWorkArea(out OperationResult result);
        public WorkAreaObj GetWorkAreaById(long id, out OperationResult result);
        public void SaveOrUpdateWorkArea(long id, string name, string desciption, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeleteWorkArea(int id, out OperationResult result);
        #endregion

        #region Loans Catalog
        public List<LoansCatalog> GetAllLoansCatalog(out OperationResult result);
        public List<LoansCatalog> GetLoansCatalogByIdWorkerDates(long id, DateTime dateStart, DateTime dateEnd, out OperationResult result);
        public void SaveOrUpdateLoansCatalog(long idLoansCatalog, long idWorker, string nameWorker, string name, string description, decimal monto, DateTime date, string userName, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeleteLoansCatalog(int id, out OperationResult result);
        #endregion

        #region Location
        public List<Location> GetAllLocation(out OperationResult result);
        public List<Location> GetLocationById(long id, out OperationResult result);
        public void SaveOrUpdateLocation(long idLocation, string nameLocation, string description, bool isInternal, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeleteLocation(int id, out OperationResult result);
        #endregion

        #region Roll
        public List<RollObj> GetAllRoll(out OperationResult result);
        public RollObj GetRollById(long id, out OperationResult result);
        public void SaveOrUpdateRoll(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeleteRoll(int id, out OperationResult result);
        #endregion

        #region TypeExpense
        public List<TypeExpense> GetAllTypeExpense(out OperationResult result);
        public TypeExpense GetTypeExpenseById(long id, out OperationResult result);
        public void SaveOrUpdateTypeExpense(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeleteTypeExpense(int id, out OperationResult result);
        #endregion

        #region RolPermission
        public List<RolPermission> GetAllRolPermission(out OperationResult result);
        public RolPermission GetRolPermissionById(long id, out OperationResult result);
        public void SaveOrUpdateRolPermission(long id, long idRol, long permisoId, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeleteRolPermission(int id, int idRol, out OperationResult result);
        #endregion

        #region PaymentMethod
        public List<PaymentMethod> GetAllPaymentMethod(out OperationResult result);
        public List<PaymentMethod> GetPaymentMethodById(long id, out OperationResult result);
        public void SaveOrUpdatePaymentMethod(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeletePaymentMethod(int id, out OperationResult result);
        #endregion

        #region Permissions
        public List<Permissions> GetAllPermissions(out OperationResult result);
        public Permissions GetPermissionsById(long id, out OperationResult result);
        public void SaveOrUpdatePermissions(long id, string urlWindow, string name, string description, string typeMenu, long parentPermission, int order, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeletePermissions(int id, out OperationResult result);

        #endregion
    }
}
