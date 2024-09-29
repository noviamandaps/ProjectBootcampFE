using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class LenderController : Controller
    {
        public IActionResult Dashboard()
        {
            ViewData["ControllerName"] = "Lender";
            ViewData["LinkText"] = "Lender";
            return View();
        }
    }
}


