using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    public class OperationResult
    {
        public OperationResult()
        {
            SystemMessages = new List<SystemMessage>();
        }

        public bool Successful { get; set; }

        public List<SystemMessage> SystemMessages { get; set; }

        public IEnumerable<object> GetAttributesToIncludeInEqualityCheck()
        {
            return new List<object>
            {
                SystemMessages
            };
        }
    }
}
