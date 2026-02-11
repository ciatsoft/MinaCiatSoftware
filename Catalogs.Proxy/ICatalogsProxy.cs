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
        #region WorkArea
        DataTable GetAllWorkArea();
        DataTable GetWorkAreaById(long id);
        int SaveOrUpdateWorkArea(long id, string nombre, string descripcion, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt);
        int DeleteWorkArea(long id);
        #endregion

        #region LoansCatalog
        DataTable GetAllLoansCatalog();
        DataTable GetLoansCatalogByIdWorkerDates(long id, DateTime dateStart, DateTime dateEnd);
        #endregion
    }
}
