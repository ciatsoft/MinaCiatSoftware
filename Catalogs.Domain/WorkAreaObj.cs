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

        private WorkAreaObj(long workAreaId, string name, string description, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = workAreaId;
            _name = name;
            _description = description;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        // Constructor para JSON
        [JsonConstructor]
        public WorkAreaObj(long id, string name, string description, bool estatus,
                          string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = id;
            _name = name;
            _description = description;
            Estatus = estatus;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        public static WorkAreaObj Create(long workAreaId, string name, string description, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            return new WorkAreaObj(workAreaId, name, description, createdBy, createdDt, updatedBy, updatedDt);
        }
    }
}
