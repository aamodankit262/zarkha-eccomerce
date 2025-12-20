export interface ShopByItem {
  name: string;
  image?: string;
  isViewAll?: boolean;
}

export interface ShopByPriceItem {
  range?: string;
  name?: string;
  image?: string;
  isViewAll?: boolean;
}

export interface CategoryData {
  leftSidebar: string[];
  shopBy: ShopByItem[];
  shopByPrice: ShopByPriceItem[];
  more: string[];
}

export interface MegaMenuData {
  [key: string]: CategoryData;
}