using Microsoft.AspNetCore.Mvc;

namespace Social_Media_Application_with_Firebase.Controllers
{
    public class SearchController : Controller
    {
        public IActionResult Index(string query)
        {
            ViewBag.Query = query;
            return View();
        }
    }
}
