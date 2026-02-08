using FieldServiceCRM.DTOs;

namespace FieldServiceCRM.Services
{
    public interface ICustomerService
    {
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
        Task<CustomerDto?> GetCustomerByIdAsync(int id);
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto);
        Task<CustomerDto?> UpdateCustomerAsync(int id, UpdateCustomerDto dto);
        Task<bool> DeleteCustomerAsync(int id);
    }

    public interface IJobService
    {
        Task<IEnumerable<JobDto>> GetAllJobsAsync();
        Task<IEnumerable<JobDto>> GetJobsByCustomerIdAsync(int customerId);
        Task<IEnumerable<JobDto>> GetJobsByTechnicianIdAsync(int technicianId);
        Task<IEnumerable<JobDto>> GetJobsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<JobDto?> GetJobByIdAsync(int id);
        Task<JobDto> CreateJobAsync(CreateJobDto dto);
        Task<JobDto?> UpdateJobAsync(int id, UpdateJobDto dto);
        Task<bool> DeleteJobAsync(int id);
    }

    public interface IInvoiceService
    {
        Task<IEnumerable<InvoiceDto>> GetAllInvoicesAsync();
        Task<IEnumerable<InvoiceDto>> GetInvoicesByCustomerIdAsync(int customerId);
        Task<InvoiceDto?> GetInvoiceByIdAsync(int id);
        Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceDto dto);
        Task<InvoiceDto?> UpdateInvoiceAsync(int id, UpdateInvoiceDto dto);
        Task<bool> DeleteInvoiceAsync(int id);
        Task<byte[]> GenerateInvoicePdfAsync(int id);
    }

    public interface ITechnicianService
    {
        Task<IEnumerable<TechnicianDto>> GetAllTechniciansAsync();
        Task<TechnicianDto?> GetTechnicianByIdAsync(int id);
        Task<TechnicianDto> CreateTechnicianAsync(CreateTechnicianDto dto);
        Task<TechnicianDto?> UpdateTechnicianAsync(int id, UpdateTechnicianDto dto);
        Task<bool> DeleteTechnicianAsync(int id);
    }

    public interface IDashboardService
    {
        Task<DashboardStatsDto> GetDashboardStatsAsync();
    }
}
