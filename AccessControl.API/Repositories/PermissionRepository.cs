using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccessControl.API.Domain;
using AccessControl.API.Dtos;
using AccessControl.API.Models;
using AccessControl.API.Repositories.DbConnection;
using Dapper;

namespace AccessControl.API.Repositories
{
    public class PermissionRepository : ConnectionRepositoryBase, IPermissionRepository
    {
        public PermissionRepository(IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory, 0)
        { }
        public async Task<IEnumerable<UserAccessDto>> GetAllPermissions(string user_ID)
        {
            var query = @"SELECT * FROM Admin.User_Permission_View WHERE User_ID = @user_ID";
            try
            {
                var result = await base.DbConnection.QueryMultipleAsync(query, new { user_ID });
                var users = await result.ReadAsync<UserAccessDto>();
                return users;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        public async Task<List<Permission_Group>> GetGroupsByUser(string user_ID)
        {
            var query = @"SELECT DISTINCT Group_Name, Group_ID FROM Admin.User_Permission_View WHERE User_ID = @user_ID";
            try
            {
                var groupFromRepo = await base.DbConnection.QueryAsync<Permission_Group>(query, new {user_ID});
                return groupFromRepo.Cast<Permission_Group>().ToList();
            }
            catch(Exception ex)
            {
                throw ex;
            }   

        }

        public async Task<List<string>> GetPermissionObjByUser(string user_ID, string group_ID)
        {
            var query = @"SELECT DISTINCT PermissionObj_Name FROM Admin.User_Permission_View WHERE User_ID = @user_ID AND Group_Name = @group_ID";
            try
            {
                var permissionObjFromRepo = await base.DbConnection.QueryAsync<string>(query, new {
                    user_ID,
                    group_ID
                });
                return permissionObjFromRepo.ToList();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
    }
}