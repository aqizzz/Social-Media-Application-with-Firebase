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
    name: "createPost",
    pattern: "posts/create",
    defaults: new { controller = "Home", action = "CreatePost" });

app.MapControllerRoute(
    name: "postDetail",
    pattern: "posts/post",
    defaults: new { controller = "Home", action = "PostDetail" });

app.MapControllerRoute(
    name: "viewProfile",
    pattern: "profile",
    defaults: new { controller = "Auth", action = "ViewProfile" });

app.MapControllerRoute(
    name: "editProfile",
    pattern: "profile/edit",
    defaults: new { controller = "Auth", action = "EditProfile" });

app.MapControllerRoute(
    name: "changePwd",
    pattern: "profile/edit/changePassword",
    defaults: new { controller = "Auth", action = "ChangePassword" });

app.MapControllerRoute(
    name: "login",
    pattern: "login",
    defaults: new { controller = "Auth", action = "Login" });

app.MapControllerRoute(
    name: "signup",
    pattern: "signup",
    defaults: new { controller = "Auth", action = "Signup" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
