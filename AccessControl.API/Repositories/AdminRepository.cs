using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccessControl.API.Domain;
using AccessControl.API.Models;
using AccessControl.API.Repositories.DbConnection;
using Dapper;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.Data
{
    public class AdminRepository : ConnectionRepositoryBase, IAdminRepository
    {
        public AdminRepository(IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory, 1)
        { }

        public void Add<T>(T entity) where T : class
        {
            base.DbConnection.InsertAsync(entity);
        }

        public void AddGourpObject(List<Group_Object> group_Objects)
        {
            try
            {
                var result = base.DbConnection.InsertAsync(group_Objects);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> AddPermissionGroup(Permission_Group newGroup)
        {
            var lastID = await base.DbConnection.QueryFirstAsync<string>("SELECT MAX(Group_ID) FROM Admin.Permission_Group");
            if (await base.DbConnection.GetAsync<Permission_Group>(newGroup.Group_Name.ToLower()) == null)
            {

                newGroup.Group_ID = "gp" + String.Format("{0:D5}", Int32.Parse(lastID.Substring(2)) + 1);
                newGroup.LastUpdateDate = DateTime.Now;
                await base.DbConnection.InsertAsync(newGroup);
                return true;
            }
            return false;
        }

        public async Task<bool> AddPermissionObject(Permission_Object newObject)
        {
            var lastID = await base.DbConnection.QueryFirstAsync<string>("SELECT MAX(PermissionObj_ID) FROM Admin.Permission_Object WHERE PermissionObj_Type = @id",
                new
                {
                    @id = newObject.PermissionObj_Type
                });
            if (await base.DbConnection.GetAsync<Permission_Object>(newObject.PermissionObj_Name) == null)
            {
                newObject.PermissionObj_Name = newObject.PermissionObj_Name;
                newObject.PermissionObj_Type = newObject.PermissionObj_Type;
                newObject.PermissionObj_ID = "poid" + (Int32.Parse(lastID.Substring(4)) + 1).ToString();
                newObject.LastUpdateDate = DateTime.Now;
                newObject.LastUpdateBy = newObject.LastUpdateBy;
                newObject.IsActive = true;
                await base.DbConnection.InsertAsync(newObject);
                return true;
            }
            else
            {
                return false;
            }


        }
        public void AddUserPermission(List<User_Permission> user_Permissions)
        {
            try
            {
                base.DbConnection.InsertAsync(user_Permissions);

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<Permission_Group> GetPermission_Group(string group_ID)
        {
            try
            {
                var itemFromDb = await base.DbConnection.GetAsync<Permission_Group>(group_ID);
                return itemFromDb;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<Permission_Group>> GetPermission_Groups()
        {
            string query = @"SELECT * FROM Admin.Permission_Group";

            var result = await base.DbConnection.QueryAsync<Permission_Group>(query);

            return result.ToList();
        }

        public async Task<List<Permission_Object>> GetGroupObjects(string group_ID)
        {
            string query = @"SELECT PermissionObj_ID, PermissionObj_Name, PermissionObj_Type, 
                            IsActive FROM Admin.Group_Permission_Detail_View WHERE Group_ID = @group_ID";

            var result = await base.DbConnection.QueryAsync<Permission_Object>(query, new { group_ID });

            return result.ToList();
        }

        public async Task<User> GetUser(string user_ID)
        {


            var result = await base.DbConnection.GetAsync<User>(user_ID);

            return result;

        }

        public async Task<List<User>> GetUsers()
        {

            var result = await base.DbConnection.GetAllAsync<User>();

            return result.ToList();
        }

        public bool UpdateUser(string user_ID, User user)
        {
            var userFromDb = base.DbConnection.Get<User>(user.User_ID);
            if (userFromDb != null)
            {
                user.LastUpdateBy = user_ID;
                user.LastUpdateDate = DateTime.Now;
                return base.DbConnection.Update(user);
            }
            return false;
        }

        public bool UpdatePermissionGroup(string user_ID, Permission_Group group)
        {
            var itemFromDb = base.DbConnection.Get<Permission_Group>(group.Group_ID);
            if (itemFromDb != null)
            {
                itemFromDb.LastUpdateBy = user_ID;
                itemFromDb.LastUpdateDate = DateTime.Now;
                return base.DbConnection.Update(group);
            }
            return false;
        }

        public bool UpdatePermissionObject(string user_ID, Permission_Object permission_Object)
        {
            var itemFromDb = base.DbConnection.Get<User>(permission_Object.PermissionObj_ID);
            if (itemFromDb != null)
            {
                itemFromDb.LastUpdateBy = user_ID;
                itemFromDb.LastUpdateDate = DateTime.Now;
                return base.DbConnection.Update(permission_Object);
            }
            return false;
        }

        public void DeleteUserPermission(User_Permission permission)
        {
            string query = @"Delete From Admin.User_Permission_View Where 
                            User_ID = @user_ID AND Group_ID = @group_ID";
            base.DbConnection.Execute(query, new
            {
                @group_ID = permission.Group_ID,
                @user_ID = permission.User_ID

            });

        }

        public void DeleteGroupObject(List<Group_Object> group_Objects)
        {
            try
            {
                var result = base.DbConnection.DeleteAsync(group_Objects);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



    }
}