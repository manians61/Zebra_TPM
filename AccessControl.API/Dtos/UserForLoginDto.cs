namespace AccessControl.API.Dtos
{
    public class UserForLoginDto
    {
        public string user_ID { get; set; }
        public string Password { get; set; }
        public string Login_Type {get;set;}
    }
}