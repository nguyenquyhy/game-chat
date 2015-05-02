using System;
using System.Linq;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Routing;
using Microsoft.Data.Entity;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Logging;
using Microsoft.Framework.Logging.Console;
using GameChat.Web.Models;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using GameChat.Web.Logics;
using Microsoft.AspNet.SignalR;
using GameChat.Web.Attributes;
using System.Diagnostics;

namespace GameChat.Web
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            // Setup configuration sources.
            Configuration = new Configuration()
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();
        }

        public IConfiguration Configuration { get; set; }

        // This method gets called by the runtime.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add EF services to the services container.
            //services.AddEntityFramework(Configuration)
            //    .AddSqlServer()
            //    .AddDbContext<ApplicationDbContext>();

            // Add MVC services to the services container.
            services.AddMvc().Configure<MvcOptions>(options =>
            {
                var formatter = (JsonOutputFormatter)options.OutputFormatters.FirstOrDefault(f => f.Instance is JsonOutputFormatter).Instance;

                if (formatter != null)
                {
                    var settings = new JsonSerializerSettings()
                    {
                        ContractResolver = new CamelCasePropertyNamesContractResolver()
                    };
                    formatter.SerializerSettings = settings;
                }
            }); ;

            // Uncomment the following line to add Web API servcies which makes it easier to port Web API 2 controllers.
            // You need to add Microsoft.AspNet.Mvc.WebApiCompatShim package to project.json
            // services.AddWebApiConventions();

            services.AddSignalR();

            if (Configuration.Get("Data:Type") == "AzureStorage")
            {
                services.AddInstance<IStorageLogic>(new AzureTableStorageLogic(Configuration));
                Trace.TraceInformation("Initialized AzureStorage");
            }
            else
            { 
                services.AddInstance<IStorageLogic>(new InMemoryStorageLogic());
                Trace.TraceInformation("Initialized InMemoryStorage");
            }
            services.AddInstance<IConfiguration>(Configuration);
            services.AddInstance<SimpleAuthorizeAttribute>(new SimpleAuthorizeAttribute(Configuration));
        }

        // Configure is called after ConfigureServices is called.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerfactory)
        {
            // Configure the HTTP request pipeline.
            // Add the console logger.
            loggerfactory.AddConsole();

            // Add the following to the request pipeline only in development environment.
            if (string.Equals(env.EnvironmentName, "Development", StringComparison.OrdinalIgnoreCase))
            {
                app.UseBrowserLink();
                app.UseErrorPage(ErrorPageOptions.ShowAll);
            }
            else
            {
                // Add Error handling middleware which catches all application specific errors and
                // send the request to the following path or controller action.
                app.UseErrorHandler("/Home/Error");
            }

            // Add static files to the request pipeline.
            app.UseStaticFiles();

            // Add MVC to the request pipeline.
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action}/{id?}",
                    defaults: new { controller = "Home", action = "Index" });

                // Uncomment the following line to add a route for porting Web API 2 controllers.
                // routes.MapWebApiRoute("DefaultApi", "api/{controller}/{id?}");
            });

            app.UseSignalR();
        }
    }
}
