import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function LeadFormModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onOpenChange(false);
      toast({
        title: "Richiesta inviata! ✅",
        description: "Ti ricontatteremo entro 2 ore lavorative.",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-xl">
            Prenota la Tua Consulenza Gratuita
          </DialogTitle>
          <DialogDescription>
            Compila il form e ti ricontatteremo entro 2 ore lavorative.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="name">Nome e Cognome *</Label>
            <Input id="name" required placeholder="Mario Rossi" />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input id="email" type="email" required placeholder="mario@email.it" />
          </div>
          <div>
            <Label htmlFor="phone">Telefono *</Label>
            <Input id="phone" type="tel" required placeholder="+39 333 1234567" />
          </div>
          <div>
            <Label>Settore</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona il tuo settore" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="artigiano">Artigiano</SelectItem>
                <SelectItem value="pmi">PMI Edilizia</SelectItem>
                <SelectItem value="professionista">Professionista</SelectItem>
                <SelectItem value="altro">Altro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="challenge">Qual è la tua sfida principale?</Label>
            <Textarea id="challenge" placeholder="Raccontaci brevemente..." rows={3} />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-cta text-primary-foreground rounded-full font-subtitle font-bold hover:opacity-90"
          >
            {loading ? "Invio in corso..." : "Prenota Ora →"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Ti ricontatteremo entro 2 ore lavorative
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
