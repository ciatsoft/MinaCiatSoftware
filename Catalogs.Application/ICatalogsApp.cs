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
        List<WorkAreaObj> GetAllAreaTrabajo(out OperationResult result);
    }
}
