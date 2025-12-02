using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Catalogs.Domain
{
    public class Location : Entity<long>
    {
        private string _nameLocation;
        private string _descriptionLocation;
        private bool _internal;

        [JsonPropertyName("NombreUbicacion")]
        public string Name => _nameLocation;
        [JsonPropertyName("DescripcionUbicacion")]
        public string DescriptionLocation => _descriptionLocation;
        [JsonPropertyName("EsInterna")]
        public bool Internal => _internal;

        private Location(long idLocation, string nameLocation, string description, bool isInternal, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = idLocation;
            _nameLocation = nameLocation;
            _descriptionLocation = description;
            _internal = isInternal;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

    }
}
