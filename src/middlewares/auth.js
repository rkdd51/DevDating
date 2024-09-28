const authPath = (req,res,next) => {
    let token = "xyz";
    let isAuthenticated = token === "xyz";
    if (!isAuthenticated) {
        res.status(401).res.send( "Unauthorized Admin" );
    } else {
        next();
    }
}

const userAuth = (req, res, next) => {
  let token = "xyz";
  let isAuthenticated = token === "xyz";
  if (!isAuthenticated) {
    res.status(401).res.send("Unauthorized User");
  } else {
    next();
  }
};


module.exports = {
  authPath,
  userAuth,
};