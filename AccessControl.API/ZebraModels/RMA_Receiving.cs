using System;
using Dapper.Contrib.Extensions;

namespace AccessControl.API.ZebraModels
{
    [Table("F034.Zebra_RMA_Receiving")]
    public class RMA_Receiving
    {
        public string PN { get; set; }
        [ExplicitKey]
        public string RMANO { get; set; }
        public int RECEIVE_QTY { get; set; }
        public DateTime CreateDate { get; set; }
        public string CreateBy { get; set; }
        public string Tray_ID { get; set; }
    }
}