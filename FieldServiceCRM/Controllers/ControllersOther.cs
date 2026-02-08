using Microsoft.AspNetCore.Mvc;
using FieldServiceCRM.DTOs;
using FieldServiceCRM.Services;

namespace FieldServiceCRM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;

        public InvoicesController(IInvoiceService invoiceService)
        {
            _invoiceService = invoiceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceDto>>> GetAllInvoices([FromQuery] int? customerId = null)
        {
            var invoices = customerId.HasValue
                ? await _invoiceService.GetInvoicesByCustomerIdAsync(customerId.Value)
                : await _invoiceService.GetAllInvoicesAsync();

            return Ok(invoices);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDto>> GetInvoice(int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(id);
            if (invoice == null)
                return NotFound();

            return Ok(invoice);
        }

        [HttpPost]
        public async Task<ActionResult<InvoiceDto>> CreateInvoice(CreateInvoiceDto dto)
        {
            var invoice = await _invoiceService.CreateInvoiceAsync(dto);
            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<InvoiceDto>> UpdateInvoice(int id, UpdateInvoiceDto dto)
        {
            var invoice = await _invoiceService.UpdateInvoiceAsync(id, dto);
            if (invoice == null)
                return NotFound();

            return Ok(invoice);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteInvoice(int id)
        {
            var result = await _invoiceService.DeleteInvoiceAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("{id}/pdf")]
        public async Task<ActionResult> GenerateInvoicePdf(int id)
        {
            try
            {
                var pdfBytes = await _invoiceService.GenerateInvoicePdfAsync(id);
                return File(pdfBytes, "application/pdf", $"invoice-{id}.pdf");
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class TechniciansController : ControllerBase
    {
        private readonly ITechnicianService _technicianService;

        public TechniciansController(ITechnicianService technicianService)
        {
            _technicianService = technicianService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TechnicianDto>>> GetAllTechnicians()
        {
            var technicians = await _technicianService.GetAllTechniciansAsync();
            return Ok(technicians);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TechnicianDto>> GetTechnician(int id)
        {
            var technician = await _technicianService.GetTechnicianByIdAsync(id);
            if (technician == null)
                return NotFound();

            return Ok(technician);
        }

        [HttpPost]
        public async Task<ActionResult<TechnicianDto>> CreateTechnician(CreateTechnicianDto dto)
        {
            var technician = await _technicianService.CreateTechnicianAsync(dto);
            return CreatedAtAction(nameof(GetTechnician), new { id = technician.Id }, technician);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<TechnicianDto>> UpdateTechnician(int id, UpdateTechnicianDto dto)
        {
            var technician = await _technicianService.UpdateTechnicianAsync(id, dto);
            if (technician == null)
                return NotFound();

            return Ok(technician);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteTechnician(int id)
        {
            var result = await _technicianService.DeleteTechnicianAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
