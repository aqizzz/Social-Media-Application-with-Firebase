using DotNetEnv;
using Newtonsoft.Json;

var builder = WebApplication.CreateBuilder(args);

// Load environment variables from .env file
DotNetEnv.Env.Load();


// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddSingleton(provider =>
{
    var firebaseConfig = new
    {
        apiKey = Environment.GetEnvironmentVariable("FIREBASE_API_KEY"),
        authDomain = Environment.GetEnvironmentVariable("FIREBASE_AUTH_DOMAIN"),
        projectId = Environment.GetEnvironmentVariable("FIREBASE_PROJECT_ID"),
        storageBucket = Environment.GetEnvironmentVariable("FIREBASE_STORAGE_BUCKET"),
        messagingSenderId = Environment.GetEnvironmentVariable("FIREBASE_MESSAGING_SENDER_ID"),
        appId = Environment.GetEnvironmentVariable("FIREBASE_APP_ID"),
        measurementId = Environment.GetEnvironmentVariable("FIREBASE_MEASUREMENT_ID")
    };

    return Newtonsoft.Json.JsonConvert.SerializeObject(firebaseConfig);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
