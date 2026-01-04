using Common.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Catalogs.Domain
{
    public class RolPermission : Entity<long>
    {
        private long _idRol;
        private long _permisoId;
        private string _menuType;
        private string _name;

        [JsonPropertyName("IdRol")]
        public long IdRol => _idRol;
        [JsonPropertyName("PermisoId")]
        public long PermisoId => _permisoId;
        [JsonPropertyName("TipoMenu")]
        public string MenuType => _menuType;
        [JsonPropertyName("Nombre")]
        public string Name => _name;

        private RolPermission(long rolPermissionId, long rolId, long permissionId, string menuType, string name, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = rolPermissionId;
            _idRol = rolId;
            _permisoId = permissionId;
            _menuType = menuType;
            _name = name;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        [JsonConstructor]
        public RolPermission(long id, long idRol, long permisoId, string menuType, string name, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            Id = id;
            _idRol = idRol;
            _permisoId = permisoId;
            _menuType = menuType;
            _name = name;
            Estatus = estatus;
            CreatedBy = createdBy;
            CreatedDt = createdDt;
            UpdatedBy = updatedBy;
            UpdatedDt = updatedDt;
        }

        public static RolPermission Create(long rolPermissionId, long rolId, long permissionId, string menuType, string name, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt)
        {
            return new RolPermission(rolPermissionId, rolId, permissionId, menuType, name, createdBy, createdDt, updatedBy, updatedDt);
        }
    }
}
