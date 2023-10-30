using API.Data;
using API.Extensions;
using API.Middleware;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();

// Configure the HTTP request pipeline.

// app.UseMiddleware<ExceptionMiddleware>();
app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().WithOrigins("https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

var scope = app.Services.CreateScope();// give access all of the services that we have inside program class
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>(); // making connection with data base or context
    await context.Database.MigrateAsync(); // updating data context like tables or schema
    await Seed.SeedUsers(context); // add some initial data in to database by calling this method
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger.LogError(ex, "AN error Occured during migration");
}

app.Run();
