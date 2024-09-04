using Microsoft.AspNetCore.Mvc;

namespace Social_Media_Application_with_Firebase.Controllers
{
    public class MyProfileController : Controller
    {
        [HttpGet("/MyProfile/{userId?}")]
        public IActionResult Index(string userId)
        {

            return View();
        }



    }
}
