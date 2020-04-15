using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccessControl.API.ZebraModels;
using AccessControl.API.ZebraRepo;
using Microsoft.AspNetCore.Mvc;

namespace AccessControl.API.ZebraControllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ZebraController : ControllerBase
    {
        private readonly IZebraRepository _repo;
        public ZebraController(IZebraRepository repo)
        {
            _repo = repo;

        }
        [HttpGet("{id}")]
        [Route("rma/{id}")]
        public async Task<IActionResult> RMA_Receiving(string id)
        {

            var itemFromRepo = await _repo.GetRmaReceiving(id);


            if (itemFromRepo != null)
            {
                return Ok(itemFromRepo);
            }
            else
            {
                return BadRequest("Could not get RMA_No");
            }

        }
        [HttpPost("uploadReceiving")]
        public async Task<IActionResult> AddRmaReceiving(RMA_Receiving receiving)
        {
            var trayFromRepo = await _repo.GetTrayDetail(receiving.Tray_ID);
            if (trayFromRepo.IsEmpty)
            {
                _repo.AddReceiving(receiving);
                return NoContent();
            }
            else
            {
                return BadRequest("This tray is already assigned");
            }


        }
        [HttpPost("StationUser")]

        public IActionResult UpdateZebraUser(Zebra_User user)
        {

            user.User_Login_Time = DateTime.Now;
            user.LastModifyDate = DateTime.Now;
            user.LastUpdateBy = user.User_ID;
            _repo.UpdateUser(user);

            return Ok();
        }
        [HttpGet]
        [Route("AvailableTray")]
        public async Task<IActionResult> GetAvailableTray()
        {

            var itemFromRepo = await _repo.GetAvailableTray();

            if (itemFromRepo != null)
            {
                return Ok(itemFromRepo);
            }
            else
            {
                return BadRequest("No Available tray");
            }
        }
        [HttpPost("UpdateTray")]
        public async Task<IActionResult> UpdateTrayDetail(Tray_Detail detail)
        {
            try
            {
                if (detail.IsEmpty || (detail.Tray_Item_Count - detail.Scrap_Count <= 0))
                {
                    detail.IsEmpty = true;
                    detail.Scrap_Count = 0;
                    detail.Current_Station_ID = 0;
                    detail.Tray_Item_Count = 0;
                    await _repo.UpdateTrayDetail(detail);
                }
                else
                {
                    await _repo.UpdateTrayDetail(detail);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                throw new Exception($"Updating user {detail.Tray_ID} failed!! Exception: +" + ex);
            }
        }
        [HttpGet]
        [Route("getstations")]
        public async Task<IActionResult> getStations()
        {
            var itemFromRepo = await _repo.GetStations();

            if (itemFromRepo != null)
            {
                return Ok(itemFromRepo);
            }
            else
            {
                return BadRequest("Can not get zebra stations!!");
            }
        }
        [HttpGet]
        [Route("station/{id}")]
        public async Task<IActionResult> getStation(int id)
        {
            var itemFromRepo = await _repo.GetStation(id);


            if (itemFromRepo != null)
            {
                return Ok(itemFromRepo);
            }
            else
            {
                return BadRequest("Can not get zebra stations!!");
            }
        }
        [HttpGet]
        [Route("tray/{id}")]
        public async Task<IActionResult> GetTray(string id)
        {
            var itemFromRepo = await _repo.GetTrayDetail(id);

            if (itemFromRepo != null)
            {
                return Ok(itemFromRepo);
            }
            else
            {
                return BadRequest("Can not get this tray's information!!");
            }
        }
        [HttpPost("updateStation")]
        public IActionResult AddLog(Zebra_Station station)
        {
            try
            {
                _repo.UpdateStation(station);
                return NoContent();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}