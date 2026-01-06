using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Catalogs.Domain
{
    public class PaymentMethod : Entity<long>
    {
        private string _name;
        private string _description;

        [JsonPropertyName("Nombre")]
        public string Name => _name;
        [JsonPropertyName("Descripcion")]
        public string Description => _description;

        private PaymentMethod(long idPaymentMethod, string name, string description, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = idPaymentMethod;
            _name = name;
            _description = description;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        [JsonConstructor]
        public PaymentMethod(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
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

        public static PaymentMethod Create(long idPaymentMethod, string name, string description, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            return new PaymentMethod(idPaymentMethod, name, description, createdBy, createdDt, updatedBy, updatedDt);
        }
    }
}
