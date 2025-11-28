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
    #endregion
}
