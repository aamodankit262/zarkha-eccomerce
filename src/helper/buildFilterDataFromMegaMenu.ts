type MegaMenu = Record<
  string,
  {
    industryId: string;
    categories: {
      id: string;
      name: string;
      subCategories: {
        id: string;
        name: string;
        image?: string;
      }[];
    }[];
  }
>;

export const buildFilterDataFromMegaMenu = (
  megaMenu: MegaMenu,
  selectedCategoryId?: string
) => {
  // flatten all categories
  console.log(megaMenu, 'filter menu')
  const allCategories = Object.values(megaMenu).flatMap(
    (industry) => industry.categories
  );

  const selectedCategory = allCategories.find(
    (cat) => cat.id === selectedCategoryId
  );

  return [
    {
      title: "Category",
      key: "category",
      items: allCategories.map((cat) => ({
        label: cat.name,
        value: cat.id,
      })),
    },
    {
      title: "Sub Category",
      key: "subCategory",
      items:
        selectedCategory?.subCategories.map((sub) => ({
          label: sub.name,
          value: sub.id,
        })) || [],
    },
  ];
};
