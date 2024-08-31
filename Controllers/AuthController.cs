using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;

namespace Social_Media_Application_with_Firebase.Controllers
{
    public class AuthController : Controller
    {
        public IActionResult Signup()
        {
            return View("~/Views/Auth/Signup.cshtml");
        }

        public IActionResult Login()
        {
            return View("~/Views/Auth/Login.cshtml");
        }

        public IActionResult EditProfile()
        {
            return View("~/Views/Auth/EditProfile.cshtml");
        }

        public IActionResult ViewProfile()
        {
            return View("~/Views/Auth/ViewProfile.cshtml");
        }

        public IActionResult ChangePassword()
        {
            return View("~/Views/Auth/ChangePassword.cshtml");
        }

    }
}
