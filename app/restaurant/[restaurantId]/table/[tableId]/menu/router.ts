
import axios from 'axios';

export interface Option {
  optionId: number;
  optionName: string;
  optionPrice: number;
}

export interface OptionGroup {
  groupId: number;
  groupName: string;
  displaySequence: number;
  isDefault: boolean;
  options: Option[];
}

export interface MenuResponse {
  menuId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  menuImgUrl: string;
  isAvailable: boolean;
  optionGroups: OptionGroup[];
}

export async function fetchMenusByMerchant(merchantId: string): Promise<MenuResponse[]> {
  const res = await axios.get(
    `http://localhost:8080/api/v1/merchant/menus/${merchantId}/list`
  );
  return res.data.data;
}