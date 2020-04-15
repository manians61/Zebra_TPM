using AccessControl.API.Data;
using AccessControl.API.Models;
using AccessControl.API.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
namespace AccessControl.API.Controllers
{
    //[Authorize]
    [Route("api/auth/{user_ID}/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminRepository _repo;
        private readonly IPermissionRepository _permission;

        public AdminController(IAdminRepository repo, IPermissionRepository permission)
        {
            _repo = repo;
            _permission = permission;
        }
        [HttpPost("AddPermissionObject")]
        public async Task<IActionResult> AddPermissionObj(Permission_Object newObj, string user_ID)
        {
            //if(user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //return Unauthorized();
            newObj.LastUpdateBy = user_ID;
            var isAdded = await _repo.AddPermissionObject(newObj);

            if (isAdded)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpPost("AddPermissionGroup")]
        public async Task<IActionResult> AddPermissionGroup(Permission_Group group, string user_ID)
        {
             //if(user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //return Unauthorized();
            group.LastUpdateBy = user_ID;
            group.LastUpdateDate = DateTime.Now;
            var isAdded = await _repo.AddPermissionGroup(group);

            if (isAdded)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
        [HttpPost]
        [Route("AddGroupObject/{group_ID}")]
        public IActionResult AddGroupObject(string group_ID, List<Permission_Object> objects, string user_ID)
        {
            //if(user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            //return Unauthorized();
            List<Group_Object> objectToRepo = new List<Group_Object>();
            for (int i = 0; i < objects.Count; i++)
            {
                Group_Object group_Object = new Group_Object();
                group_Object.Group_ID = group_ID;
                group_Object.PermissionObj_ID = objects[i].PermissionObj_ID;
                group_Object.LastUpdateBy = user_ID;
                group_Object.LastUpdateDate = DateTime.Now;
                objectToRepo.Add(group_Object);
            }
            try
            {
                _repo.AddGourpObject(objectToRepo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }

        [HttpGet(Name = "getGroupObjects")]
        [Route("getgroupobjects/{group_ID}")]
        public async Task<IActionResult> GetGroupObjects(string group_ID, string user_ID)
        {
            if(user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var itemFromRepo = await _repo.GetGroupObjects(group_ID);

            return Ok(itemFromRepo);
        }
        [HttpPost("AddUserPermission")]
        public IActionResult AddPermissionToUser(List<User_Permission> permissions, string user_ID)
        {
            if (!user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            if (permissions.Count != 0 || permissions != null)
            {
                _repo.AddUserPermission(permissions);
                return StatusCode(201);
            }
            else
            {
                return BadRequest("Permission is Empty, Fail to add");
            }

        }
        [HttpPost("DeleteUserPermission")]
        public IActionResult DeleteUserPermission(User_Permission permission, string user_ID)
        {
            if (!user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            _repo.DeleteUserPermission(permission);

            return Ok();

        }
        [HttpPost("{group_ID}/DeleteGroupObject")]
        public IActionResult DeleteGroupObject(string group_ID, string user_ID, List<Permission_Object> objects)
        {
            List<Group_Object> objectToRepo = new List<Group_Object>();
            for (int i = 0; i < objects.Count; i++)
            {
                Group_Object group_Object = new Group_Object();
                group_Object.Group_ID = group_ID;
                group_Object.PermissionObj_ID = objects[i].PermissionObj_ID;
                group_Object.LastUpdateBy = user_ID;
                group_Object.LastUpdateDate = DateTime.Now;
                objectToRepo.Add(group_Object);
            }
            try
            {
                _repo.DeleteGroupObject(objectToRepo);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet]
        [Route("users")]
        public async Task<IActionResult> GetAllUsers()
        {

            var usersFromRepo = await _repo.GetUsers();

            if (usersFromRepo != null)
            {
                return Ok(usersFromRepo);
            }
            else
            {
                return BadRequest("Get users failed!");
            }

        }
        [HttpGet]
        [Route("users/{id}")]
        public async Task<IActionResult> GerUser(string id)
        {
            var userFromRepo = await _repo.GetUser(id);

            if (userFromRepo != null)
            {
                return Ok(userFromRepo);
            }
            else
            {
                return BadRequest("User Doesn't Exist !!");
            }
        }
        [HttpGet]
        [Route("groups/{id}")]
        public async Task<IActionResult> GetPermissionGroup(string id)
        {
            var itemFromRepo = await _repo.GetPermission_Group(id);

            if (itemFromRepo != null)
            {
                return Ok(itemFromRepo);
            }
            else
            {
                return BadRequest("Permission Group Doesn't Exist !!");
            }
        }
        [HttpGet]
        [Route("groups")]
        public async Task<IActionResult> GetPermissionGroups()
        {
            var itemsFromRepo = await _repo.GetPermission_Groups();

            if (itemsFromRepo.Count != 0 && itemsFromRepo != null)
            {
                return Ok(itemsFromRepo);
            }
            else
            {
                return BadRequest("No Items in the Datebase!");
            }
        }
        [HttpPut]
        [Route("updateUser/{id}")]
        public IActionResult UpdateUser(string id, User user, string user_ID)
        {
            if (!user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            user.LastUpdateBy = user_ID;
            user.LastUpdateDate = DateTime.Now;
            var isUpdated = _repo.UpdateUser(id, user);

            if (isUpdated)
            {
                return NoContent();
            }
            else
            {
                throw new Exception($"Updating user {id} failed");
            }
        }
        [HttpPut]
        [Route("UpdatePermissionGroup/{id}")]
        public IActionResult UpdatePermissionGroup(string id, string user_ID, Permission_Group permission_Group)
        {
            if (!user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            permission_Group.LastUpdateBy = user_ID;
            permission_Group.LastUpdateDate = DateTime.Now;
            var isUpdated = _repo.UpdatePermissionGroup(id, permission_Group);

            if (isUpdated)
            {
                return NoContent();
            }
            else
            {
                throw new Exception($"Updating Permission Group: {id} failed");
            }
        }
        [HttpPut]
        [Route("UpdatePermissionObj/{id}")]
          public IActionResult UpdatePermissionObj(string id, string user_ID,
           Permission_Object permission_Object)
        {
            if (!user_ID.Equals(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            permission_Object.LastUpdateBy = user_ID;
            permission_Object.LastUpdateDate=DateTime.Now;
            var isUpdated = _repo.UpdatePermissionObject(id, permission_Object);

            if (isUpdated)
            {
                return NoContent();
            }
            else
            {
                throw new Exception($"Updating Permission Object: {id} failed");
            }
        }

    }
}