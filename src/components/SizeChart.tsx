import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type SizeRow = {
  size: string;
  bust: string;
  waist: string;
  hip: string;
};

interface SizeChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  sizeChart: SizeRow[];
  note?: string;
}

const SizeChartDialog = ({
  open,
  onOpenChange,
  title = "Size Chart",
  sizeChart,
  note,
}: SizeChartDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-3 text-left">Size</th>
                <th className="p-3 text-left">Bust (in)</th>
                <th className="p-3 text-left">Waist (in)</th>
                <th className="p-3 text-left">Hip (in)</th>
              </tr>
            </thead>

            <tbody>
              {sizeChart.map((row) => (
                <tr key={row.size} className="border-b">
                  <td className="p-3 font-medium">{row.size}</td>
                  <td className="p-3">{row.bust}</td>
                  <td className="p-3">{row.waist}</td>
                  <td className="p-3">{row.hip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {note && (
          <p className="text-sm text-muted-foreground mt-4">
            {note}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SizeChartDialog;
