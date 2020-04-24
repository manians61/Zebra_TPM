using Dapper.Contrib.Extensions;

namespace AccessControl.API.ZebraModels
{
    [Table("F034.Zebra_Station")]
    public class Zebra_Station
    {
        [ExplicitKey]
        public int Station_ID { get; set; }
        public string Station_Name { get; set; }
        public bool Station_Status { get; set; }
        public string LastModifyBy { get; set; }
        public int Next_Station_ID { get; set; }
    }
}