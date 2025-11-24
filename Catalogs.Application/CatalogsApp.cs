using Catalogs.Domain;
using Catalogs.Proxy;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.NetworkInformation;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Catalogs.Application
{
    public class CatalogsApp : ICatalogsApp
    {
        private readonly ICatalogsProxy _catalogsProxy;

        // Constructor para inyección de dependencias
        public CatalogsApp(ICatalogsProxy catalogsProxy)
        {
            _catalogsProxy = catalogsProxy ?? throw new ArgumentNullException(nameof(catalogsProxy));
        }

        public List<WorkAreaObj> GetAllWorkArea(out OperationResult result)
        {
            result = new() { Successful = true, SystemMessages = new List<SystemMessage>() };
            List<WorkAreaObj> response = new List<WorkAreaObj>();
            try
            {
                DataTable responseDT = _catalogsProxy.GetAllWorkArea();
                response = CatalogsMapp.MappAllWorkArea(responseDT) ?? new List<WorkAreaObj>();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null) 
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public WorkAreaObj GetWorkAreaById(long id, out OperationResult result)
        {
            result = new() { Successful = true };
            WorkAreaObj response = null;

            try
            {
                if (id <= 0) { throw new ArgumentException("El argumento debe ser mayor a cero.", nameof(id)); }

                DataTable responseDt = _catalogsProxy.GetWorkAreaById(id);
                response = CatalogsMapp.MappAllWorkArea(responseDt).First();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public void SaveOrUpdateWorkArea(int id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                // Validaciones de ID
                if (id < 0)
                    throw new ArgumentException("ERR-VAL-001: El ID no puede ser un número negativo.", nameof(id));

                // Validaciones de nombre
                if (string.IsNullOrWhiteSpace(name))
                    throw new ArgumentException("ERR-VAL-002: El nombre del área de trabajo es obligatorio.", nameof(name));

                if (name.Trim().Length < 3)
                    throw new ArgumentException("ERR-VAL-003: El nombre debe tener al menos 3 caracteres.", nameof(name));

                if (name.Trim().Length > 50)
                    throw new ArgumentException("ERR-VAL-004: El nombre no puede exceder los 50 caracteres.", nameof(name));

                // Validaciones de descripción
                if (!string.IsNullOrEmpty(description) && description.Trim().Length > 250)
                    throw new ArgumentException("ERR-VAL-005: La descripción no puede exceder los 250 caracteres.", nameof(description));

                // Validaciones de usuarios
                if (string.IsNullOrWhiteSpace(createdBy))
                    throw new ArgumentException("ERR-VAL-006: El usuario creador es obligatorio.", nameof(createdBy));

                if (string.IsNullOrWhiteSpace(updatedBy))
                    throw new ArgumentException("ERR-VAL-007: El usuario actualizador es obligatorio.", nameof(updatedBy));

                if (createdBy.Trim().Length < 3)
                    throw new ArgumentException("ERR-VAL-008: El usuario creador debe tener al menos 3 caracteres.", nameof(createdBy));

                if (updatedBy.Trim().Length < 3)
                    throw new ArgumentException("ERR-VAL-009: El usuario actualizador debe tener al menos 3 caracteres.", nameof(updatedBy));

                // Filtrado para Fechas
                if (updatedDt < createdDt)
                    throw new ArgumentException("ERR-VAL-012: La fecha de actualización no puede ser anterior a la fecha de creación.", nameof(updatedDt));

                // Si es una actualización (id > 0), validar que el ID sea válido
                if (id > 0 && id < 1000)
                    throw new ArgumentException("ERR-VAL-014: El ID proporcionado no es válido para actualización.", nameof(id));

                // Llamada al proxy
                _catalogsProxy.SaveOrUpdateWorkArea(id, name.Trim(), description?.Trim(), estatus, createdBy.Trim(), createdDt, updatedBy.Trim(), updatedDt);

                // Mensaje de éxito
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage()
                {
                    Message = id == 0 ?
                        "Área de trabajo registrada exitosamente." :
                        "Área de trabajo actualizada exitosamente."
                });
            }
            catch (ArgumentException ex)
            {
                result.Successful = false;
                result.SystemMessages = new List<SystemMessage>
                {
                    new SystemMessage()
                    {
                        Message = ex.Message, // Usamos el mensaje original con código de error
                        TechnicalDetails = $"Parámetro: {ex.ParamName}"
                    }
                };
            }
            catch (Exception ex)
            {
                result.Successful = false;
                result.SystemMessages = new List<SystemMessage>
                {
                    new SystemMessage()
                    {
                        Message = "ERR-SYS-001: Error inesperado al procesar la solicitud.",
                        TechnicalDetails = $"Tipo: {ex.GetType().Name}, Mensaje: {ex.Message}"
                    }
                };
            }
        }

        public void DeleteWorkArea(int id, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                // Validaciones estrictas para eliminación
                if (id <= 0)
                    throw new ArgumentException("ERR-VAL-101: El ID debe ser un número positivo mayor a cero.", nameof(id));

                _catalogsProxy.DeleteWorkArea(id);

                // Mensaje de éxito
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage()
                {
                    Message = "Área de trabajo eliminada exitosamente."
                });
            }
            catch (ArgumentException ex)
            {
                result.Successful = false;
                result.SystemMessages = new List<SystemMessage>
            {
            new SystemMessage()
                    {
                        Message = ex.Message,
                        TechnicalDetails = $"Parámetro: {ex.ParamName}"
                    }
                };
            }
            catch (Exception ex)
            {
                result.Successful = false;
                result.SystemMessages = new List<SystemMessage>
            {
            new SystemMessage()
                    {
                        Message = "ERR-SYS-002: Error inesperado al eliminar el registro.",
                        TechnicalDetails = $"Tipo: {ex.GetType().Name}, Mensaje: {ex.Message}"
                    }
                };
            }
        }
    }
}