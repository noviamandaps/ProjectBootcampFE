using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.DTO.Req
{
    public class ReqMstUserDto : Controller
    {
        public string Name { get; set; }
        public string Role { get; set; }
        public decimal Balance { get; set; }
    }
}
