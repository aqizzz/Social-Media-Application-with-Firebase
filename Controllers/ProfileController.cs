﻿using Microsoft.AspNetCore.Mvc;

namespace Social_Media_Application_with_Firebase.Controllers
{
    public class ProfileController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }


        public IActionResult Edit()
        {
            return View();
        }
    }
}
