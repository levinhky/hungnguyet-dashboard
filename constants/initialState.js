const initialCategoryState = {
  id: '',
  name: '',
  thumb: '',
  level: 1,
  display: true,
  subCategories: [
    {
      id: '',
      name: '',
      thumb: '',
      level: 1,
      display: true,
      subCategories: [],
      productsInCategory: [],
      slug: '',
      createdAt: '',
      updatedAt: '',
    },
  ],
  productsInCategory: [],
  slug: '',
  createdAt: '',
  updatedAt: '',
};

export { initialCategoryState };
