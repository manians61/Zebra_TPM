using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccessControl.API.Domain;
using AccessControl.API.Repositories.DbConnection;
using AccessControl.API.ZebraModels;
using Dapper;
using Dapper.Contrib.Extensions;
using System.Linq;
using System.Data;

namespace AccessControl.API.ZebraRepo
{
    public class ZebraRepository : ConnectionRepositoryBase, IZebraRepository
    {

        public ZebraRepository(IDbConnectionFactory dbConnectionFactory) : base(dbConnectionFactory, 0)
        { }
        public async Task<List<RMA_Receiving>> GetRmaReceiving(string rma_No)
        {
            var itemFromDb = await base.DbConnection.QueryAsync<RMA_Receiving>
            ("MYS.sp_RMA_Info",
            new { RMA_NO = rma_No }, commandType: CommandType.StoredProcedure);

            return itemFromDb.ToList();

        }

        public void DeleteUser(string user_ID)
        {
            base.DbConnection.Delete(user_ID);
        }

        public async Task<List<string>> GetAvailableTray()
        {
            string query = @"Select Tray_ID From F034.Zebra_Tray_Detail WHERE IsEmpty = @isEmpty Order By Tray_ID ASC";

            var result = await base.DbConnection.QueryAsync<string>(query, new
            {
                @isEmpty = true,

            });
            if (result != null)
            {
                return result.ToList();
            }
            else
            {
                return null;
            }
        }

        public async Task<Zebra_Station> GetStation(int station_ID)
        {
            string query = @"Select * From F034.Zebra_Station where Station_ID = @id";

            var result = await base.DbConnection.QueryFirstOrDefaultAsync<Zebra_Station>(query, new
            {
                @id = station_ID
            });

            return result;

        }

        public async Task<Tray_Detail> GetTrayDetail(string tray_ID)
        {
            string query = @"select Top(1) * From F034.Zebra_TPM_View WHERE tray_ID = @id ORDER BY LastModifyDate DESC";
            var result = await base.DbConnection.QueryFirstOrDefaultAsync<Tray_Detail>(query, new
            {
                @id = tray_ID
            });
            return result;
        }

        public async Task<Zebra_User> GetUser(string user_ID)
        {
            syncUserID();
            throw new NotImplementedException();
        }

        public async Task<List<Zebra_User>> GetUsers()
        {
            syncUserID();
            var usersFromDb = await base.DbConnection.GetAllAsync<Zebra_User>();

            return usersFromDb.ToList();
        }

        public void UpdateUser(Zebra_User user)
        {
            base.DbConnection.Update(user);
        }
        public async void syncUserID()
        {
            string query = @"Select DISTINCT User_ID FROM Admin.User_Permission_View WHERE Group_ID IN (@id, @id_admin) ";

            var result = await base.DbConnection.QueryAsync<Zebra_User>(query, new
            {
                @id = "gp000012",
                @id_admin = "gp000012"
            });
            var userFromZebra = result.Select(x => x.User_ID).ToList();
            var usersFromDb = await base.DbConnection.GetAllAsync<Zebra_User>();
            var temp = usersFromDb.Select(x => x.User_ID).ToList();
            var newRes = userFromZebra.Except(temp).ToList();
            base.DbConnection.Insert(result);
        }

        public async Task<bool> UpdateTrayDetail(Tray_Detail detail)
        {
            // if (await GetTrayDetail(detail.Tray_ID) == null)
            // {
            //     Tray_Detail newTray = new Tray_Detail();
            //     newTray.Tray_ID = detail.Tray_ID;
            //     newTray.IsEmpty = true;
            //     newTray.CreateDate = DateTime.Now;
            //     newTray.CreateBy = detail.LastModifyBy;
            //     newTray.LastModifyBy = detail.LastModifyBy;
            //     newTray.Tray_Item_Count = 0;
            //     newTray.Scrap_Count = 0;
            //     newTray.Current_Station_ID = 0;
            //     newTray.LastModifyDate = DateTime.Now;
            //     base.DbConnection.Insert(newTray);
            // }

            string query = @"UPDATE F034.Zebra_Tray_Detail 
            SET Scrap_Count = @number,
            LastModifyBy = @user_ID,
            LastModifyDate = @date,
            IsEmpty = @isEmpty,
            Tray_Item_Count = @tray_item_count,
            Current_Station_ID = @station,
            Next_Station_ID = @next_Station
            WHERE Tray_ID = @tray_ID; 
            INSERT INTO F034.Zebra_Transaction_Logs
            (Station_Name, Tray_ID, RMA_No, PN, Station_User_ID, Current_Item_Count,
            Scrap_Count, LastModifyBy, LastModifyDate, IsEmpty, Tray_Item_Count, Current_Station_ID) VALUES
            (@station_name, @tray_ID, @rma, @pn, @station_user_ID, @current_count,
            @number, @user_ID,@date,@isEmpty,@tray_item_count,@station)";
            try
            {
                var res = await base.DbConnection.QueryMultipleAsync(query, new
                {
                    @number = detail.Scrap_Count,
                    @user_ID = detail.LastModifyBy,
                    @tray_ID = detail.Tray_ID.ToUpper(),
                    @date = DateTime.Now,
                    @isEmpty = detail.IsEmpty,
                    @tray_item_count = detail.Tray_Item_Count,
                    @station = detail.Current_Station_ID,
                    @station_name = detail.Station_Name,
                    @rma = detail.RMA_No,
                    @pn = detail.PN,
                    @next_station = detail.Next_Station_ID,
                    @current_count = detail.Current_Item_Count,
                    @station_user_ID = detail.LastModifyBy
                });
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }



        }

        public void AddReceiving(RMA_Receiving receiving)
        {
            receiving.CreateDate = DateTime.Now;
            try
            {
                base.DbConnection.Insert(receiving);
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        public async Task<List<Zebra_Station>> GetOpenStations()
        {
            var itemFromDb = await base.DbConnection.GetAllAsync<Zebra_Station>();

            return itemFromDb.Where(x => x.Station_Status == true).ToList();
        }
             public async Task<List<Zebra_Station>> GetStationsAll()
        {
            var itemFromDb = await base.DbConnection.GetAllAsync<Zebra_Station>();

            return itemFromDb.ToList();
        }
        //unUse
        public void AddZebraLog(Tray_Detail detail)
        {

            string query = @"INSERT INTO Admin.Zebra_Transaction_Logs
             (Station_Name, Tray_ID, RMA_No, PN, Station_User_ID, Current_Item_Count,
             Scrap_Count, LastModifyBy, LastModifyDate, IsEmpty, Tray_Item_Count, Current_Station_ID) VALUES
              (@station_name, @tray_ID, @rma, @pn, @station_user_ID, @current_count,
              @scrap, @lastby,@lastdate,@isEmpty,@tray_item_count,@station_ID)";
            if (detail.Station_User_ID == null)
            {
                detail.Station_User_ID = "admin";
            }
            base.DbConnection.ExecuteAsync(query, new
            {

                @tray_ID = detail.Tray_ID,
                @rma = detail.RMA_No,

                @station_user_ID = detail.Station_User_ID,

                @scrap = detail.Scrap_Count,
                @lastby = detail.LastModifyBy,
                @lastdate = DateTime.Now,
                @isEmpty = detail.IsEmpty,
                @tray_item_count = detail.Tray_Item_Count,
                @station_ID = detail.Current_Station_ID
            });
        }

        public void UpdateStation(Zebra_Station station)
        {
            string query = @"Update F034.Zebra_Station SET Station_Status = @status, LastModifyBy = @lastby
            WHERE Station_ID = @id";
            try
            {
                base.DbConnection.Execute(query, new
                {
                    @id = station.Station_ID,
                    @status = station.Station_Status,
                    @lastby = station.LastModifyBy
                });
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }

        public async Task<List<Tray_Detail>> getTrayInStation(int station_ID)
        {
            string query = @"select * From F034.Zebra_Tray_Detail WHERE Current_Station_ID = @id AND IsEmpty = @isEmpty";
            var result = await base.DbConnection.QueryAsync<Tray_Detail>(query, new
            {
                @id = station_ID,
                @isEmpty = false
            });
            return result.ToList();
        }

        public void UpdateDetails(List<Tray_Detail> details)
        {
            string query = @"Update F034.Zebra_Tray_Detail SET Current_Station_ID = @station_id, LastModifyBy = @lastby
            WHERE Current_Station_ID = @id";
            for (int i = 0; i < details.Count; i++)
            {
                details[i].LastModifyDate = DateTime.Now;
                try
                {
                    base.DbConnection.Query(query, new
                    {
                        @station_id = details[i].Current_Station_ID,
                        @lastby = details[i].LastModifyBy,
                        @id = details[i].Current_Station_ID
                    });
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }



        }
    }
}