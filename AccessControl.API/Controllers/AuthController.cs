using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AccessControl.API.Data;
using AccessControl.API.Dtos;
using AccessControl.API.Models;
using AccessControl.API.Repositories;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AccessControl.API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;

        public AuthController(IAuthRepository repo, IConfiguration config, IMapper mapper)
        {

            _repo = repo;
            _config = config;
            _mapper = mapper;
        }
        [HttpPost("Login", Name = "Login")]
        public async Task<IActionResult> Login([FromBody]UserForLoginDto userForLoginDto)
        {
            int type = 0;
            switch (userForLoginDto.Login_Type.ToLower())
            {
                case "local":
                    type = 1;
                    break;
                case "domain":
                    type = 2;
                    break;
                case "myservice":
                    type = 3;
                    break;
            }
            var userFromRepo = await _repo.Login(userForLoginDto.user_ID, userForLoginDto.Password, type);

            if (userFromRepo == null)
            {
                return Unauthorized();
            }

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.User_ID),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            var user = _mapper.Map<UserAccessDto>(userFromRepo);

            return Ok(new
            {
                token = tokenHandler.WriteToken(token),
                user
            });
        }
        [HttpPost("register")]
        public async Task<IActionResult> register(User user)
        {   
            user.LastUpdateDate = DateTime.Now;
            user.LastUpdateBy = user.User_ID;
            var createUser = await _repo.Register(user);

            return StatusCode(201);

        }



    }


}