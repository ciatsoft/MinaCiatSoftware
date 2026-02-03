using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Catalogs.Domain
{
    public class LoansCatalog : Entity<long>
    {
        private long _idWorker;
        private string _nameWorker;
        private string _name;
        private string _description;
        private decimal _monto;
        private DateTime _date;
        private string _userName;

        [JsonPropertyName("IdTrabajador")]
        public long IdWorker => _idWorker;
        [JsonPropertyName("NombreTrabajador")]
        public string NameWorker => _nameWorker;
        [JsonPropertyName("Nombre")]
        public string Name => _name;
        [JsonPropertyName("Descripcion")]
        public string Description => _description;
        [JsonPropertyName("Monto")]
        public decimal Monto => _monto;
        [JsonPropertyName("Fecha")]
        public DateTime Date => _date;
        [JsonPropertyName("UsuarioName")]
        public string UserName => _userName;

        private LoansCatalog(long idLoansCatalog,long idWorker, string nameWorker, string name, string description, decimal monto, DateTime date, string userName, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = idLoansCatalog;
            _idWorker = idWorker;
            _nameWorker = nameWorker;
            _name = name;
            _description = description;
            _monto = monto;
            _date = date;
            _userName = userName;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        // Constructor para JSON
        [JsonConstructor]
        public LoansCatalog(long id, long idWorker, string nameWorker, string name, string description, decimal monto, DateTime date, string userName, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = id;
            _idWorker = idWorker;
            _nameWorker = nameWorker;
            _name = name;
            _description = description;
            _monto = monto;
            _date = date;
            _userName = userName;
            Estatus = estatus;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        public static LoansCatalog Create(long idLoanCatalog, long idWorker, string nameWorker, string name, string description, decimal monto, DateTime date, string userName, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            return new LoansCatalog(idLoanCatalog, idWorker, nameWorker, name, description, monto, date, userName, createdBy, createdDt, updatedBy, updatedDt);
        }
    }
}
