using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    public class BaseObjectEntity
    {
        public bool Estatus { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDt { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime UpdatedDt { get; set; }

        public BaseObjectEntity()
        {
            Estatus = true;
            CreatedBy = string.Empty;
            CreatedDt = DateTime.UtcNow;
            UpdatedBy = string.Empty;
        }
    }
}
