using System;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.Models
{
    [Table("Admin.Report_Hub_User")]
    public class User
    {
        [ExplicitKey]
        public string User_ID { get; set; }
        public string Username { get; set; }
        public int UserType { get; set; }
        public string Password { get; set; }
        public bool IsActive { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public string LastUpdateBy{ get; set; }
        public byte[] PasswordHash{ get; set; }
        public byte[] PasswordSalt { get; set; }
    }
}                                                                                                 