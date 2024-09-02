using MinaToMVC.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace MinaToMVC.Controllers.Filters
{
    public class FiltersHelper
    {
        public class AutenticatedAttribute : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                base.OnActionExecuting(filterContext);

                var validToken = SessionHelper.EixstSession();
                var tokenTemp = SessionHelper.GetSessionUser();
                if (!validToken && tokenTemp == null)
                {
                    var rvd = new RouteValueDictionary();
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                    {
                        controller = "Home",
                        action = "Autentication"
                    }));
                }
            }
        }
        public class NoAutenticatedAttribute : ActionFilterAttribute
        {
            public override void OnActionExecuting(ActionExecutingContext filterContext)
            {
                base.OnActionExecuting(filterContext);

                if (SessionHelper.EixstSession())
                {
                    filterContext.Result = new RedirectToRouteResult(new RouteValueDictionary(new
                    {
                        controller = "Home",
                        action = "Index"
                    }));
                }
            }
        }
    }
}