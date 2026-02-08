namespace FieldServiceCRM.DTOs
{
    // Customer DTOs
    public class CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
        public int JobCount { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class CreateCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }

    public class UpdateCustomerDto
    {
        public string Name { get; set; } = string.Empty;
        public string ContactPerson { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    // Job DTOs
    public class JobDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime? ScheduledDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int? AssignedTechnicianId { get; set; }
        public string? AssignedTechnicianName { get; set; }
        public decimal EstimatedHours { get; set; }
        public decimal ActualHours { get; set; }
        public int? InvoiceId { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

    public class CreateJobDto
    {
        public int CustomerId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = "medium";
        public DateTime? ScheduledDate { get; set; }
        public int? AssignedTechnicianId { get; set; }
        public decimal EstimatedHours { get; set; }
    }

    public class UpdateJobDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public DateTime? ScheduledDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int? AssignedTechnicianId { get; set; }
        public decimal EstimatedHours { get; set; }
        public decimal ActualHours { get; set; }
    }

    // Invoice DTOs
    public class InvoiceDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public string InvoiceNumber { get; set; } = string.Empty;
        public DateTime InvoiceDate { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal Subtotal { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal Total { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? PaidDate { get; set; }
        public string Notes { get; set; } = string.Empty;
        public List<InvoiceItemDto> Items { get; set; } = new();
        public List<int> JobIds { get; set; } = new();
    }

    public class InvoiceItemDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Amount { get; set; }
    }

    public class CreateInvoiceDto
    {
        public int CustomerId { get; set; }
        public DateTime? DueDate { get; set; }
        public decimal TaxRate { get; set; } = 0.0m;
        public string Notes { get; set; } = string.Empty;
        public List<CreateInvoiceItemDto> Items { get; set; } = new();
        public List<int> JobIds { get; set; } = new();
    }

    public class CreateInvoiceItemDto
    {
        public string Description { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }

    public class UpdateInvoiceDto
    {
        public DateTime? DueDate { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? PaidDate { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    // Technician DTOs
    public class TechnicianDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public decimal HourlyRate { get; set; }
        public DateTime HireDate { get; set; }
        public int ActiveJobCount { get; set; }
    }

    public class CreateTechnicianDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public decimal HourlyRate { get; set; }
        public DateTime HireDate { get; set; }
    }

    public class UpdateTechnicianDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public decimal HourlyRate { get; set; }
    }

    // Dashboard/Stats DTOs
    public class DashboardStatsDto
    {
        public int TotalCustomers { get; set; }
        public int ActiveJobs { get; set; }
        public int PendingInvoices { get; set; }
        public decimal MonthlyRevenue { get; set; }
        public List<JobDto> UpcomingJobs { get; set; } = new();
        public List<InvoiceDto> RecentInvoices { get; set; } = new();
    }
}
