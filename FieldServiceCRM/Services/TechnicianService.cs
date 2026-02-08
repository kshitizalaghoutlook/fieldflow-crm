using Microsoft.EntityFrameworkCore;
using FieldServiceCRM.Data;
using FieldServiceCRM.DTOs;
using FieldServiceCRM.Models;

namespace FieldServiceCRM.Services
{
    public class TechnicianService : ITechnicianService
    {
        private readonly CrmDbContext _context;

        public TechnicianService(CrmDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TechnicianDto>> GetAllTechniciansAsync()
        {
            return await _context.Technicians
                .Where(t => t.IsActive)
                .Select(t => new TechnicianDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Email = t.Email,
                    Phone = t.Phone,
                    Specialization = t.Specialization,
                    IsActive = t.IsActive,
                    HourlyRate = t.HourlyRate,
                    HireDate = t.HireDate,
                    ActiveJobCount = t.AssignedJobs.Count(j => j.Status == "scheduled" || j.Status == "in-progress")
                })
                .ToListAsync();
        }

        public async Task<TechnicianDto?> GetTechnicianByIdAsync(int id)
        {
            return await _context.Technicians
                .Where(t => t.Id == id)
                .Select(t => new TechnicianDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Email = t.Email,
                    Phone = t.Phone,
                    Specialization = t.Specialization,
                    IsActive = t.IsActive,
                    HourlyRate = t.HourlyRate,
                    HireDate = t.HireDate,
                    ActiveJobCount = t.AssignedJobs.Count(j => j.Status == "scheduled" || j.Status == "in-progress")
                })
                .FirstOrDefaultAsync();
        }

        public async Task<TechnicianDto> CreateTechnicianAsync(CreateTechnicianDto dto)
        {
            var technician = new Technician
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Specialization = dto.Specialization,
                HourlyRate = dto.HourlyRate,
                HireDate = dto.HireDate,
                IsActive = true
            };

            _context.Technicians.Add(technician);
            await _context.SaveChangesAsync();

            return new TechnicianDto
            {
                Id = technician.Id,
                Name = technician.Name,
                Email = technician.Email,
                Phone = technician.Phone,
                Specialization = technician.Specialization,
                IsActive = technician.IsActive,
                HourlyRate = technician.HourlyRate,
                HireDate = technician.HireDate,
                ActiveJobCount = 0
            };
        }

        public async Task<TechnicianDto?> UpdateTechnicianAsync(int id, UpdateTechnicianDto dto)
        {
            var technician = await _context.Technicians.FindAsync(id);
            if (technician == null)
                return null;

            technician.Name = dto.Name;
            technician.Email = dto.Email;
            technician.Phone = dto.Phone;
            technician.Specialization = dto.Specialization;
            technician.IsActive = dto.IsActive;
            technician.HourlyRate = dto.HourlyRate;

            await _context.SaveChangesAsync();

            return await GetTechnicianByIdAsync(id);
        }

        public async Task<bool> DeleteTechnicianAsync(int id)
        {
            var technician = await _context.Technicians.FindAsync(id);
            if (technician == null)
                return false;

            // Soft delete
            technician.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
