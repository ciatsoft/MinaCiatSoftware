using Catalogs.Domain;
using Common.Domain;

namespace Catalogs.Messages
{
    public class CatalogsMessages
    {
        
    }
    public class CatalogsResponse
    {
        public List<WorkAreaObj> WorksAreas { get; set; }
        public OperationResult Result { get; set; }
    }
}
