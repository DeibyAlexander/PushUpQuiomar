
const checkVersionHeader = (req, res, next) => {
    const acceptVersion = req.get("Accept-Version");
    
    if (!acceptVersion || acceptVersion !== "1.0.0") {
        return res.status(400).json({ message: "Version invalida, por favor acepta la version 1.0.0 en tus headers" });
    }

    next(); 
};

export {
    checkVersionHeader
}