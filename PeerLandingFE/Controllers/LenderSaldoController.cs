
using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class LenderSaldoController : Controller
    {
        public IActionResult Index()
        {
            ViewData["ControllerName"] = "Lender";
            ViewData["LinkText"] = "Lender";
            return View();
        }
    }
}


