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
        public long locationId { get; private set; }
        [JsonPropertyName("MaterialId")]
        public long materialId { get; private set; }
        [JsonPropertyName("NombreTipoMaterial")]
        public string nameTypeMaterial { get; private set; }
        [JsonPropertyName("DescripcionTipoMaterial")]
        public string descriptionTypeMaterial { get; private set; }

        [JsonPropertyName("UnidadMedidaID")]
        public long? UnitMeasureID => _unitMeasurementId ?? _unitMeasurement?.Id;

        [JsonIgnore]
        public UnitMeasurement? UnitMeasurement => _unitMeasurement;

        //[JsonConstructor]
        //public MaterialTypeLocation(
            
        //    )
    }
}
