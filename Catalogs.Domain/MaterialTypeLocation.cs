using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Branches.Domain;
using System.Text.Json.Serialization;

namespace Catalogs.Domain
{
    public class MaterialTypeLocation : Entity<long>
    {
        private UnitMeasurement _unitMeasurement;
        private long? _unitMeasurementId;

        [JsonPropertyName("UbicacionId")]
        public long LocationId { get; private set; }

        [JsonPropertyName("MaterialId")]
        public long MaterialId { get; private set; }

        [JsonPropertyName("NombreTipoMaterial")]
        public string NameTypeMaterial { get; private set; }

        [JsonPropertyName("DescripcionTipoMaterial")]
        public string DescriptionTypeMaterial { get; private set; }

        [JsonPropertyName("UnidadMedidaID")]
        public long? UnitMeasurementId
        {
            get => _unitMeasurementId;
            set => _unitMeasurementId = value;
        }

        [JsonIgnore]
        public UnitMeasurement? UnitMeasurement => _unitMeasurement;

        // Constructor simplificado con parámetros en orden correcto
        public MaterialTypeLocation(
            long id,
            long locationId,
            long materialId,
            string nameTypeMaterial,
            string descriptionTypeMaterial,
            long? unitMeasurementId,
            bool estatus,
            string createdBy,
            DateTime createdDt,
            string updatedBy,
            DateTime updatedDt)
        {
            Id = id;
            LocationId = locationId;
            MaterialId = materialId;
            NameTypeMaterial = nameTypeMaterial ?? string.Empty;
            DescriptionTypeMaterial = descriptionTypeMaterial ?? string.Empty;
            _unitMeasurementId = unitMeasurementId;
            _unitMeasurement = null;
            Estatus = estatus;
            CreatedBy = createdBy ?? string.Empty;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy ?? string.Empty;
            UpdatedDt = updatedDt;
        }

        [JsonConstructor]
        public MaterialTypeLocation(
            long locationId,
            long materialId,
            string nameTypeMaterial,
            string descriptionTypeMaterial,
            UnitMeasurement unitMeasurement,
            bool estatus,
            string createdBy,
            DateTime createdDt,
            string updatedBy,
            DateTime updatedDt)
            : this(0, locationId, materialId, nameTypeMaterial, descriptionTypeMaterial,
                  unitMeasurement?.Id, estatus, createdBy, createdDt, updatedBy, updatedDt)
        {
            _unitMeasurement = unitMeasurement;
        }

        public void SetUnitMeasurement(UnitMeasurement unit)
        {
            _unitMeasurement = unit;
            _unitMeasurementId = unit?.Id;
        }
    }
}