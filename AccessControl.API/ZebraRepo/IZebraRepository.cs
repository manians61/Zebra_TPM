using System.Collections.Generic;
using System.Threading.Tasks;
using AccessControl.API.ZebraModels;

namespace AccessControl.API.ZebraRepo
{
    public interface IZebraRepository
    {
        Task<List<RMA_Receiving>> GetRmaReceiving(string receiving);
        void AddReceiving(RMA_Receiving receivings);
        Task<Tray_Detail> GetTrayDetail(string tray_ID);
        Task<List<string>> GetAvailableTray();
        Task<Zebra_Station> GetStation(int station_ID);
        Task<List<Zebra_Station>> GetOpenStations();

        Task<List<Zebra_Station>> GetStationsAll();
        Task<Zebra_User> GetUser(string user_ID);
        void UpdateUser(Zebra_User user);
        void DeleteUser(string user_ID);
        //void AddZebraLog()

        Task<List<Zebra_User>> GetUsers();

        Task<bool> UpdateTrayDetail(Tray_Detail detail);
        void AddZebraLog(Tray_Detail detail);
        void UpdateStation(Zebra_Station station);
        Task<List<Tray_Detail>> getTrayInStation(int station_ID);
        void UpdateDetails(List<Tray_Detail> details);
        void InsertTray(List<string> tray_IDs);
    }
}