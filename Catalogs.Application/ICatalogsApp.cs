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
        public List<WorkAreaObj> GetAllWorkArea(out OperationResult result);
        public WorkAreaObj GetWorkAreaById(long id, out OperationResult result);
        public void SaveOrUpdateWorkArea(int id, string name, string desciption, out OperationResult result);
    }
}
