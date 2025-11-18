using SqlProxy;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalogs.Proxy
{
    public class CatalogsProxy : DbWrapper, ICatalogsProxy
    {
        public DataTable GetAllAreaTrabajo()
        {
            DataTable result = GetObject("GetAllAreaTrabajo", CommandType.StoredProcedure);
            return result;
        }

        public DataTable GetAreaTrabajoById(long id)
        {
            DataTable result = GetObject("GetAreaTrabajoById", CommandType.StoredProcedure);
            return result;
        }

        //
    }
}
