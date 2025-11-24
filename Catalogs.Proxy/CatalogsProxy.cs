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
        public DataTable GetAllWorkArea()
        {
            DataTable result = GetObject("GetAllAreaTrabajo", CommandType.StoredProcedure);
            return result;
        }

        public DataTable GetWorkAreaById(long id)
        {
            DataTable result = GetObject("GetAreaTrabajoById", CommandType.StoredProcedure);
            return result;
        }

        public int SaveOrUpdateWorkArea(long id, string nombre, string descripcion)
        {
            var result = ExecuteScalar("SaveOrUpdateAreaTrabajo", CommandType.StoredProcedure);
            return Convert.ToInt32(result);
        }
    }
}
