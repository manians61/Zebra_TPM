using System;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.Models
{
    [Table("Permission_Object")]
    public class Permission_Object
    {
        public string PermissionObj_ID { get; set; }
        [ExplicitKey]
        public string PermissionObj_Name { get; set; }
        public int PermissionObj_Type { get; set; }
        public bool IsActive { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }

    }
}