"use client";

import { useState } from "react";
import { Check, Minus, Pencil, Plus, Search, Trash2, X, } from "lucide-react";
import { field, formatPrice, type Entry, type Product, type ShopList } from "./shopping";

type Props = {
    lists: ShopList[];
    setLists: React.Dispatch<React.SetStateAction<ShopList[]>>;
    products: Product[];
    activeId: string | null;
    setActiveId: (id: string | null) => void;
};

export default function ListsTab({
    lists,
    setLists,
    products,
    activeId,
    setActiveId,
}: Props) {
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [renaming, setRenaming] = useState(false);
    const [renameValue, setRenameValue] = useState("");
    const [query, setQuery] = useState("");
    const [customPrice, setCustomPrice] = useState("");
    const [customOpen, setCustomOpen] = useState(false);
    const [customError, setCustomError] = useState("");

    const active = lists.find((l) => l.id === activeId) ?? lists[0] ?? null;

    {/* CRUD for lists */}
    function createList(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const name = newName.trim();
        if (!name) return;
        const id = crypto.randomUUID();
        setLists((current) => [...current, {id, name, entries: []}]);
        setActiveId(id);
        setNewName("");
        setCreating(false);
    }

    function renameList(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const name = renameValue.trim();
        if(!name || !active) return;
        setLists((current) => current.map((l) => (l.id === active.id ? { ...l, name } : l)));
        setRenaming(false);
    }

    function deleteList() {
        if(!active) return;
        setLists((current) => current.filter((l) => l.id !== active.id));
        setActiveId(null);
        setRenaming(false);
    }

    function updateEntries(change: (entries: Entry[]) => Entry[]) {
        if(!active) return;
        setLists((current) =>
            current.map((l) => l.id === active.id ? {...l, entries: change(l.entries)} : l)
        );
    }

    function addProduct(product: Product) {
        updateEntries((entries) => {
            const existing = entries.find((e) => e.productId === product.id);
            if(existing) {
                return entries.map((e) => e.id === existing.id
                ? {...e, quantity: e.quantity + 1, checked: false} : e 
                );
            }
            return [
                {
                    id: crypto.randomUUID(),
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    checked: false,
                },
                ...entries,
            ];
        });
        setQuery("");
    }

    function parsePrice(value: string): number | null | undefined {
        const trimmed = value.trim().replace(",", ".");
        if(trimmed === "") return null;
        const n = Number(trimmed);
        return Number.isFinite(n) && n >= 0 ? n : undefined;
    }

    function closeCustom() {
        setCustomOpen(false);
        setCustomPrice("");
        setCustomError("");
    }

    function confirmCustom(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const price = parsePrice(customPrice);
        if(price === undefined) {
            setCustomError("Enter a valid price.");
            return;
        }
        updateEntries((entries) => [
            {
                id: crypto.randomUUID(),
                productId: null,
                name: query.trim(),
                price,
                quantity: 1,
                checked: false,
            },
            ...entries,
        ]);
        setQuery("");
        closeCustom();
    }

    const toggle = (id: string) => updateEntries((entries) =>
        entries.map((e) => (e.id === id ? { ...e, checked: !e.checked} : e)));

    const changeQuantity = (id:string, delta:number) =>
        updateEntries((entries) =>
        entries.map((e) => e.id === id ? { ...e, quantity: Math.max(1, e.quantity + delta)} : e));

    const removeEntry = (id: string) =>
        updateEntries((entries) => entries.filter((e) => e.id !== id));

    const clearChecked = () =>
        updateEntries((entries) => entries.filter((e) => !e.checked));

    {/* Search */}
    const trimmedQuery = query.trim();
    const matches = trimmedQuery
        ? products.filter((p) => p.name.toLowerCase().includes(trimmedQuery.toLowerCase())).slice(0, 6)
        : [];
    const hasExactMatch = products.some(
        (p) => p.name.toLowerCase() === trimmedQuery.toLowerCase()
    );

    function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if(!trimmedQuery) return;
        if(matches.length > 0) addProduct(matches[0]);
        else setCustomOpen(true);
    }


    const entries = active?.entries ?? [];
    const checkedCount = entries.filter((e) => e.checked).length;
    const percent = entries.length === 0 ? 0 : Math.round((checkedCount / entries.length) * 100);
    const total = entries.reduce((sum, e) => sum + (e.price ?? 0) * e.quantity, 0);
    const unchecked = entries.filter((e) => !e.checked);
    const checked = entries.filter((e) => e.checked);

    return (
        <div className="mt-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
                {lists.map((l) => (
                    <button key={l.id} type="button" onClick={() => {
                        setActiveId(l.id);
                        setRenaming(false);
                        setQuery("");
                        closeCustom();
                    }}
                    aria-pressed={active?.id === l.id}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                        active?.id === l.id
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-white text-muted hover:bg-primary-hover/10 hover:text-primary"
                    }`}
                    >
                        {l.name}
                    </button>
                ))}

                {!creating && (
                    <button type="button" onClick={() => setCreating(true)}
                    className="flex items-center gap-1.5 rounded-full border border-dashed border-border px-4 py-2 text-sm font-semibold text-muted transition-colors hover:border-primary hover:text-primary">
                        <Plus size={16}/>
                        New list
                    </button>
                )}
            </div>

            {creating && (
                <form onSubmit={createList} className="flex flex-col gap-3 rounded-2xl border border-primary/40 bg-white p-4 sm:flex-row">
                    <input autoFocus type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setCreating(false)}
                    placeholder="List name (e.g. Trip to the mountains)" aria-label="List name" className={`${field} min-w-0 flex-1 placeholder:text-muted/60`}/>
                    <div className="flex gap-2">
                        <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                            Create
                        </button>
                        <button type="button" onClick={() => setCreating(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-surface">
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {!active ? (
                <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center text-muted">
                    {lists.length === 0
                    ? "You have no lists yet. Create your first one."
                    : "Select a list above."}
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between gap-3">
                        {renaming ? (
                            <form onSubmit={renameList} className="flex flex-1 gap-2">
                                <input autoFocus type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === "Escape" && setRenaming(false)} aria-label="List name" className={`${field} min-w-0 flex-1`} />
                                <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                                    Save
                                </button>
                            </form>
                        ) : (
                            <h2 className="truncate text-xl font-bold">{active.name}</h2>
                        )}

                        {!renaming && (
                            <div className="flex shrink-0 items-center gap-1">
                                <button type="button" onClick={() => {
                                    setRenameValue(active.name);
                                    setRenaming(true);
                                }}
                                aria-label="Rename list"
                                className="rounded-lg p-2 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary"
                                >
                                    <Pencil size={18}/>
                                </button>
                                <button type="button" onClick={deleteList} aria-label="Delete list"
                                className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Progress bar and total cost */}
                    <div className="rounded-2xl border border-border bg-white p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                            <span className="font-semibold">
                                {checkedCount} of {entries.length} in cart
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="font-semibold">
                                    Estimated total: {formatPrice(total)}
                                </span>
                                {checkedCount > 0 && (
                                    <button type="button" onClick={clearChecked} className="font-semibold text-muted transition-colors hover:text-primary">
                                        Clear checked
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-soft">
                            <div className="h-full rounded-full bg-primary transition-all duration-500" 
                            style={{ width: `${percent}%` }}/>
                        </div>
                    </div>

                    {/* Search and add */}
                    <div className="relative">
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"/>
                            <input type="text" value={query} onChange={(e) => {
                                setQuery(e.target.value);
                                if(customOpen) closeCustom();
                            }} onKeyDown={(e) => e.key === "Escape" && setQuery("")} 
                            placeholder="Search your items and add them to this list..." aria-label="Search items" className={`${field} w-full py-3 pl-11 placeholder:text-muted/60`} />
                        </form>

                        {trimmedQuery && (
                            <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-border bg-white shadow-lg">
                                {matches.map((p) => (
                                    <li key={p.id}>
                                        <button type="button" onClick={() => addProduct(p)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-primary-hover/10">
                                            <span className="font-semibold">{p.name}</span>
                                            <span className="flex items-center gap-3 text-muted">
                                                {p.price !== null && formatPrice(p.price)}
                                                <Plus size={16} className="text-primary"/>
                                            </span>
                                        </button>
                                    </li>
                                ))}
                                {!hasExactMatch && !customOpen && (
                                    <li>
                                        <button type="button" onClick={() => setCustomOpen(true)}
                                        className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left text-sm font-semibold text-primary transition-colors hover:bg-primary-hover/10">
                                            <Plus size={16}/>
                                            Add &quot;{trimmedQuery}&quot; as a custom item
                                        </button>
                                    </li>
                                )}
                                {customOpen && (
                                    <li className="border-t border-border p-3">
                                        <form onSubmit={confirmCustom} className="space-y-2">
                                            <p className="text-sm font-semibold">
                                                Custom item: <span className="text-primary">{trimmedQuery}</span>
                                            </p>
                                            <div className="flex gap-2">
                                                <input autoFocus type="text" inputMode="decimal" value={customPrice} onChange={(e) => setCustomPrice(e.target.value)} onKeyDown={(e) => e.key === "Escape" && closeCustom()} placeholder="Price (optional)" aria-label="Price" className={`${field} min-w-0 flex-1`} />
                                                <button type="submit" aria-label="Add item" className="rounded-lg bg-primary p-2.5 text-white transition-colors hover:bg-primary-hover">
                                                    <Check size={18}/>
                                                </button>
                                                <button type="button" onClick={closeCustom} aria-label="Cancel" className="rounded-lg border border-border p-2.5 text-muted transition-colors hover:bg-surface">
                                                    <X size={18}/>
                                                </button>
                                            </div>
                                            {customError && <p className="text-sm text-red-500">{customError}</p>}
                                        </form>
                                    </li>
                                )}
                            </ul>
                        )}
                    </div>

                    {entries.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center text-muted">
                            This list is empty. Search above to add items.
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {[...unchecked, ...checked].map((entry) => (
                                <li key={entry.id} className="group flex items-center gap-4 rounded-2xl border border-border bg-white px-4 py-3.5">
                                    <button type="button" onClick={() => toggle(entry.id)} aria-label={entry.checked ? `Uncheck ${entry.name}` : `Check ${entry.name}`}
                                        aria-pressed={entry.checked} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                            entry.checked
                                            ? "border-primary bg-primary text-white"
                                            : "border-border hover:border-primary"
                                        }`}>
                                            {entry.checked && <Check size={16}/>}
                                    </button>
                                    <div className="min-w-0 flex-1">
                                        <p className={`truncate text-sm font-semibold ${
                                            entry.checked ? "text-muted line-through" : ""
                                        }`}>
                                            {entry.name}
                                        </p>
                                        {entry.price !== null && (
                                            <p className="text-xs text-muted">
                                                {formatPrice(entry.price)} each
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button type="button" onClick={() => changeQuantity(entry.id, -1)} disabled={entry.quantity <= 1} aria-label={`Decrease quantity of ${entry.name}`}
                                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary disabled:pointer-events-none disabled:opacity-30">
                                            <Minus size={16}/>
                                        </button>
                                        <span className="w-7 text-center text-sm font-bold tabular-nums">
                                            {entry.quantity}
                                        </span>
                                        <button type="button" onClick={() => changeQuantity(entry.id, 1)} aria-label={`Increase quantity of ${entry.name}`}
                                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary">
                                            <Plus size={16}/>
                                        </button>
                                    </div>

                                    <button type="button" onClick={() => removeEntry(entry.id)} aria-label={`Delete ${entry.name}`}
                                    className="rounded-lg p-1.5 text-muted transition-all hover:bg-red-50 hover:text-red-500 lg:opacity-0 lg:focus-visible:opacity-100 lg:group-hover:opacity-100">
                                        <Trash2 size={18}/>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}