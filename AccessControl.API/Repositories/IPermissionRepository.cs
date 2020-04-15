using System.Collections.Generic;
using System.Threading.Tasks;
using AccessControl.API.Dtos;
using AccessControl.API.Models;

namespace AccessControl.API.Repositories
{
    public interface IPermissionRepository
    {
         Task<IEnumerable<UserAccessDto>> GetAllPermissions(string user_ID);
         Task<List<Permission_Group>> GetGroupsByUser(string user_ID);
         Task<List<string>> GetPermissionObjByUser(string user_ID, string group_ID);
         
         
    }
}