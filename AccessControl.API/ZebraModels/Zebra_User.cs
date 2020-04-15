using System;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.ZebraModels
{
    [Table("F034.Zebra_User_Logs")]
    public class Zebra_User
    {
        [ExplicitKey]
        public string User_ID { get; set; }
        public int User_Station_ID { get; set; }
        public DateTime User_Login_Time { get; set; }
        public DateTime LastModifyDate { get; set; }
        public string LastUpdateBy { get; set; }
    }
}