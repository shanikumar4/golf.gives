import { useEffect, useRef, useState } from "react";
import { Trophy, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useApp } from "../../hooks/useApp";
import { winnerService } from "../../services/winnerService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { formatters } from "../../utils/formatters";

export function WinningsPage() {
    const { winnings, fetchWinnings, isLoadingWin } = useApp();
    const [uploading, setUploading] = useState(null);
    const fileRef = useRef({});

    useEffect(() => { fetchWinnings(); }, []);

    const handleUpload = async (winId, file) => {
        if (!file) return;
        setUploading(winId);
        try {
            const fd = new FormData();
            fd.append("proof", file);
            fd.append("winId", winId);
            await winnerService.uploadProof(fd);
            toast.success("Proof uploaded!");
            fetchWinnings();
        } catch (err) {
            toast.error(err.response?.data?.message || "Upload failed");
        } finally {
            setUploading(null);
        }
    };

    if (isLoadingWin && !winnings) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

    const list = winnings?.winnings || winnings || [];

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="font-display text-3xl text-white mb-1">Winnings</h1>
                <p className="text-white/50">Your draw results and prize history</p>
            </div>

            {list.length === 0 ? (
                <Card className="text-center py-16">
                    <Trophy className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <p className="text-white/50 font-medium">No winnings yet</p>
                    <p className="text-white/30 text-sm mt-1">Keep playing — your turn is coming!</p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {list.map((w) => {
                        const id = w._id || w.id;
                        return (
                            <Card key={id}>
                                <div className="flex items-start justify-between gap-4 flex-wrap">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                                            <Trophy className="h-6 w-6 text-yellow-400" />
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold">{formatters.currency(w.amount || w.prize)}</p>
                                            <p className="text-white/50 text-sm">{formatters.date(w.date || w.createdAt)}</p>
                                        </div>
                                    </div>
                                    <Badge variant={w.status === 'approved' || w.status === 'verified' ? "success" : w.proofImage ? "warning" : "muted"}>
                                        {w.status === 'approved' || w.status === 'verified'  ? "Verified" : w.proofImage ? "Proof Uploaded" : "Pending Proof"}
                                    </Badge>
                                </div>

                                {!w.proofImage && w.status === 'pending' && (
                                    <div className="mt-4 pt-4 border-t border-surface-border">
                                        <input
                                            type="file" accept="image/*"
                                            ref={(el) => (fileRef.current[id] = el)}
                                            className="hidden"
                                            onChange={(e) => handleUpload(id, e.target.files[0])}
                                        />
                                        <Button
                                            variant="secondary" size="sm"
                                            isLoading={uploading === id}
                                            onClick={() => fileRef.current[id]?.click()}
                                        >
                                            <Upload className="h-4 w-4" />
                                            Upload Proof
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}