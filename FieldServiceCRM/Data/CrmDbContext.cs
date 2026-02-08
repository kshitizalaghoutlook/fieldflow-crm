using Microsoft.EntityFrameworkCore;
using FieldServiceCRM.Models;

namespace FieldServiceCRM.Data
{
    public class CrmDbContext : DbContext
    {
        public CrmDbContext(DbContextOptions<CrmDbContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Technician> Technicians { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<Job>()
                .HasOne(j => j.Customer)
                .WithMany(c => c.Jobs)
                .HasForeignKey(j => j.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Job>()
                .HasOne(j => j.AssignedTechnician)
                .WithMany(t => t.AssignedJobs)
                .HasForeignKey(j => j.AssignedTechnicianId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Job>()
                .HasOne(j => j.Invoice)
                .WithMany(i => i.Jobs)
                .HasForeignKey(j => j.InvoiceId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Invoice>()
                .HasOne(i => i.Customer)
                .WithMany(c => c.Invoices)
                .HasForeignKey(i => i.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<InvoiceItem>()
                .HasOne(ii => ii.Invoice)
                .WithMany(i => i.Items)
                .HasForeignKey(ii => ii.InvoiceId)
                .OnDelete(DeleteBehavior.Cascade);

            // Seed initial data
            modelBuilder.Entity<Technician>().HasData(
                new Technician { Id = 1, Name = "Tom Martinez", Email = "tom@fieldservice.com", Phone = "(555) 111-2222", Specialization = "HVAC", HourlyRate = 75, HireDate = new DateTime(2020, 3, 15), IsActive = true },
                new Technician { Id = 2, Name = "Lisa Park", Email = "lisa@fieldservice.com", Phone = "(555) 222-3333", Specialization = "Electrical", HourlyRate = 80, HireDate = new DateTime(2019, 7, 22), IsActive = true },
                new Technician { Id = 3, Name = "James Wilson", Email = "james@fieldservice.com", Phone = "(555) 333-4444", Specialization = "Plumbing", HourlyRate = 70, HireDate = new DateTime(2021, 1, 10), IsActive = true },
                new Technician { Id = 4, Name = "Maria Garcia", Email = "maria@fieldservice.com", Phone = "(555) 444-5555", Specialization = "General Maintenance", HourlyRate = 65, HireDate = new DateTime(2022, 5, 8), IsActive = true }
            );

            modelBuilder.Entity<Customer>().HasData(
                new Customer { Id = 1, Name = "Acme Corp", ContactPerson = "John Smith", Email = "john@acme.com", Phone = "(555) 123-4567", Address = "123 Main St, City, ST 12345", IsActive = true },
                new Customer { Id = 2, Name = "Tech Solutions Inc", ContactPerson = "Sarah Johnson", Email = "sarah@techsol.com", Phone = "(555) 234-5678", Address = "456 Oak Ave, Town, ST 23456", IsActive = true },
                new Customer { Id = 3, Name = "Green Valley Restaurant", ContactPerson = "Mike Chen", Email = "mike@greenvalley.com", Phone = "(555) 345-6789", Address = "789 Pine Rd, Village, ST 34567", IsActive = true }
            );

            // Configure indexes for better performance
            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Email);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.Status);

            modelBuilder.Entity<Job>()
                .HasIndex(j => j.ScheduledDate);

            modelBuilder.Entity<Invoice>()
                .HasIndex(i => i.InvoiceNumber)
                .IsUnique();

            modelBuilder.Entity<Invoice>()
                .HasIndex(i => i.Status);
        }
    }
}
