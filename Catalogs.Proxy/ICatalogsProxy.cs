using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Catalogs.Proxy
{
    public interface ICatalogsProxy
    {
        DataTable GetAllWorkArea();
        DataTable GetWorkAreaById(long id);
        int SaveOrUpdateWorkArea(long id, string nombre, string descripcion);
    }
}
