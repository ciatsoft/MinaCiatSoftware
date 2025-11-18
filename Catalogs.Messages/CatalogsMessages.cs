using Catalogs.Domain;
using Common.Domain;

namespace Catalogs.Messages
{
    public class CatalogsMessages
    {
        
    }
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
}
