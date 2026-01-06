using Branches.Domain;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Branches.Messages
{
    public class BranchesMessages
    {
    }
    #region UnitMeasurement
    public class UnitMeasurementListResponse
    {
        public List<UnitMeasurement> UnitMeasurement { get; set; }
        public OperationResult Result { get; set; }
    }
    public class UnitMeasurementResponse
    {
        public UnitMeasurement UnitMeasurement { get; set; }
        public OperationResult Result { get; set; }
    }
    public class SaveOrUpdateUnitMeasurementResponse
    {
        public OperationResult Result { get; set; }
    }
    public class DeleteUnitMeasurementResponse
    {
        public OperationResult Result { get; set; }
    }
    #endregion
}
