using Microsoft.AspNetCore.Mvc;

namespace Social_Media_Application_with_Firebase.Controllers
{
    public class ProfileController : Controller
    {
        [HttpGet("/profile/{userId?}")]
        public IActionResult Index(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                // If no userId is provided, redirect to login
                return RedirectToAction("Login", "Auth");
            }

            ViewBag.UserId = userId;
            return View();
        }



    }
}
