using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Domain
{
    public class SystemMessage
    {
        public SystemMessage()
        {
            MessageType = SystemMessageTypes.Information;
            Message = string.Empty;
        }

        public SystemMessageTypes MessageType { get; set; }
        public string Message { get; set; }

        public IEnumerable<object> GetAttributesToIncludeInEqualityCheck()
        {
            return new List<object>
            {
                MessageType,
                Message
            };
        }
    }

    public enum SystemMessageTypes
    {
        Information = 0, Warning, Error
    }
}
