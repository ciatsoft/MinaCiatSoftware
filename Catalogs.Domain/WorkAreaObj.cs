using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Catalogs.Domain
{
    public class WorkAreaObj : Entity<long>
    {
        private string _name;
        private string _description;

        [JsonPropertyName("Descripcion")]
        public string Description => _description;
        [JsonPropertyName("Nombre")]
        public string Name => _name;

        private WorkAreaObj(long workAreaId, string name, string description, string createdBy, string updatedBy)
        {
            Id = workAreaId;
            _name = name;
            _description = description;
            CreatedBy = createdBy;
            CreatedDt = DateTime.UtcNow;
            UpdatedBy = updatedBy;
            UpdatedDt = DateTime.UtcNow;
        }
        public static WorkAreaObj Create(long workAreaId, string name, string description, string createdBy, string updatedBy)
        {
            return new WorkAreaObj(workAreaId, name, description, createdBy, updatedBy);
        }
    }
}
