using AccessControl.API.Dtos;
using AccessControl.API.Models;
using AutoMapper;

namespace AccessControl.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
            public AutoMapperProfiles()
        {
            CreateMap<User, UserAccessDto>();
        }
    }
}