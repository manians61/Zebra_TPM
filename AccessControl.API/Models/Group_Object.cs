using System;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.Models
{
    [Table("Group_Object")]
    public class Group_Object
    {
        public string Group_ID { get; set; } 
        public string PermissionObj_ID { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }

    }
}