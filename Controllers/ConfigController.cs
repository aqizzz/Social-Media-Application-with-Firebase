using Microsoft.AspNetCore.Mvc;

namespace Social_Media_Application_with_Firebase.Controllers
{
    public class ConfigController : Controller
    {
        private readonly string _firebaseConfig;

        public ConfigController(string firebaseConfig)
        {
            _firebaseConfig = firebaseConfig;
        }

        [HttpGet]
        public IActionResult GetFirebaseConfig()
        {
            return Content(_firebaseConfig, "application/json");
        }
    }
}
