using System;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.Models
{
    [Table("Permission_Group")]
    public class Permission_Group
    {

        public string Group_ID { get; set; }
        [ExplicitKey]
        public string Group_Name { get; set; }
        public DateTime LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }
    }
}