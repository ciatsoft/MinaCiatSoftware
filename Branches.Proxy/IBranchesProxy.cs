using Common.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Branches.Proxy
{
    public interface IBranchesProxy
    {
        #region UnitMeasurement
        DataTable GetAllUnitMeasurement();
        DataTable GetUnitMeasurementById(long id);
        int SaveOrUpdateUnitMeasurement(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt);
        int DeleteUnitMeasurement(int id);
        #endregion
    }
}
