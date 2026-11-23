"use client";

import { useState } from "react";
import ItemsTab from "./ItemsTab";
import ListsTab from "./ListsTab";
import type { Product, ShopList } from "./shopping";

const initialProducts: Product[] = [
  { id: "p1", name: "Milk", price: 1.2 },
  { id: "p2", name: "Eggs (10)", price: 2.5 },
  { id: "p3", name: "Bread", price: 1.1 },
  { id: "p4", name: "Bananas", price: 1.8 },
  { id: "p5", name: "Tomatoes", price: 2.9 },
  { id: "p6", name: "Pasta", price: 1.4 },
  { id: "p7", name: "Dish soap", price: 3.2 },
  { id: "p8", name: "Chips", price: 2.1 },
  { id: "p9", name: "Cola 2L", price: 2.3 },
];

const initialLists: ShopList[] = [
  {
    id: "l1",
    name: "Weekly groceries",
    entries: [
      { id: "e1", productId: "p1", name: "Milk", price: 1.2, quantity: 2, checked: false },
      { id: "e2", productId: "p3", name: "Bread", price: 1.1, quantity: 1, checked: true },
      { id: "e3", productId: "p4", name: "Bananas", price: 1.8, quantity: 6, checked: false },
    ],
  },
  {
    id: "l2",
    name: "Birthday party",
    entries: [
      { id: "e4", productId: "p8", name: "Chips", price: 2.1, quantity: 4, checked: false },
      { id: "e5", productId: "p9", name: "Cola 2L", price: 2.3, quantity: 3, checked: false },
    ],
  },
];

type Tab = "lists" | "items";

export default function ShoppingView() {
    const [tab, setTab] = useState<Tab>("lists");
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [lists, setLists] = useState<ShopList[]>(initialLists);
    const [activeId, setActiveId] = useState<string | null>(initialLists[0].id);

    const tabs: { value: Tab; label: string; count: number}[] = [
        { value: "lists", label: "Lists", count: lists.length },
        { value: "items", label: "Items", count: products.length },
    ];

    return (
        <div className="mt-8">
            <div role="tablist" aria-label="Shopping sections" className="inline-flex rounded-full border border-border bg-white p-1">
                {tabs.map((t) => (
                    <button key={t.value} type="button" role="tab" aria-selected={tab === t.value}
                    onClick={() => setTab(t.value)} className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                        tab === t.value
                        ? "bg-primary text-white"
                        : "text-muted hover:text-foreground"
                    }`}>
                        {t.label}{" "}
                        <span className="opacity-70">{t.count}</span>
                    </button>
                ))}
            </div>

            {tab === "lists" ? (
                <ListsTab lists={lists} setLists={setLists} products={products} activeId={activeId} setActiveId={setActiveId}/>
            ) : (
                <ItemsTab products={products} setProducts={setProducts}/>
            )}
        </div>
    );
}