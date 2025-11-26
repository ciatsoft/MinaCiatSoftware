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
    #endregion
}
