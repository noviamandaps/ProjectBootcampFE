using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace PeerLandingFE.Controllers.api
{
    public class ApiControllerBorrower
    {
        [Route("Borrower/[controller]/[action]")]
        [ApiController]
        public class ApiBorrowerController : Controller
        {
            private readonly HttpClient _httpClient;
            public ApiBorrowerController(HttpClient httpClient)
            {
                _httpClient = httpClient;
            }
            [HttpGet]
            public async Task<IActionResult> GetUserById(string id)
            {
                if (string.IsNullOrEmpty(id))
                {
                    return BadRequest("User ID cannot be null or empty");
                }

                var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.GetAsync($"https://localhost:7299/rest/v1/user/UserById?Id={id}");

                if (response.IsSuccessStatusCode)
                {
                    var jsonData = await response.Content.ReadAsStringAsync();
                    return Ok(jsonData);
                }
                else
                {
                    return BadRequest("failed to fetch user");
                }
            }


        }
    }
}
