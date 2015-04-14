using Microsoft.Owin;
using Owin;
[assembly: OwinStartup(typeof(ChatSystem.Services.Startup))]

namespace ChatSystem.Services
{
    using System;
    using System.Reflection;
    using System.Web.Http;

    using Ninject;
    using Ninject.Activation;
    using Ninject.Web.Common.OwinHost;
    using Ninject.Web.WebApi.OwinHost;

    using ChatSystem.Data;
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            app.UseNinjectMiddleware(CreateKernel).UseNinjectWebApi(GlobalConfiguration.Configuration);
        }

        private static StandardKernel CreateKernel()
        {
            var kernel = new StandardKernel();
            kernel.Load(Assembly.GetExecutingAssembly());

            BindTypes(kernel);

            return kernel;
        }

        private static void BindTypes(StandardKernel kernel)
        {
            kernel.Bind<IChatSystemData>().To<ChatSystemData>().WithConstructorArgument("context", c => new ApplicationDbContext());
        }
    }
}
