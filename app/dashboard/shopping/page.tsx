import type { Metadata } from "next";
import ShoppingView from "@/components/dashboard/shopping/ShoppingView";

export const metadata: Metadata = {
    title: "Shopping - DayFlow",
};

export default function ShoppingPage() {
    return (
        <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-extrabold tracking-tight">Shopping</h1>
            <p className="mt-2 text-muted">
                Build your shopping lists and keep a catalog of the things you buy.
            </p>

            <ShoppingView/>
        </div>
    );
}