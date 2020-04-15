using System;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.Models
{
    [Table("Report_Hub_User_Permission")]
    public class User_Permission
    {
       [ExplicitKey]
        public string User_ID { get; set; }
        public string Group_ID { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }
    }
}