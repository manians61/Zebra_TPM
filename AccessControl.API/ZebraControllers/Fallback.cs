using Microsoft.AspNetCore.Mvc;
using System.IO;
namespace AccessControl.API.ZebraControllers
{
    public class Fallback : Controller
    {
        public IActionResult Index(){
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot",
            "index.html"), "text/HTML");
        }
    }
}