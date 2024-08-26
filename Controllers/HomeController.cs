using Microsoft.AspNetCore.Mvc;
using Social_Media_Application_with_Firebase.Models;
using System.Diagnostics;

namespace Social_Media_Application_with_Firebase.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
        public IActionResult Signup()
        {
            return View("~/Views/Auth/Signup.cshtml");
        }

        public IActionResult Login()
        {
            return View("~/Views/Auth/Login.cshtml");
        }
    }
}
