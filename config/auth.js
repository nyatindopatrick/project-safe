var url = require('url');
module.exports = {
  ensureAuthenticated: (req, res, next) =>{
  
    if (req.isAuthenticated() ) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/");
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }  
    // if(!userType){
    //   res.redirect(req.originalUrl)
    // }
      // res.status(200).redirect("back");

  }
};
