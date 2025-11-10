import { Link, Sparkles } from "lucide-react";
import { Button } from "../ui/button";

export const Navbar = () => {
    return (
        <nav className="bg-white">
            <div className='p-4 max-w-[1600px] w-full justify-between flex items-center mx-auto'>

                <Link href={"/"}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-black text-xl font-bold">WriteWise AI</h1>
                            <p className="text-xs text-muted-foreground">Enhance your writing with AI suggestions</p>
                        </div>
                    </div>
                </Link>

                <div className='space-x-4 items-center'>
                    <Button
                        variant={"new"}

                    >
                        History
                    </Button>

                    <Button
                        variant={"new2"}
                    >
                        Upgrade to Pro
                    </Button>
                </div>

            </div>
        </nav>
    );
}