using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;
using AccessControl.API.Dtos;
using AccessControl.API.Models;

namespace AccessControl.API.Data
{
    public interface IAuthRepository 
    {
         Task<bool> Register(User user);
         Task<User> Login(string user_ID, string password, int login_Type);
         Task<bool> UserExists(string user_ID);

         //Task<IEnumerable<UserAccessDto>> GetPermissions(string user_ID);
    }
}