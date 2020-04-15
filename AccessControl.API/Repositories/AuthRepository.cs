using System.Data.SqlClient;
using System.Threading.Tasks;
using AccessControl.API.Models;
using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data;
using System;
using AccessControl.API.Data;
using AccessControl.API.Repositories.DbConnection;
using AccessControl.API.Domain;
using Dapper.Contrib.Extensions;
using System.Collections.Generic;
using AccessControl.API.Dtos;

namespace AccessControl.API.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly IConfiguration _iConfig;
        public AuthRepository(IConfiguration iConfig)
        {
            _iConfig = iConfig;
        }
        private SqlConnection GetConnection(int login_Type)
        {

            var conStr = "";
            switch (login_Type)
            {
                case 3:
                    conStr = _iConfig.GetSection("Local_ConnectionStrings").GetSection("QasConnection").Value;
                    break;
                case 2:
                    conStr = _iConfig.GetSection("ConnectionStrings").GetSection("MysConnection").Value;
                    break;
                case 1:
                    conStr = _iConfig.GetSection("Local_ConnectionStrings").GetSection("PrdUltronConnection").Value;
                    break;
            }

            return new SqlConnection(conStr);
        }

        public async Task<User> Login(string user_ID, string password, int login_Type)
        {

            try
            {
                using (SqlConnection DbConnection = GetConnection(login_Type))
                {

                    var user = await DbConnection.GetAsync<User>(user_ID);

                    if (user == null)
                    {
                        return null;
                    }
                    if (!user.Password.Equals(password))
                        return null;
                    // if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                    // {
                    //     return null;
                    // }
                    return user;
                }

            }
            catch (Exception ex)
            {
                //log function();

                return null;
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                    {
                        return false;
                    }
                }
            }
            return true;
        }
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }


        public async Task<bool> Register(User new_User)
        {

            byte[] passwordHash, passwordSalt;
            //pass reference into method by using "out keyboard"
            CreatePasswordHash(new_User.Password, out passwordHash, out passwordSalt);

            new_User.PasswordHash = passwordHash;
            new_User.PasswordSalt = passwordSalt;

            try
            {
                using (SqlConnection DbConnection = GetConnection(1))
                {

                    var user = await DbConnection.GetAsync<User>(new_User.User_ID);
                    if (user == null)
                    {
                        new_User.LastUpdateDate = DateTime.Now;
                        new_User.LastUpdateBy = new_User.User_ID;
                        try
                        {
                            await DbConnection.InsertAsync(new_User);
                            return true;
                        }catch(Exception ex){
                            return false;
                        }
                    }
                    else
                    {
                        return false;
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UserExists(string user_ID)
        {
            using (SqlConnection DbConnection = GetConnection(1))
            {
                try
                {
                    return await DbConnection.ExecuteScalarAsync<bool>
                    ("SELECT COUNT(1) FROM Admin.Report_Hub_User WHERE User_ID = @user_ID", new { @user_ID = user_ID });
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
        }
    }
}