using Branches.Domain;
using Branches.Proxy;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Branches.Application
{
    public class BranchesApp : IBranchesApp
    {
        private readonly IBranchesProxy _branchesProxy;

        public BranchesApp(IBranchesProxy branchesProxy)
        {
            _branchesProxy = branchesProxy ?? throw new ArgumentNullException(nameof(branchesProxy));
        }

        #region UnitMeasurement
        public List<UnitMeasurement> GetAllUnitMeasurement(out OperationResult result)
        {
            result = new() { Successful = true, SystemMessages = new List<SystemMessage>() };
            List<UnitMeasurement> response = new List<UnitMeasurement>();
            try
            {
                DataTable responseDT = _branchesProxy.GetAllUnitMeasurement();
                response = BranchesMapps.MappAllUnitMeasurement(responseDT) ?? new List<UnitMeasurement>();
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
        public UnitMeasurement GetUnitMeasurementById(long id, out OperationResult result)
        {
            result = new() { Successful = true };
            UnitMeasurement response = null;

            try
            {
                if (id <= 0) { throw new ArgumentException("El argumento debe ser mayor a cero.", nameof(id)); }

                DataTable responseDt = _branchesProxy.GetUnitMeasurementById(id);
                response = BranchesMapps.MappAllUnitMeasurement(responseDt).First();
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
        public void SaveOrUpdateUnitMeasurement(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                if (id < 0) { throw new ArgumentException("El argumento no debe ser menor a 0.", nameof(id)); }
                if (string.IsNullOrEmpty(name)) { throw new ArgumentException("El argumento no puede ser nulo o vacio.", nameof(name)); }
                if (name.Length > 50) { throw new ArgumentException("El argumento no puede ser mayo de 50 caracteres.", nameof(name)); }
                if (description?.Length > 250) { throw new ArgumentException("La argumento no puede ser mayo de 250 caracteres.", nameof(description)); }
                if (estatus == false) { throw new ArgumentException("El argumento no debe ser inactivo.", nameof(estatus)); }
                if (string.IsNullOrEmpty(createdBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(createdBy)); }
                if (string.IsNullOrEmpty(createdBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(createdBy)); }
                if (createdBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(createdBy)); }
                if (createdDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }
                if (string.IsNullOrEmpty(updatedBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(updatedBy)); }
                if (updatedBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(updatedBy)); }
                if (updatedDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }


                _branchesProxy.SaveOrUpdateUnitMeasurement(id, name, description, estatus, createdBy, createdDt, updatedBy, updatedDt);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = "No es posible realizar el salvado/actualización de los datos." });
            }
        }
        public void DeleteUnitMeasurement(int id, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                // Validaciones estrictas para eliminación
                if (id <= 0)
                    throw new ArgumentException("El argumento debe ser un número positivo mayor a cero.", nameof(id));

                _branchesProxy.DeleteUnitMeasurement(id);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = "No es posible realizar el eliminado de los datos." });
            }
        }
        #endregion
    }
}
