using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FieldServiceCRM.Models
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(200)]
        public string ContactPerson { get; set; } = string.Empty;
        
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;
        
        [Phone]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        
        // Navigation properties
        public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
        public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();
    }

    public class Job
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int CustomerId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [StringLength(2000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "pending"; // pending, scheduled, in-progress, completed, cancelled
        
        [Required]
        [StringLength(50)]
        public string Priority { get; set; } = "medium"; // low, medium, high, urgent
        
        public DateTime? ScheduledDate { get; set; }
        
        public DateTime? CompletedDate { get; set; }
        
        public int? AssignedTechnicianId { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal EstimatedHours { get; set; }
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal ActualHours { get; set; }
        
        public int? InvoiceId { get; set; }
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; } = null!;
        
        [ForeignKey("AssignedTechnicianId")]
        public virtual Technician? AssignedTechnician { get; set; }
        
        [ForeignKey("InvoiceId")]
        public virtual Invoice? Invoice { get; set; }
    }

    public class Invoice
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int CustomerId { get; set; }
        
        [Required]
        [StringLength(50)]
        public string InvoiceNumber { get; set; } = string.Empty;
        
        public DateTime InvoiceDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? DueDate { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Subtotal { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal TaxAmount { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Total { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "draft"; // draft, sent, paid, overdue, cancelled
        
        public DateTime? PaidDate { get; set; }
        
        [StringLength(1000)]
        public string Notes { get; set; } = string.Empty;
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; } = null!;
        
        public virtual ICollection<InvoiceItem> Items { get; set; } = new List<InvoiceItem>();
        public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
    }

    public class InvoiceItem
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int InvoiceId { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Description { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal Quantity { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }
        
        // Navigation properties
        [ForeignKey("InvoiceId")]
        public virtual Invoice Invoice { get; set; } = null!;
    }

    public class Technician
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [EmailAddress]
        [StringLength(200)]
        public string Email { get; set; } = string.Empty;
        
        [Phone]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;
        
        [StringLength(100)]
        public string Specialization { get; set; } = string.Empty;
        
        public bool IsActive { get; set; } = true;
        
        [Column(TypeName = "decimal(10,2)")]
        public decimal HourlyRate { get; set; }
        
        public DateTime HireDate { get; set; }
        
        // Navigation properties
        public virtual ICollection<Job> AssignedJobs { get; set; } = new List<Job>();
    }
}
