// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Startup.cs" company="">
//   
// </copyright>
// --------------------------------------------------------------------------------------------------------------------



using ChatSystem.Services.Notifications;

using Microsoft.Owin;

[assembly: OwinStartup(typeof(Startup))]

namespace ChatSystem.Services.Notifications
{
    using Owin;

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}