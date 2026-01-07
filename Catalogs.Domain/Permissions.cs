using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Catalogs.Domain
{
    public class Permissions : Entity<long>
    {
        private Permissions _parentPermission;
        private long? _parentPermissionId;

        [JsonPropertyName("URLVentana")]
        public string URLWindow { get; private set; }

        [JsonPropertyName("Nombre")]
        public string Name { get; private set; }

        [JsonPropertyName("Descripcion")]
        public string Description { get; private set; }

        [JsonPropertyName("TipoMenu")]
        public string TypeMenu { get; private set; }

        [JsonPropertyName("PermisoPadreId")]
        public long? ParentPermissionId => _parentPermissionId ?? _parentPermission?.Id;

        [JsonPropertyName("Orden")]
        public int Order { get; private set; }

        [JsonIgnore]
        public Permissions? ParentPermission => _parentPermission;

        [JsonConstructor]
        public Permissions(
            long id,
            string URLWindow,
            string name,
            string description,
            string typeMenu,
            Permissions parentPermission,
            int order,
            bool estatus,
            string createdBy,
            DateTime createdDt,
            string updatedBy,
            DateTime updatedDt)
        {
            Id = id;
            this.URLWindow = URLWindow;
            Name = name;
            Description = description;
            TypeMenu = typeMenu;
            _parentPermission = parentPermission;
            _parentPermissionId = parentPermission?.Id;
            Order = order;
            Estatus = estatus;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        public void SetParent(Permissions parent)
        {
            _parentPermission = parent;
            _parentPermissionId = parent?.Id;
        }

        //public static Permissions Create(long permissionId, string urlWindow, string name, string description, string typeMenu, Permissions parentPermission, int order, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        //{
        //    return new Permissions(permissionId, urlWindow, name, description, typeMenu, parentPermission, order, createdBy, createdDt, updatedBy, updatedDt);
        //}
    }
}