import { extractedSeedFile, updateData } from './utils.js';

const processRecipes = async () => {
  const parsedData = await extractedSeedFile('recipes.json');
  const categories = await extractedSeedFile('categories.json');
  const areas = await extractedSeedFile('areas.json');
  const recipes = parsedData.map((recipe) => {
    const { _id, category, owner, area, createdAt, updatedAt, ...rest } =
      recipe;
    return {
      id: _id.$oid,
      category: categories.find((cat) => category === cat.name)?.id || null,
      owner: owner.$oid,
      area: areas.find((ar) => area === ar.name)?.id || null,
      ...rest,
    };
  });
  updateData('recipes.json', recipes);
};

const processDataId = async (fileName) => {
  const parsedData = await extractedSeedFile(fileName);
  const items = parsedData.map((item) => {
    const { _id, ...rest } = item;
    return {
      id: _id.$oid,
      ...rest,
    };
  });
  updateData(fileName, items);
};

// processDataId('areas.json');
processRecipes();
