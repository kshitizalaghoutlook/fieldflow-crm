using Microsoft.EntityFrameworkCore;
using FieldServiceCRM.Data;
using FieldServiceCRM.DTOs;
using FieldServiceCRM.Models;

namespace FieldServiceCRM.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly CrmDbContext _context;

        public CustomerService(CrmDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            return await _context.Customers
                .Where(c => c.IsActive)
                .Select(c => new CustomerDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ContactPerson = c.ContactPerson,
                    Email = c.Email,
                    Phone = c.Phone,
                    Address = c.Address,
                    CreatedDate = c.CreatedDate,
                    IsActive = c.IsActive,
                    JobCount = c.Jobs.Count,
                    TotalRevenue = c.Invoices.Where(i => i.Status == "paid").Sum(i => i.Total)
                })
                .ToListAsync();
        }

        public async Task<CustomerDto?> GetCustomerByIdAsync(int id)
        {
            return await _context.Customers
                .Where(c => c.Id == id)
                .Select(c => new CustomerDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ContactPerson = c.ContactPerson,
                    Email = c.Email,
                    Phone = c.Phone,
                    Address = c.Address,
                    CreatedDate = c.CreatedDate,
                    IsActive = c.IsActive,
                    JobCount = c.Jobs.Count,
                    TotalRevenue = c.Invoices.Where(i => i.Status == "paid").Sum(i => i.Total)
                })
                .FirstOrDefaultAsync();
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto)
        {
            var customer = new Customer
            {
                Name = dto.Name,
                ContactPerson = dto.ContactPerson,
                Email = dto.Email,
                Phone = dto.Phone,
                Address = dto.Address,
                CreatedDate = DateTime.UtcNow,
                IsActive = true
            };

            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                ContactPerson = customer.ContactPerson,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address,
                CreatedDate = customer.CreatedDate,
                IsActive = customer.IsActive,
                JobCount = 0,
                TotalRevenue = 0
            };
        }

        public async Task<CustomerDto?> UpdateCustomerAsync(int id, UpdateCustomerDto dto)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return null;

            customer.Name = dto.Name;
            customer.ContactPerson = dto.ContactPerson;
            customer.Email = dto.Email;
            customer.Phone = dto.Phone;
            customer.Address = dto.Address;
            customer.IsActive = dto.IsActive;

            await _context.SaveChangesAsync();

            return await GetCustomerByIdAsync(id);
        }

        public async Task<bool> DeleteCustomerAsync(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
                return false;

            // Soft delete
            customer.IsActive = false;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
