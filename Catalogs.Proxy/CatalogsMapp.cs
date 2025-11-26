using Catalogs.Domain;
using System.Data;
using Catalogs.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}