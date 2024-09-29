using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class BorrowerLoanController : Controller
    {
        public IActionResult Index()
        {
            ViewData["ControllerName"] = "Borrower";
            ViewData["LinkText"] = "Borrower";
            return View();
        }
    }
}
