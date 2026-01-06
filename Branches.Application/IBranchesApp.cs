using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Domain;
using Branches.Domain;

namespace Branches.Application
{
    public interface IBranchesApp
    {
        #region UnitMeasurement
        public List<UnitMeasurement> GetAllUnitMeasurement(out OperationResult result);
        public UnitMeasurement GetUnitMeasurementById(long id, out OperationResult result);
        public void SaveOrUpdateUnitMeasurement(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result);
        public void DeleteUnitMeasurement(int id, out OperationResult result);
        #endregion
    }
}
