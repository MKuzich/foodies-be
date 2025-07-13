const parseIngredients = (req, res, next) => {
  const { ingredients } = req.body;

  if (ingredients && typeof ingredients === 'string') {
    try {
      req.body.ingredients = JSON.parse(ingredients);
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Invalid ingredients format' });
    }
  } else {
    next();
  }
};

export default parseIngredients;
