using System;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.ZebraModels
{
    [Table("F034.Zebra_Tray_Detail")]
    public class Tray_Detail
    {
        [ExplicitKey]
        public string Tray_ID { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; }
        public int Tray_Item_Count { get; set; }
        public bool IsEmpty { get; set; }
        public int Current_Station_ID { get; set; }
        public int Scrap_Count { get; set; }
        public string RMA_No { get; set; }
        public string PN { get; set; }
        public string Station_User_ID { get; set; }
        public int Current_Item_Count{ get; set; }        
        public string LastModifyBy { get; set; }
        public DateTime LastModifyDate { get; set; }
        public string Station_Name { get; set; }
        public int Next_Station_ID{ get; set; }
        public string Next_Station_Name { get; set; }
    }
}