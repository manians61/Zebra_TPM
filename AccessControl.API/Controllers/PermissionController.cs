using System.Security.Claims;
using System.Threading.Tasks;
using AccessControl.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccessControl.API.Controllers
{   
    [Authorize]
    [ApiController]
    [Route("api/auth/[controller]")]
    public class PermissionController : ControllerBase
    {
        private readonly IPermissionRepository _repo;
        public PermissionController(IPermissionRepository repo)
        {
            _repo = repo;

        }
        [HttpPost("Permit")]
        public async Task<IActionResult> GetPermissions([FromBody]string User_ID)
        {
            var permissionForUser = await _repo.GetAllPermissions(User_ID);
            return Ok(permissionForUser);
        }
        [HttpGet("{user_ID}", Name = "getgroup")]
        public async Task<IActionResult> GetGroupsByUser(string user_ID)
        {
            var test = User.FindFirst(ClaimTypes.NameIdentifier).Value;
            if (!user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var groupFromRepo = await _repo.GetGroupsByUser(user_ID);

            if (groupFromRepo.Count == 0 || groupFromRepo == null)
            {
                return BadRequest("User Doesn't aquire any application permission");
            }
            return Ok(groupFromRepo);
        }
        [HttpPost("userPermission")]
        [Route("userPermission/{user_ID}")]
        public async Task<IActionResult> GetPermissionObjectsByUser(string user_ID,string group_ID)
        {
            if (!user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var itemFromRepo = await _repo.GetPermissionObjByUser(user_ID, group_ID);

            if (itemFromRepo.Count == 0 || itemFromRepo == null)
            {
                return BadRequest("User doesn't aquire any permissions under this application");
            }
            return Ok(itemFromRepo);
        }
    }
}