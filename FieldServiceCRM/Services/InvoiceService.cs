using Microsoft.EntityFrameworkCore;
using FieldServiceCRM.Data;
using FieldServiceCRM.DTOs;
using FieldServiceCRM.Models;

namespace FieldServiceCRM.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly CrmDbContext _context;

        public InvoiceService(CrmDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InvoiceDto>> GetAllInvoicesAsync()
        {
            return await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .Include(i => i.Jobs)
                .Select(i => MapToDto(i))
                .ToListAsync();
        }

        public async Task<IEnumerable<InvoiceDto>> GetInvoicesByCustomerIdAsync(int customerId)
        {
            return await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .Include(i => i.Jobs)
                .Where(i => i.CustomerId == customerId)
                .Select(i => MapToDto(i))
                .ToListAsync();
        }

        public async Task<InvoiceDto?> GetInvoiceByIdAsync(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Customer)
                .Include(i => i.Items)
                .Include(i => i.Jobs)
                .FirstOrDefaultAsync(i => i.Id == id);

            return invoice != null ? MapToDto(invoice) : null;
        }

        public async Task<InvoiceDto> CreateInvoiceAsync(CreateInvoiceDto dto)
        {
            // Generate invoice number
            var lastInvoice = await _context.Invoices
                .OrderByDescending(i => i.Id)
                .FirstOrDefaultAsync();
            
            var invoiceNumber = $"INV-{DateTime.UtcNow:yyyyMM}-{(lastInvoice?.Id ?? 0) + 1:D4}";

            // Calculate totals
            var subtotal = dto.Items.Sum(item => item.Quantity * item.UnitPrice);
            var taxAmount = subtotal * dto.TaxRate;
            var total = subtotal + taxAmount;

            var invoice = new Invoice
            {
                CustomerId = dto.CustomerId,
                InvoiceNumber = invoiceNumber,
                InvoiceDate = DateTime.UtcNow,
                DueDate = dto.DueDate ?? DateTime.UtcNow.AddDays(30),
                Subtotal = subtotal,
                TaxAmount = taxAmount,
                Total = total,
                Status = "draft",
                Notes = dto.Notes,
                CreatedDate = DateTime.UtcNow,
                Items = dto.Items.Select(item => new InvoiceItem
                {
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Amount = item.Quantity * item.UnitPrice
                }).ToList()
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            // Link jobs to invoice if provided
            if (dto.JobIds.Any())
            {
                var jobs = await _context.Jobs
                    .Where(j => dto.JobIds.Contains(j.Id))
                    .ToListAsync();

                foreach (var job in jobs)
                {
                    job.InvoiceId = invoice.Id;
                }

                await _context.SaveChangesAsync();
            }

            return (await GetInvoiceByIdAsync(invoice.Id))!;
        }

        public async Task<InvoiceDto?> UpdateInvoiceAsync(int id, UpdateInvoiceDto dto)
        {
            var invoice = await _context.Invoices.FindAsync(id);
            if (invoice == null)
                return null;

            invoice.DueDate = dto.DueDate;
            invoice.Status = dto.Status;
            invoice.PaidDate = dto.PaidDate;
            invoice.Notes = dto.Notes;

            await _context.SaveChangesAsync();

            return await GetInvoiceByIdAsync(id);
        }

        public async Task<bool> DeleteInvoiceAsync(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Jobs)
                .FirstOrDefaultAsync(i => i.Id == id);
            
            if (invoice == null)
                return false;

            // Unlink jobs
            foreach (var job in invoice.Jobs)
            {
                job.InvoiceId = null;
            }

            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<byte[]> GenerateInvoicePdfAsync(int id)
        {
            // This is a placeholder - would integrate with a PDF library like QuestPDF or iText
            var invoice = await GetInvoiceByIdAsync(id);
            if (invoice == null)
                throw new Exception("Invoice not found");

            // Return empty byte array for now
            return Array.Empty<byte>();
        }

        private static InvoiceDto MapToDto(Invoice invoice)
        {
            return new InvoiceDto
            {
                Id = invoice.Id,
                CustomerId = invoice.CustomerId,
                CustomerName = invoice.Customer?.Name ?? string.Empty,
                InvoiceNumber = invoice.InvoiceNumber,
                InvoiceDate = invoice.InvoiceDate,
                DueDate = invoice.DueDate,
                Subtotal = invoice.Subtotal,
                TaxAmount = invoice.TaxAmount,
                Total = invoice.Total,
                Status = invoice.Status,
                PaidDate = invoice.PaidDate,
                Notes = invoice.Notes,
                Items = invoice.Items.Select(item => new InvoiceItemDto
                {
                    Id = item.Id,
                    Description = item.Description,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice,
                    Amount = item.Amount
                }).ToList(),
                JobIds = invoice.Jobs.Select(j => j.Id).ToList()
            };
        }
    }
}
