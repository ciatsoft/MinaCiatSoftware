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
        private bool _isInternal;

        [JsonPropertyName("NombreUbicacion")]
        public string NameLocation => _nameLocation;
        [JsonPropertyName("DescripcionUbicacion")]
        public string DescriptionLocation => _descriptionLocation;
        [JsonPropertyName("EsInterna")]
        public bool IsInternal => _isInternal;

        private Location(long idLocation, string nameLocation, string descriptionLocation, bool isInternal, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = idLocation;
            _nameLocation = nameLocation;
            _descriptionLocation = descriptionLocation;
            _isInternal = isInternal;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        [JsonConstructor]
        public Location(long id, string nameLocation, string descriptionLocation, bool isInternal, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = id;
            _nameLocation = nameLocation;
            _descriptionLocation = descriptionLocation;
            _isInternal = isInternal;
            Estatus = estatus;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        public static Location Create(long idLocation, string nameLocation, string description, bool isInternal, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            return new Location(idLocation, nameLocation, description, isInternal, createdBy, createdDt, updatedBy, updatedDt);
        }

    }
}
