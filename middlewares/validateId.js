
const validateId = (req, res, next) => {
    console.log("🔍 validateId triggered:", req.params);
    const id = Number(req.params.id);

    if (Number.isNaN(id) || !Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid id format" });
    }
    next();
};

export default validateId;