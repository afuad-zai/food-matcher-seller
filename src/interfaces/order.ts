
export interface Order {
    orderId: string,
    storeId: string,
    storeName: string,
    storeImage: string,
    userId: string,
    status: string,
    timestamp: string,
    rated: boolean,
    menus: MenuInfo[]
}

export interface MenuInfo {
    menuId: string,
    imageURL: string,
    name: string,
    price: number,
    quantity: number
}