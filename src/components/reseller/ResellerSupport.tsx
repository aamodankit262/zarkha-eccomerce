import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Ticket, Plus, Search, Package, Clock, CheckCircle2, AlertCircle, MessageSquare, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportTicket {
  id: string; subject: string; description: string;
  category: 'order_delay' | 'wrong_item' | 'refund' | 'damaged' | 'other';
  orderId?: string; status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high'; createdAt: string; updatedAt: string; responses: number;
}

const ResellerSupport = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", category: "", orderId: "", priority: "medium" });

  const [tickets, setTickets] = useState<SupportTicket[]>([
    { id: 'RTKT001', subject: 'Order delayed beyond expected date', description: 'My order RORD002 was supposed to arrive on Jan 20.', category: 'order_delay', orderId: 'RORD002', status: 'in_progress', priority: 'high', createdAt: '2024-01-22', updatedAt: '2024-01-23', responses: 2 },
    { id: 'RTKT002', subject: 'Wrong color received', description: 'Ordered red but received blue kurta set.', category: 'wrong_item', orderId: 'RORD001', status: 'resolved', priority: 'medium', createdAt: '2024-01-18', updatedAt: '2024-01-20', responses: 3 },
  ]);

  const getCategoryLabel = (c: string) => ({ order_delay: 'Order Delay', wrong_item: 'Wrong Item', refund: 'Refund', damaged: 'Damaged', other: 'Other' }[c] || c);
  const getStatusIcon = (s: string) => { if (s === 'resolved' || s === 'closed') return <CheckCircle2 className="h-4 w-4 text-green-500" />; if (s === 'in_progress') return <Clock className="h-4 w-4 text-blue-500" />; return <AlertCircle className="h-4 w-4 text-yellow-500" />; };
  const getStatusBadge = (s: string) => { if (s === 'resolved') return <Badge className="bg-green-100 text-green-700">Resolved</Badge>; if (s === 'in_progress') return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>; if (s === 'closed') return <Badge className="bg-gray-100 text-gray-700">Closed</Badge>; return <Badge className="bg-yellow-100 text-yellow-700">Open</Badge>; };
  const getPriorityBadge = (p: string) => { if (p === 'high') return <Badge variant="destructive">High</Badge>; if (p === 'low') return <Badge variant="outline">Low</Badge>; return <Badge variant="secondary">Medium</Badge>; };

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.description || !newTicket.category) { toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" }); return; }
    const ticket: SupportTicket = { id: `RTKT${String(tickets.length + 1).padStart(3, '0')}`, subject: newTicket.subject, description: newTicket.description, category: newTicket.category as any, orderId: newTicket.orderId || undefined, status: 'open', priority: newTicket.priority as any, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0], responses: 0 };
    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: "", description: "", category: "", orderId: "", priority: "medium" });
    setShowCreateDialog(false);
    toast({ title: "Ticket Created", description: `Ticket ${ticket.id} created.` });
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-brand-orange/10 rounded-lg"><Ticket className="h-5 w-5 text-brand-orange" /></div><div><p className="text-2xl font-bold">{tickets.length}</p><p className="text-xs text-muted-foreground">Total Tickets</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-yellow-100 rounded-lg"><AlertCircle className="h-5 w-5 text-yellow-600" /></div><div><p className="text-2xl font-bold">{openTickets}</p><p className="text-xs text-muted-foreground">Open</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-blue-100 rounded-lg"><Clock className="h-5 w-5 text-blue-600" /></div><div><p className="text-2xl font-bold">{tickets.filter(t => t.status === 'in_progress').length}</p><p className="text-xs text-muted-foreground">In Progress</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="p-2 bg-green-100 rounded-lg"><CheckCircle2 className="h-5 w-5 text-green-600" /></div><div><p className="text-2xl font-bold">{tickets.filter(t => t.status === 'resolved').length}</p><p className="text-xs text-muted-foreground">Resolved</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <CardTitle className="text-lg">Support Tickets</CardTitle>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild><Button variant="brand" size="sm"><Plus className="h-4 w-4 mr-1" /> New Ticket</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Support Ticket</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2"><Label>Category *</Label><Select value={newTicket.category} onValueChange={(v) => setNewTicket({...newTicket, category: v})}><SelectTrigger><SelectValue placeholder="Select issue type" /></SelectTrigger><SelectContent><SelectItem value="order_delay">Order Delay</SelectItem><SelectItem value="wrong_item">Wrong Item</SelectItem><SelectItem value="refund">Refund Issue</SelectItem><SelectItem value="damaged">Damaged Item</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><Label>Order ID (optional)</Label><Input placeholder="e.g., RORD001" value={newTicket.orderId} onChange={(e) => setNewTicket({...newTicket, orderId: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Subject *</Label><Input placeholder="Brief description" value={newTicket.subject} onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})} /></div>
                  <div className="space-y-2"><Label>Description *</Label><Textarea placeholder="Provide details..." value={newTicket.description} onChange={(e) => setNewTicket({...newTicket, description: e.target.value})} rows={4} /></div>
                  <div className="space-y-2"><Label>Priority</Label><Select value={newTicket.priority} onValueChange={(v) => setNewTicket({...newTicket, priority: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
                  <Button variant="brand" className="w-full" onClick={handleCreateTicket}>Submit Ticket</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="open">Open</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="resolved">Resolved</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8"><Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-3" /><p className="text-muted-foreground">No tickets found</p></div>
            ) : filteredTickets.map(ticket => (
              <div key={ticket.id} className="flex gap-3 p-4 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="mt-1">{getStatusIcon(ticket.status)}</div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h4 className="font-medium">{ticket.subject}</h4>
                    <div className="flex gap-2">{getStatusBadge(ticket.status)}{getPriorityBadge(ticket.priority)}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{ticket.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{ticket.id}</span>
                    <Badge variant="outline" className="text-xs">{getCategoryLabel(ticket.category)}</Badge>
                    {ticket.orderId && <span className="flex items-center gap-1"><Package className="h-3 w-3" />{ticket.orderId}</span>}
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ticket.createdAt}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{ticket.responses} responses</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResellerSupport;