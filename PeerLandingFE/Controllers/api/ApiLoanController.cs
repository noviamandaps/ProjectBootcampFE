﻿using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace PeerLandingFE.Controllers.api
{
    public class ApiLoanController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiLoanController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoanByUserId(string id)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7020/rest/v1/loan/GetAllLoansByUserId?userId={id}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Get list loans failed!");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoans(string status)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7020/rest/v1/loan/GetAllLoans/");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Get list loans failed!");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddLoanRequest([FromBody] ReqAddLoanDto reqAdd)
        {
            Console.WriteLine(reqAdd);
            if (reqAdd == null)
            {
                return BadRequest("Invalid loan data");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqAdd);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"https://localhost:7020/rest/v1/loan/NewLoan", content);

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to add loan");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLoan(string id, [FromBody] ReqUpdateLoanDto reqUpdate)
        {
            if (reqUpdate == null)
            {
                return BadRequest("Invalid loan data!");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqUpdate);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await _httpClient.PutAsync($"https://localhost:7020/rest/v1/loan/{id}", content);
            Console.WriteLine(response.ToString());

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to update loan");
            }
        }
    }
}
