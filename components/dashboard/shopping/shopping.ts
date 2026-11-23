export type Product = {
    id: string;
    name: string;
    price: number | null;
};

export type Entry = {
    id: string;
    productId: string | null;
    name: string;
    price: number | null;
    quantity: number;
    checked: boolean;
};

export type ShopList = {
    id: string;
    name: string;
    entries: Entry[];
};

export const CURRENCY = "€";

export function formatPrice(value: number) {
    return `${CURRENCY}${value.toFixed(2)}`;
}

export const field = "rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";