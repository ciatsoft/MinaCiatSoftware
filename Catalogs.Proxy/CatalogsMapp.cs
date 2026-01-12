using Catalogs.Domain;
using System.Data;
using Catalogs.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Branches.Domain;

namespace Catalogs.Proxy
{
    public class CatalogsMapp
    {
        #region WorkArea
        public static List<WorkAreaObj> MappAllWorkArea(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<WorkAreaObj>();

            // Si no tiene filas regresamos lista vacía
            if (dto.Rows.Count == 0)
                return list;

            foreach (DataRow row in dto.Rows)
            {
                // Obtener valores de forma segura (si la columna no existe o es DBNull, usar valores por defecto)
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { id = 0; }
                }

                string name = dto.Columns.Contains("Nombre") && row["Nombre"] != DBNull.Value
                    ? row["Nombre"].ToString()
                    : string.Empty;

                string description = dto.Columns.Contains("Descripcion") && row["Descripcion"] != DBNull.Value
                    ? row["Descripcion"].ToString()
                    : string.Empty;

                string createdBy = dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value
                    ? row["CreatedBy"].ToString()
                    : string.Empty;

                DateTime createdDt = dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["CreatedDt"])
                    : DateTime.MinValue;

                string updatedBy = dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value
                    ? row["UpdatedBy"].ToString()
                    : string.Empty;

                DateTime updatedDt = dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["UpdatedDt"])
                    : DateTime.MinValue;

                // Crear nuevo WorkAreaObj por cada fila
                var item = WorkAreaObj.Create(id, name, description, createdBy, createdDt, updatedBy, updatedDt);
                if (item != null)
                    list.Add(item);
            }

            return list;
        }
        #endregion

        #region LoansCatalog
        public static List<LoansCatalog> MappAllLoansCatalog(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<LoansCatalog>();

            // Si no tiene filas regresamos lista vacía
            if (dto.Rows.Count == 0)
                return list;

            foreach (DataRow row in dto.Rows)
            {
                // Obtener valores de forma segura (si la columna no existe o es DBNull, usar valores por defecto)
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { id = 0; }
                }

                string name = dto.Columns.Contains("Nombre") && row["Nombre"] != DBNull.Value
                    ? row["Nombre"].ToString()
                    : string.Empty;

                string description = dto.Columns.Contains("Descripcion") && row["Descripcion"] != DBNull.Value
                    ? row["Descripcion"].ToString()
                    : string.Empty;

                decimal monto = dto.Columns.Contains("Monto") && row["Monto"] != DBNull.Value
                    ? Convert.ToDecimal(row["Monto"])
                    : 0;

                DateTime date = dto.Columns.Contains("Fecha") && row["Fecha"] != DBNull.Value
                    ? Convert.ToDateTime(row["Fecha"])
                    : DateTime.MinValue;

                string userName = dto.Columns.Contains("UsuarioName") && row["UsuarioName"] != DBNull.Value
                    ? row["UsuarioName"].ToString()
                    : string.Empty;

                long idWorker = dto.Columns.Contains("IdTrabajador") && row["IdTrabajador"] != DBNull.Value
                    ? Convert.ToInt64(row["IdTrabajador"].ToString())
                    : 0;

                string nameWorker = dto.Columns.Contains("NombreTrabajador") && row["NombreTrabajador"] != DBNull.Value
                    ? row["NombreTrabajador"].ToString()
                    : string.Empty;

                string createdBy = dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value
                    ? row["CreatedBy"].ToString()
                    : string.Empty;

                DateTime createdDt = dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["CreatedDt"])
                    : DateTime.MinValue;

                string updatedBy = dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value
                    ? row["UpdatedBy"].ToString()
                    : string.Empty;

                DateTime updatedDt = dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["UpdatedDt"])
                    : DateTime.MinValue;

                // Crear nuevo WorkAreaObj por cada fila
                var item = LoansCatalog.Create(id, idWorker, nameWorker, name, description, monto, date, userName, createdBy, createdDt, updatedBy, updatedDt);
                if (item != null)
                    list.Add(item);
            }

            return list;
        }
        #endregion

        #region Location
        public static List<Location> MappAllLocation(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<Location>();

            // Si no tiene filas regresamos lista vacía
            if (dto.Rows.Count == 0)
                return list;

            foreach (DataRow row in dto.Rows)
            {
                // Obtener valores de forma segura (si la columna no existe o es DBNull, usar valores por defecto)
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { id = 0; }
                }

                string nameLocation = dto.Columns.Contains("NombreUbicacion") && row["NombreUbicacion"] != DBNull.Value
                    ? row["NombreUbicacion"].ToString()
                    : string.Empty;

                string description = dto.Columns.Contains("DescripcionUbicacion") && row["DescripcionUbicacion"] != DBNull.Value
                    ? row["DescripcionUbicacion"].ToString()
                    : string.Empty;

                bool isInternal = dto.Columns.Contains("EsInterna") && row["EsInterna"] != DBNull.Value
                    ? Convert.ToBoolean(row["EsInterna"])
                    : false;

                string createdBy = dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value
                    ? row["CreatedBy"].ToString()
                    : string.Empty;

                DateTime createdDt = dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["CreatedDt"])
                    : DateTime.MinValue;

                string updatedBy = dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value
                    ? row["UpdatedBy"].ToString()
                    : string.Empty;

                DateTime updatedDt = dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["UpdatedDt"])
                    : DateTime.MinValue;

                // Crear nuevo WorkAreaObj por cada fila
                var item = Location.Create(id, nameLocation, description, isInternal, createdBy, createdDt, updatedBy, updatedDt);
                if (item != null)
                    list.Add(item);
            }

            return list;
        }
        #endregion

        #region Roll
        public static List<RollObj> MappAllRoll(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<RollObj>();

            // Si no tiene filas regresamos lista vacía
            if (dto.Rows.Count == 0)
                return list;

            foreach (DataRow row in dto.Rows)
            {
                // Obtener valores de forma segura (si la columna no existe o es DBNull, usar valores por defecto)
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { id = 0; }
                }

                string name = dto.Columns.Contains("Nombre") && row["Nombre"] != DBNull.Value
                    ? row["Nombre"].ToString()
                    : string.Empty;

                string description = dto.Columns.Contains("Descripcion") && row["Descripcion"] != DBNull.Value
                    ? row["Descripcion"].ToString()
                    : string.Empty;

                string createdBy = dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value
                    ? row["CreatedBy"].ToString()
                    : string.Empty;

                DateTime createdDt = dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["CreatedDt"])
                    : DateTime.MinValue;

                string updatedBy = dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value
                    ? row["UpdatedBy"].ToString()
                    : string.Empty;

                DateTime updatedDt = dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["UpdatedDt"])
                    : DateTime.MinValue;

                // Crear nuevo WorkAreaObj por cada fila
                var item = RollObj.Create(id, name, description, createdBy, createdDt, updatedBy, updatedDt);
                if (item != null)
                    list.Add(item);
            }

            return list;
        }
        #endregion

        #region TypeExpense
        public static List<TypeExpense> MappAllTypeExpense(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<TypeExpense>();

            // Si no tiene filas regresamos lista vacía
            if (dto.Rows.Count == 0)
                return list;

            foreach (DataRow row in dto.Rows)
            {
                // Obtener valores de forma segura (si la columna no existe o es DBNull, usar valores por defecto)
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { id = 0; }
                }

                string name = dto.Columns.Contains("Nombre") && row["Nombre"] != DBNull.Value
                    ? row["Nombre"].ToString()
                    : string.Empty;

                string description = dto.Columns.Contains("Descripcion") && row["Descripcion"] != DBNull.Value
                    ? row["Descripcion"].ToString()
                    : string.Empty;

                bool estatus = dto.Columns.Contains("Estatus") && row["Estatus"] != DBNull.Value
                    ? Convert.ToBoolean(row["Estatus"])
                    : false;

                string createdBy = dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value
                    ? row["CreatedBy"].ToString()
                    : string.Empty;

                DateTime createdDt = dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["CreatedDt"])
                    : DateTime.MinValue;

                string updatedBy = dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value
                    ? row["UpdatedBy"].ToString()
                    : string.Empty;

                DateTime updatedDt = dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["UpdatedDt"])
                    : DateTime.MinValue;

                // Crear nuevo WorkAreaObj por cada fila
                var item = TypeExpense.Create(id, name, description, estatus, createdBy, createdDt, updatedBy, updatedDt);
                if (item != null)
                    list.Add(item);
            }

            return list;
        }
        #endregion

        #region RolPermission
        public static List<RolPermission> MappAllRolPermission(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<RolPermission>();

            // Si no tiene filas regresamos lista vacía
            if (dto.Rows.Count == 0)
                return list;

            foreach (DataRow row in dto.Rows)
            {
                // Obtener valores de forma segura (si la columna no existe o es DBNull, usar valores por defecto)
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { id = 0; }
                }

                long idRol = 0;
                if (dto.Columns.Contains("IdRol") && row["IdRol"] != DBNull.Value)
                {
                    try { idRol = Convert.ToInt64(row["IdRol"]); } catch { idRol = 0; }
                }

                long permisoId = 0;
                if (dto.Columns.Contains("PermisoId") && row["PermisoId"] != DBNull.Value)
                {
                    try { permisoId = Convert.ToInt64(row["PermisoId"]); } catch { permisoId = 0; }
                }

                string menuType = dto.Columns.Contains("TipoMenu") && row["TipoMenu"] != DBNull.Value
                    ? row["TipoMenu"].ToString()
                    : string.Empty;

                string name = dto.Columns.Contains("Nombre") && row["Nombre"] != DBNull.Value
                    ? row["Nombre"].ToString()
                    : string.Empty;

                bool estatus = dto.Columns.Contains("Estatus") && row["Estatus"] != DBNull.Value
                    ? Convert.ToBoolean(row["Estatus"])
                    : false;

                string createdBy = dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value
                    ? row["CreatedBy"].ToString()
                    : string.Empty;

                DateTime createdDt = dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["CreatedDt"])
                    : DateTime.MinValue;

                string updatedBy = dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value
                    ? row["UpdatedBy"].ToString()
                    : string.Empty;

                DateTime updatedDt = dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["UpdatedDt"])
                    : DateTime.MinValue;

                // Crear nuevo RolPermission por cada fila usando el método estático Create
                var item = RolPermission.Create(id, idRol, permisoId, menuType, name, createdBy, createdDt, updatedBy, updatedDt);
                if (item != null)
                    list.Add(item);
            }

            return list;
        }
        #endregion

        #region PaymentMethod
        public static List<PaymentMethod> MappAllPaymentMethod(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<PaymentMethod>();

            // Si no tiene filas regresamos lista vacía
            if (dto.Rows.Count == 0)
                return list;

            foreach (DataRow row in dto.Rows)
            {
                // Obtener valores de forma segura (si la columna no existe o es DBNull, usar valores por defecto)
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { id = 0; }
                }

                string name = dto.Columns.Contains("Nombre") && row["Nombre"] != DBNull.Value
                    ? row["Nombre"].ToString()
                    : string.Empty;

                string description = dto.Columns.Contains("Descripcion") && row["Descripcion"] != DBNull.Value
                    ? row["Descripcion"].ToString()
                    : string.Empty;

                string createdBy = dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value
                    ? row["CreatedBy"].ToString()
                    : string.Empty;

                DateTime createdDt = dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["CreatedDt"])
                    : DateTime.MinValue;

                string updatedBy = dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value
                    ? row["UpdatedBy"].ToString()
                    : string.Empty;

                DateTime updatedDt = dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["UpdatedDt"])
                    : DateTime.MinValue;

                // Crear nuevo WorkAreaObj por cada fila
                var item = PaymentMethod.Create(id, name, description, createdBy, createdDt, updatedBy, updatedDt);
                if (item != null)
                    list.Add(item);
            }

            return list;
        }
        #endregion

        #region Permissions
        public static List<Permissions> MappAllPermissions(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<Permissions>();

            // Si no tiene filas regresamos lista vacía
            if (dto.Rows.Count == 0)
                return list;

            // Diccionario para almacenar permisos por ID (para establecer relaciones padre-hijo)
            var permissionsDict = new Dictionary<long, Permissions>();

            // Primera pasada: crear todos los permisos SIN relaciones padre-hijo
            foreach (DataRow row in dto.Rows)
            {
                // Obtener valores de forma segura (si la columna no existe o es DBNull, usar valores por defecto)
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { id = 0; }
                }

                string urlWindow = dto.Columns.Contains("URLVentana") && row["URLVentana"] != DBNull.Value
                    ? row["URLVentana"].ToString()
                    : string.Empty;

                string name = dto.Columns.Contains("Nombre") && row["Nombre"] != DBNull.Value
                    ? row["Nombre"].ToString()
                    : string.Empty;

                string description = dto.Columns.Contains("Descripcion") && row["Descripcion"] != DBNull.Value
                    ? row["Descripcion"].ToString()
                    : string.Empty;

                string typeMenu = dto.Columns.Contains("TipoMenu") && row["TipoMenu"] != DBNull.Value
                    ? row["TipoMenu"].ToString()
                    : string.Empty;

                // Obtener el ID del padre si existe
                long? parentPermissionId = null;
                if (dto.Columns.Contains("PermisoPadreId") && row["PermisoPadreId"] != DBNull.Value)
                {
                    try
                    {
                        long parentId = Convert.ToInt64(row["PermisoPadreId"]);
                        if (parentId > 0)
                            parentPermissionId = parentId;
                    }
                    catch { }
                }

                int order = 0;
                if (dto.Columns.Contains("Orden") && row["Orden"] != DBNull.Value)
                {
                    try { order = Convert.ToInt32(row["Orden"]); } catch { order = 0; }
                }

                string createdBy = dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value
                    ? row["CreatedBy"].ToString()
                    : string.Empty;

                DateTime createdDt = dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["CreatedDt"])
                    : DateTime.MinValue;

                string updatedBy = dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value
                    ? row["UpdatedBy"].ToString()
                    : string.Empty;

                DateTime updatedDt = dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value
                    ? Convert.ToDateTime(row["UpdatedDt"])
                    : DateTime.MinValue;

                // Obtener estatus si existe
                bool estatus = true;
                if (dto.Columns.Contains("Estatus") && row["Estatus"] != DBNull.Value)
                {
                    try { estatus = Convert.ToBoolean(row["Estatus"]); } catch { estatus = true; }
                }

                // Crear permiso con el ID del padre (el objeto padre será null por ahora)
                var item = new Permissions(
                    id: id,
                    URLWindow: urlWindow,
                    name: name,
                    description: description,
                    typeMenu: typeMenu,
                    parentPermission: null, // null por ahora, lo establecemos después
                    order: order,
                    estatus: estatus,
                    createdBy: createdBy,
                    createdDt: createdDt,
                    updatedBy: updatedBy,
                    updatedDt: updatedDt
                );

                // Establecer el ID del padre usando reflexión o un método público si lo agregas
                if (parentPermissionId.HasValue)
                {
                    // Usar reflexión temporalmente para establecer el ID del padre
                    var field = typeof(Permissions).GetField("_parentPermissionId",
                        System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                    if (field != null)
                    {
                        field.SetValue(item, parentPermissionId.Value);
                    }
                }

                if (item != null)
                {
                    list.Add(item);
                    permissionsDict[id] = item;
                }
            }

            // Segunda pasada: establecer relaciones padre-hijo (objetos completos)
            foreach (DataRow row in dto.Rows)
            {
                long id = 0;
                if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                {
                    try { id = Convert.ToInt64(row["Id"]); } catch { continue; }
                }

                if (!permissionsDict.TryGetValue(id, out var currentPermission))
                    continue;

                // Establecer permiso padre si existe
                if (dto.Columns.Contains("PermisoPadreId") && row["PermisoPadreId"] != DBNull.Value)
                {
                    long parentId = 0;
                    try { parentId = Convert.ToInt64(row["PermisoPadreId"]); } catch { continue; }

                    if (parentId > 0 && permissionsDict.TryGetValue(parentId, out var parentPermission))
                    {
                        // Usar el método público SetParent
                        currentPermission.SetParent(parentPermission);
                    }
                }
            }

            return list;
        }
        #endregion

        #region MaterialTypeLocation
        public static List<MaterialTypeLocation> MappAllMaterialTypeLocation(DataTable dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<MaterialTypeLocation>();

            if (dto.Rows.Count == 0)
                return list;

            foreach (DataRow row in dto.Rows)
            {
                try
                {
                    long id = 0;
                    if (dto.Columns.Contains("Id") && row["Id"] != DBNull.Value)
                    {
                        id = Convert.ToInt64(row["Id"]);
                    }
                    else
                    {
                        continue;
                    }

                    // Obtener MaterialId (si existe en el DataTable)
                    long materialId = id; // Por defecto igual al Id
                    if (dto.Columns.Contains("MaterialId") && row["MaterialId"] != DBNull.Value)
                    {
                        try { materialId = Convert.ToInt64(row["MaterialId"]); }
                        catch { materialId = id; }
                    }

                    // Obtener LocationId (si existe en el DataTable)
                    long locationId = id; // Por defecto igual al Id
                    if (dto.Columns.Contains("LocationId") && row["LocationId"] != DBNull.Value)
                    {
                        try { locationId = Convert.ToInt64(row["LocationId"]); }
                        catch { locationId = id; }
                    }

                    string nameTypeMaterial = string.Empty;
                    if (dto.Columns.Contains("NombreTipoMaterial") && row["NombreTipoMaterial"] != DBNull.Value)
                    {
                        nameTypeMaterial = row["NombreTipoMaterial"].ToString().Trim();
                    }

                    string descriptionTypeMaterial = string.Empty;
                    if (dto.Columns.Contains("DescripcionTipoMaterial") && row["DescripcionTipoMaterial"] != DBNull.Value)
                    {
                        descriptionTypeMaterial = row["DescripcionTipoMaterial"].ToString().Trim();
                    }

                    long? unitMeasurementId = null;
                    if (dto.Columns.Contains("UnidadMedidaID") && row["UnidadMedidaID"] != DBNull.Value)
                    {
                        try
                        {
                            long unitId = Convert.ToInt64(row["UnidadMedidaID"]);
                            if (unitId > 0)
                                unitMeasurementId = unitId;
                        }
                        catch { }
                    }

                    bool estatus = true;
                    if (dto.Columns.Contains("Estatus") && row["Estatus"] != DBNull.Value)
                    {
                        try { estatus = Convert.ToBoolean(row["Estatus"]); }
                        catch { estatus = true; }
                    }

                    string createdBy = string.Empty;
                    if (dto.Columns.Contains("CreatedBy") && row["CreatedBy"] != DBNull.Value)
                    {
                        createdBy = row["CreatedBy"].ToString().Trim();
                    }

                    DateTime createdDt = DateTime.MinValue;
                    if (dto.Columns.Contains("CreatedDt") && row["CreatedDt"] != DBNull.Value)
                    {
                        try { createdDt = Convert.ToDateTime(row["CreatedDt"]); }
                        catch { createdDt = DateTime.MinValue; }
                    }

                    string updatedBy = string.Empty;
                    if (dto.Columns.Contains("UpdatedBy") && row["UpdatedBy"] != DBNull.Value)
                    {
                        updatedBy = row["UpdatedBy"].ToString().Trim();
                    }

                    DateTime updatedDt = DateTime.MinValue;
                    if (dto.Columns.Contains("UpdatedDt") && row["UpdatedDt"] != DBNull.Value)
                    {
                        try { updatedDt = Convert.ToDateTime(row["UpdatedDt"]); }
                        catch { updatedDt = DateTime.MinValue; }
                    }

                    var item = new MaterialTypeLocation(
                        id: id,
                        locationId: locationId,
                        materialId: materialId,
                        nameTypeMaterial: nameTypeMaterial,
                        descriptionTypeMaterial: descriptionTypeMaterial,
                        unitMeasurementId: unitMeasurementId,
                        estatus: estatus,
                        createdBy: createdBy,
                        createdDt: createdDt,
                        updatedBy: updatedBy,
                        updatedDt: updatedDt
                    );

                    list.Add(item);
                }
                catch (Exception ex)
                {
                    // Log error
                    continue;
                }
            }

            return list;
        }
        #endregion
    }
}