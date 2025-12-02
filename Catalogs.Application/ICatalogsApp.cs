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
    }
}
