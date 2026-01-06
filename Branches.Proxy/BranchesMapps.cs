using Branches.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Branches.Proxy
{
    public class BranchesMapps
    {
        #region UnitMeasurement
        public static List<UnitMeasurement> MappAllUnitMeasurement(DataTable dto)
        {
            // Si dto es null lanzamos excepción indicando que no fue posible obtener valores
            if (dto == null)
                throw new ArgumentNullException(nameof(dto), "No fue posible obtener valores desde el DataTable.");

            var list = new List<UnitMeasurement>();

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
                var item = UnitMeasurement.Create(id, name, description, createdBy, createdDt, updatedBy, updatedDt);
                if (item != null)
                    list.Add(item);
            }

            return list;
        }
        #endregion
    }
}
