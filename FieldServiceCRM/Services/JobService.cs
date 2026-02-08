using Microsoft.EntityFrameworkCore;
using FieldServiceCRM.Data;
using FieldServiceCRM.DTOs;
using FieldServiceCRM.Models;

namespace FieldServiceCRM.Services
{
    public class JobService : IJobService
    {
        private readonly CrmDbContext _context;

        public JobService(CrmDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<JobDto>> GetAllJobsAsync()
        {
            return await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.AssignedTechnician)
                .Select(j => MapToDto(j))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobDto>> GetJobsByCustomerIdAsync(int customerId)
        {
            return await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.AssignedTechnician)
                .Where(j => j.CustomerId == customerId)
                .Select(j => MapToDto(j))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobDto>> GetJobsByTechnicianIdAsync(int technicianId)
        {
            return await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.AssignedTechnician)
                .Where(j => j.AssignedTechnicianId == technicianId)
                .Select(j => MapToDto(j))
                .ToListAsync();
        }

        public async Task<IEnumerable<JobDto>> GetJobsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.AssignedTechnician)
                .Where(j => j.ScheduledDate >= startDate && j.ScheduledDate <= endDate)
                .Select(j => MapToDto(j))
                .ToListAsync();
        }

        public async Task<JobDto?> GetJobByIdAsync(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.Customer)
                .Include(j => j.AssignedTechnician)
                .FirstOrDefaultAsync(j => j.Id == id);

            return job != null ? MapToDto(job) : null;
        }

        public async Task<JobDto> CreateJobAsync(CreateJobDto dto)
        {
            var job = new Job
            {
                CustomerId = dto.CustomerId,
                Title = dto.Title,
                Description = dto.Description,
                Status = "pending",
                Priority = dto.Priority,
                ScheduledDate = dto.ScheduledDate,
                AssignedTechnicianId = dto.AssignedTechnicianId,
                EstimatedHours = dto.EstimatedHours,
                ActualHours = 0,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return (await GetJobByIdAsync(job.Id))!;
        }

        public async Task<JobDto?> UpdateJobAsync(int id, UpdateJobDto dto)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
                return null;

            job.Title = dto.Title;
            job.Description = dto.Description;
            job.Status = dto.Status;
            job.Priority = dto.Priority;
            job.ScheduledDate = dto.ScheduledDate;
            job.CompletedDate = dto.CompletedDate;
            job.AssignedTechnicianId = dto.AssignedTechnicianId;
            job.EstimatedHours = dto.EstimatedHours;
            job.ActualHours = dto.ActualHours;
            job.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return await GetJobByIdAsync(id);
        }

        public async Task<bool> DeleteJobAsync(int id)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null)
                return false;

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return true;
        }

        private static JobDto MapToDto(Job job)
        {
            return new JobDto
            {
                Id = job.Id,
                CustomerId = job.CustomerId,
                CustomerName = job.Customer?.Name ?? string.Empty,
                Title = job.Title,
                Description = job.Description,
                Status = job.Status,
                Priority = job.Priority,
                ScheduledDate = job.ScheduledDate,
                CompletedDate = job.CompletedDate,
                AssignedTechnicianId = job.AssignedTechnicianId,
                AssignedTechnicianName = job.AssignedTechnician?.Name,
                EstimatedHours = job.EstimatedHours,
                ActualHours = job.ActualHours,
                InvoiceId = job.InvoiceId,
                CreatedDate = job.CreatedDate,
                UpdatedDate = job.UpdatedDate
            };
        }
    }
}
