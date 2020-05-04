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


            if (itemFromRepo == null || itemFromRepo.Count == 0)
            {
                return BadRequest("Could not get RMA_No");
            }
            else
            {
                return Ok(itemFromRepo);
            }

        }
        [HttpPost("uploadReceiving")]
        public async Task<IActionResult> AddRmaReceiving(RMA_Receiving receiving)
        {
            var trayFromRepo = await _repo.GetTrayDetail(receiving.Tray_ID);
            if (trayFromRepo.IsEmpty || trayFromRepo.PN == null || trayFromRepo.RMA_No == null)
            {
                trayFromRepo.IsEmpty = false;
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
        [HttpPost]
        [Route("UpdateTrayInfo")]
        public async Task<IActionResult> UpdateTrayDetail(Tray_Detail detail)
        {
            try
            {
              
                    await _repo.UpdateTrayDetail(detail);
                

                return NoContent();
            }
            catch (Exception ex)
            {
                throw new Exception($"Updating user {detail.Tray_ID} failed!! Exception: +" + ex);
            }
        }
        [HttpGet]
        [Route("getopenstations")]
        public async Task<IActionResult> getStations()
        {
            var itemFromRepo = await _repo.GetOpenStations();

            if (itemFromRepo == null || itemFromRepo.Count == 0)
            {
                return BadRequest("Can not get zebra stations!!");
            }
            else
            {
                return Ok(itemFromRepo);
            }
        }
        [HttpGet]
        [Route("getallstations")]
        public async Task<IActionResult> getStationsAll()
        {
            var itemFromRepo = await _repo.GetStationsAll();

            if (itemFromRepo == null || itemFromRepo.Count == 0)
            {
                return BadRequest("Can not get zebra stations!!");
            }
            else
            {
                return Ok(itemFromRepo);
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

            var itemFromRepo = await _repo.GetTrayDetail(id.ToUpper());

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
        [HttpGet]
        [Route("trayinstation/{id}")]
        public async Task<IActionResult> GetTrayInStation(int id)
        {

            var itemFromRepo = await _repo.getTrayInStation(id);


            return Ok(itemFromRepo);

        }
        [HttpPost("UpdateTrayList")]
        public IActionResult UpdateTrayDetailList(List<Tray_Detail> detail)
        {
            if (detail.Count == 0 || detail == null)
            {
                return BadRequest("No Items");
            }
            else
            {
                _repo.UpdateDetails(detail);
                return Ok();
            }
        }
        [HttpPost("UploadTray")]
        public IActionResult UploadTray(List<string>  ids){
            _repo.InsertTray(ids);
            return Ok();
        }

    }
}