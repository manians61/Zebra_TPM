using System.Collections.Generic;
using AccessControl.API.Dapper;
using AccessControl.API.Data;
using AccessControl.API.Domain;
using AccessControl.API.Repositories;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AccessControl.API.ZebraRepo;
using AutoMapper;

namespace AccessControl.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers().AddNewtonsoftJson(opt =>
            {
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                    .GetBytes(Configuration.GetSection("AppSettings:Token").Value)),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            var connectionDict = new Dictionary<DbConnectionName, string>
            {
                {DbConnectionName.QasConnection, this.Configuration.GetSection("Local_ConnectionStrings").GetSection("QasConnection").Value},
                {DbConnectionName.MysConnection, this.Configuration.GetSection("ConnectionStrings").GetSection("MysConnection").Value},
                {DbConnectionName.DomainConnection, this.Configuration.GetSection("ConnectionStrings").GetSection("DomainConnection").Value},
                {DbConnectionName.PrdUltronConnection, this.Configuration.GetSection("Local_ConnectionStrings").GetSection("PrdUltronConnection").Value},

            };
            services.AddAutoMapper(typeof(Startup));

            //Inject connection dict
            services.AddSingleton<IDictionary<DbConnectionName, string>>(connectionDict);
            services.AddScoped<IAuthRepository, AuthRepository>();
            services.AddScoped<IPermissionRepository, PermissionRepository>();
            services.AddScoped<IAdminRepository, AdminRepository>();
            services.AddScoped<IZebraRepository, ZebraRepository>();
            // Auto Mapper Configurations
            //inject factory
            services.AddTransient<IDbConnectionFactory, DapperDbConnectionFactory>();
            services.AddCors();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //app.UseHttpsRedirection();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();



            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
