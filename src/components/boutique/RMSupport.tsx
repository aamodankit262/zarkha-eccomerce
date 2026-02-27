import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Phone, Mail, MessageSquare, CheckCircle2, Clock, AlertCircle,
  Calendar, User, Building
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { boutiqueService } from "@/boutiqueServices/boutiqueService";
import { useBoutique } from "@/contexts/BoutiqueContext";
import { logger } from "@/helper/logger";

interface RMTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  createdAt: string;
}

const RMSupport = () => {
  const { data: SupportListRes, request: getSupportList } = useApi(boutiqueService.getSupportList)
  const { data: detailsRes, request: fetchCurationDetails } = useApi(boutiqueService.CurationsDetails)
  const {
    data: productRes,
    request: fetchProducts,
  } = useApi(boutiqueService.productList);
  const {isLoggedIn} = useBoutique();
  // const { data: categories, request: fetchCategories } = useApi(industryService.getCat);
  // const { data: subcategories, request: fetchSubCategories } = useApi(industryService.getSubCat);
  useEffect(() => {
    if (isLoggedIn) {
      getSupportList({
        status: "open",
        search: "",
        page: 1,
        limit: 20,
      });
    }
  }, [isLoggedIn]);
  logger.log(SupportListRes, 'SupportListRes');
  const rmManager = {
    id: 'rm001',
    name: 'Rahul Mehta',
    email: 'rahul.mehta@platform.com',
    phone: '+91 9876543210',
    designation: 'Relationship Manager',
    region: 'Western India',
    avatar: ''
  };

  const [tasks] = useState<RMTask[]>([
    {
      id: 't1',
      title: 'Complete store profile',
      description: 'Add shop description, photos, and social media links to your store profile',
      status: 'pending',
      dueDate: '2024-02-15',
      createdAt: '2024-02-01'
    },
    {
      id: 't2',
      title: 'Upload product catalog',
      description: 'Add at least 20 products to your catalog with proper pricing',
      status: 'in_progress',
      dueDate: '2024-02-10',
      createdAt: '2024-01-28'
    },
    {
      id: 't3',
      title: 'First order placed',
      description: 'Place your first bulk order to unlock seller benefits',
      status: 'completed',
      dueDate: '2024-02-05',
      createdAt: '2024-01-25'
    },
    {
      id: 't4',
      title: 'GST verification',
      description: 'Submit GST documents for verification to enable B2B features',
      status: 'pending',
      dueDate: '2024-02-20',
      createdAt: '2024-02-02'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'in_progress': return <Badge className="bg-blue-100 text-blue-700">In Progress</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* RM Contact Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Relationship Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src={rmManager.avatar} />
              <AvatarFallback className="bg-brand-orange text-white text-lg">
                {rmManager.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{rmManager.name}</h3>
              <p className="text-sm text-muted-foreground">{rmManager.designation}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Building className="h-3 w-3" />
                {rmManager.region}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={`tel:${rmManager.phone}`}>
                  <Phone className="h-4 w-4 mr-1" /> Call
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={`mailto:${rmManager.email}`}>
                  <Mail className="h-4 w-4 mr-1" /> Email
                </a>
              </Button>
              <Button variant="brand" size="sm">
                <MessageSquare className="h-4 w-4 mr-1" /> Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingTasks}</p>
                <p className="text-sm text-muted-foreground">Pending Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedTasks}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tasks & Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex gap-3 p-4 border rounded-lg">
                <div className="mt-1">{getStatusIcon(task.status)}</div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    {getStatusBadge(task.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {task.dueDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Assigned by RM
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RMSupport;
