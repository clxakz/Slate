import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

export default function Titlebar() {
    const [progress, setProgress] = useState<number | null>(null);

    useEffect(() => {
        const unsubscribe = window.api.onUpdateProgress((progress: any) => {
            setProgress(progress.percent);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="drag border-b-1 h-7 min-h-7 flex items-center pl-2">
            {progress !== null && progress < 100 && (
                <div className="flex items-center gap-1">
                    <Loader size={15} className="animate-spin" />
                    <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                </div>
            )}

            { progress !== null && progress >= 100 &&
                <p className="text-xs text-muted-foreground">Restart slate to apply the update</p>
            }
        </div>
    );
}