using Microsoft.Owin;
using Owin;
[assembly: OwinStartup(typeof(ChatSystem.Services.Startup))]

namespace ChatSystem.Services
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }

        //private static StandardKernel CreateKernel()
        //{
        //    var kernel = new StandardKernel();
        //    kernel.Load(Assembly.GetExecutingAssembly());

        //    BindTypes(kernel);

        //    return kernel;
        //}

        //private static void BindTypes(StandardKernel kernel)
        //{
        //    kernel.Bind<IChatSystemData>().To<ChatSystemData>().WithConstructorArgument("context", c => new ApplicationDbContext());
        //}
    }
}
