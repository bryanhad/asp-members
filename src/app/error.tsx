"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-[1] items-center justify-center px-6 pb-20 text-center">
            <div className="flex flex-col gap-3">
                <h1 className="text-6xl font-extrabold">Oops!</h1>
                <p className="text-3xl text-accent">Where are we?</p>
                It seems you have encountered some unknown error.
                <p></p>
                <div className="flex justify-center gap-4">
                    <Button asChild>
                        <Link href={"/"}>Return to home</Link>
                    </Button>
                    {/* <Button onClick={() => reset()}>
                        <Link href={"/"}>Try Again</Link>
                    </Button> */}
                </div>
            </div>
        </div>
    );
}
