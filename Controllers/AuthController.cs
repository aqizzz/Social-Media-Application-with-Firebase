using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Social_Media_Application_with_Firebase.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Signup()
        {
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }

        public IActionResult ChangePassword()
        {
            return View();
        }

    }
}
