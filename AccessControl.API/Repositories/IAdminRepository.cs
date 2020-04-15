using System.Collections.Generic;
using System.Threading.Tasks;
using AccessControl.API.Models;

namespace AccessControl.API.Data
{
    public interface IAdminRepository
    {
        Task<bool> AddPermissionObject(Permission_Object newObject);
        Task<bool> AddPermissionGroup(Permission_Group newGroup);
        void AddGourpObject(List<Group_Object> group_Objects);
        void AddUserPermission(List<User_Permission> user_Permissions);
        Task<List<Permission_Object>> GetGroupObjects(string group_ID);
        Task<User> GetUser(string user_ID);
        Task<List<User>> GetUsers();
        Task<Permission_Group> GetPermission_Group(string group_ID);
        Task<List<Permission_Group>> GetPermission_Groups();
        bool UpdateUser(string user_ID, User user);
        bool UpdatePermissionGroup(string group_ID, Permission_Group group);
        bool UpdatePermissionObject(string permissionObj_ID, Permission_Object permission_Object);
        void DeleteUserPermission(User_Permission permission);
        void DeleteGroupObject(List<Group_Object> group_Objects);
    }
}