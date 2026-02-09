using Microsoft.EntityFrameworkCore;
using FieldServiceCRM.Data;
using FieldServiceCRM.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Configure for Railway deployment (Consolidated)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5001";
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(int.Parse(port));
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=fieldservice.db";
builder.Services.AddDbContext<CrmDbContext>(options =>
    options.UseSqlite(connectionString));

// CORS policy for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register services
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IJobService, JobService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();
builder.Services.AddScoped<ITechnicianService, TechnicianService>();

// Removed the duplicate 'var port' and UseUrls call here

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Note: If Railway handles SSL termination for you, 
// you might sometimes need to disable UseHttpsRedirection in production.
app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();