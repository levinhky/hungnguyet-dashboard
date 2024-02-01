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

const initialProductState = {
  id: '',
  name: '',
  sku: '',
  status: false,
  views: '',
  slug: '',
  thumbs: [],
  attributes: {
    capacity: '',
    color: '',
    characteristics: '',
    design: '',
    uses: '',
    display: false,
  },
  category: '',
  createdAt: '',
  updatedAt: '',
};

const initialSlideState = {
  id: '',
  title: '',
  thumb: '',
  description: '',
  buttonText: '',
  display: false,
  createdAt: '',
  updatedAt: '',
};

export { initialCategoryState, initialProductState, initialSlideState };
