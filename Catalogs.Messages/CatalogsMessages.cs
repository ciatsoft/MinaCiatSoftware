using Catalogs.Domain;
using Common.Domain;

namespace Catalogs.Messages
{
    public class CatalogsMessages
    {
        
    }

    #region WorkArea
    public class WorkAreaObjListResponse
    {
        public List<WorkAreaObj> WorksAreas { get; set; }
        public OperationResult Result { get; set; }
    }
    public class WorkAreaObjResponse
    {
        public WorkAreaObj WorksAreas { get; set; }
        public OperationResult Result { get; set; }
    }
    public class SaveOrUpdateWorkAreaResponse
    {
        public OperationResult Result { get; set; }
    }
    public class DeleteWorkAreaResponse
    {
        public OperationResult Result { get; set; }
    }
    #endregion

    #region LoansCatalog
    public class LoansCatalogListResponse
    {
        public List<LoansCatalog> LoansCatalog { get; set; }
        public OperationResult Result { get; set; }
    }
    public class LoansCatalogResponse
    {
        public List<LoansCatalog> LoansCatalog { get; set; }
        public OperationResult Result { get; set; }
    }
    public class SaveOrUpdateLoansCatalogResponse
    {
        public OperationResult Result { get; set; }
    }
    public class DeleteLoansCatalogResponse
    {
        public OperationResult Result { get; set; }
    }
    #endregion

    #region Roll
    public class RollListResponse
    {
        public List<RollObj> Roll { get; set; }
        public OperationResult Result { get; set; }
    }
    public class RollResponse
    {
        public RollObj Roll { get; set; }
        public OperationResult Result { get; set; }
    }
    public class SaveOrUpdateRollResponse
    {
        public OperationResult Result { get; set; }
    }
    public class DeleteRollResponse
    {
        public OperationResult Result { get; set; }
    }
    #endregion

    #region TypeExpense
    public class TypeExpenseListResponse
    {
        public List<TypeExpense> TypeExpense { get; set; }
        public OperationResult Result { get; set; }
    }
    public class TypeExpenseResponse
    {
        public TypeExpense TypeExpense { get; set; }
        public OperationResult Result { get; set; }
    }
    public class SaveOrUpdateTypeExpenseResponse
    {
        public OperationResult Result { get; set; }
    }
    public class DeleteTypeExpenseResponse
    {
        public OperationResult Result { get; set; }
    }
    #endregion

    #region RolPermission
    public class RolPermissionListResponse
    {
        public List<RolPermission> RolPermissions { get; set; }
        public OperationResult Result { get; set; }
    }
    public class RolPermissionResponse
    {
        public RolPermission RolPermission { get; set; }
        public OperationResult Result { get; set; }
    }
    public class SaveOrUpdateRolPermissionResponse
    {
        public OperationResult Result { get; set; }
    }
    public class DeleteRolPermissionResponse
    {
        public OperationResult Result { get; set; }
    }
    #endregion

    #region PaymentMethod
    public class PaymentMethodListResponse
    {
        public List<PaymentMethod> PaymentMethod { get; set; }
        public OperationResult Result { get; set; }
    }
    public class PaymentMethodResponse
    {
        public List<PaymentMethod> PaymentMethod { get; set; }
        public OperationResult Result { get; set; }
    }
    public class SaveOrUpdatePaymentMethodResponse
    {
        public OperationResult Result { get; set; }
    }
    public class DeletePaymentMethodResponse
    {
        public OperationResult Result { get; set; }
    }
    #endregion

}
