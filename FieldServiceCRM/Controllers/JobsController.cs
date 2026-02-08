using Microsoft.AspNetCore.Mvc;
using FieldServiceCRM.DTOs;
using FieldServiceCRM.Services;

namespace FieldServiceCRM.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobsController : ControllerBase
    {
        private readonly IJobService _jobService;

        public JobsController(IJobService jobService)
        {
            _jobService = jobService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JobDto>>> GetAllJobs(
            [FromQuery] int? customerId = null,
            [FromQuery] int? technicianId = null,
            [FromQuery] DateTime? startDate = null,
            [FromQuery] DateTime? endDate = null)
        {
            IEnumerable<JobDto> jobs;

            if (customerId.HasValue)
            {
                jobs = await _jobService.GetJobsByCustomerIdAsync(customerId.Value);
            }
            else if (technicianId.HasValue)
            {
                jobs = await _jobService.GetJobsByTechnicianIdAsync(technicianId.Value);
            }
            else if (startDate.HasValue && endDate.HasValue)
            {
                jobs = await _jobService.GetJobsByDateRangeAsync(startDate.Value, endDate.Value);
            }
            else
            {
                jobs = await _jobService.GetAllJobsAsync();
            }

            return Ok(jobs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JobDto>> GetJob(int id)
        {
            var job = await _jobService.GetJobByIdAsync(id);
            if (job == null)
                return NotFound();

            return Ok(job);
        }

        [HttpPost]
        public async Task<ActionResult<JobDto>> CreateJob(CreateJobDto dto)
        {
            var job = await _jobService.CreateJobAsync(dto);
            return CreatedAtAction(nameof(GetJob), new { id = job.Id }, job);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<JobDto>> UpdateJob(int id, UpdateJobDto dto)
        {
            var job = await _jobService.UpdateJobAsync(id, dto);
            if (job == null)
                return NotFound();

            return Ok(job);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteJob(int id)
        {
            var result = await _jobService.DeleteJobAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
