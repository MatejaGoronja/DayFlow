"use client";

import { useState } from "react";
import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { field, formatPrice, type Product } from "./shopping";

type Props = {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

function parsePrice(value: string): number | null | undefined {
    const trimmed = value.trim().replace(",", ".");
    if(trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
}

type RowProps = {
    product: Product;
    onSave: (id: string, name: string, price: number | null) => void;
    onDelete: (id:string) => void;
}

function ProductRow({ product, onSave, onDelete }: RowProps) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price === null ? "" : String(product.price));
    const [error, setError] = useState("");

    function save(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = name.trim();
        const parsed = parsePrice(price);
        if(!trimmed) return setError("Please enter a name.");
        if(parsed === undefined) return setError("Enter a valid price.");
        onSave(product.id, trimmed, parsed);
        setEditing(false);
        setError("");
    }

    if(editing) {
        return (
            <li className="rounded-2xl border border-primary/40 bg-white p-3">
                <form onSubmit={save} className="flex flex-col gap-2 sm:flex-row">
                    <input autoFocus type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setEditing(false)} aria-label="Item name" className={`${field} min-w-0 flex-1`} />
                    <input type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" aria-label="Price" className={`${field} sm:w-28`} />
                    <div className="flex gap-2">
                        <button type="submit" aria-label="Save" className="rounded-lg bg-primary p-2.5 text-white transition-colors hover:bg-primary-hover">
                            <Check size={18}/>
                        </button>
                        <button type="button" onClick={() => setEditing(false)} aria-label="Cancel" className="rounded-lg border border-border p-2.5 text-muted transition-colors hover:bg-surface">
                            <X size={18}/>
                        </button>
                    </div>
                </form>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </li>
        );
    }

    return(
        <li className="group flex items-center gap-4 rounded-2xl border border-border bg-white px-4 py-3.5">
            <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {product.name}
            </span>
            <span className="text-sm text-muted">
                {product.price === null ? "No price" : formatPrice(product.price)}
            </span>
            <div className="flex items-center transition-all lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover:opacity-100">
                <button type="button" onClick={() => setEditing(true)} aria-label={`Edit ${product.name}`} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary">
                    <Pencil size={18}/>
                </button>
                <button type="button" onClick={() => onDelete(product.id)} aria-label={`Delete ${product.name}`} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-500">
                    <Trash2 size={18}/>
                </button>
            </div>
        </li>
    );
}

export default function ItemsTab({products, setProducts} : Props) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    function addProduct(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = name.trim();
        const parsed = parsePrice(price);
        if(!trimmed) return setError("Please enter an item name.");
        if(parsed === undefined) return setError("Enter a valid price.");

        setProducts((current) => [
            ...current,
            { id: crypto.randomUUID(), name: trimmed, price: parsed},
        ]);
        setName("");
        setPrice("");
        setError("");
    }

    function saveProduct(id: string, newName: string, newPrice: number | null) {
        setProducts((current) => 
        current.map((p) => p.id === id ? { ...p, name: newName, price: newPrice } : p));
    }

    function deleteProduct(id: string){
        setProducts((current) => current.filter((p) => p.id !== id));
    }

    const q = query.trim().toLowerCase();
    const visible = products.filter((p) => p.name.toLowerCase().includes(q)).sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="mt-6 space-y-6">
            <form onSubmit={addProduct} className="rounded-2xl border border-border bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name (e.g. Milk)" aria-label="Item name" className={`${field} min-w-0 flex-1 placeholder:text-muted/60`} />
                    <div className="flex gap-3">
                        <input type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" aria-label="Price" className={`${field} w-28 placeholder:text-muted/60`} />
                        <button type="submit" className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                            <Plus size={18}/>
                            Add
                        </button>
                    </div>
                </div>
                {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            </form>

            <div className="relative">
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"/>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${products.length} items...`} aria-label="Search items" className={`${field} w-full py-3 pl-11 placeholder:text-muted/60`} />
            </div>

            {visible.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center text-muted">
                    {products.length === 0
                    ? "Your catalog is empty. Add your first item above."
                    : "No items match your search."}
                </div>
            ) : (
                <ul className="space-y-2">
                    {visible.map((p) => (
                        <ProductRow key={p.id} product={p} onSave={saveProduct} onDelete={deleteProduct}/>
                    ))}
                </ul>
            )}
        </div>
    );
}