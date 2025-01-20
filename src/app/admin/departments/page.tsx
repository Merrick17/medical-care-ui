"use client"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Pencil, Trash2, Loader2, Search } from "lucide-react";
import { DepartmentDialog } from "@/components/departments/department-dialog";
import useStore from "@/store";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function DepartmentsPage() {
  const { departments, isLoading, error, fetchDepartments, addDepartment, updateDepartment, deleteDepartment } = useStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleAddEdit = (dept?: any) => {
    setSelectedDepartment(dept || null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: any) => {
    if (selectedDepartment) {
      await updateDepartment(selectedDepartment._id, data);
    } else {
      await addDepartment(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      await deleteDepartment(id);
    }
  };

  const filteredDepartments = departments?.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Departments Management</CardTitle>
              <CardDescription>
                Manage hospital departments and their doctors
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                Total: {filteredDepartments?.length || 0}
              </Badge>
              <Button onClick={() => handleAddEdit()} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Department
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search departments..."
                className="pl-8 max-w-xs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredDepartments?.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No departments found. Click the button above to add one.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDepartments?.map((dept) => (
                <Card key={dept._id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{dept.name}</CardTitle>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {dept.doctors.length} {dept.doctors.length === 1 ? 'Doctor' : 'Doctors'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{dept.description}</p>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Doctors:</div>
                        <div className="space-y-1">
                          {dept.doctors.map((doctor) => (
                            <div key={doctor._id} className="text-sm flex items-center gap-2">
                              <Users className="h-4 w-4 text-primary" />
                              {doctor.name}
                            </div>
                          ))}
                          {dept.doctors.length === 0 && (
                            <div className="text-sm text-muted-foreground italic">
                              No doctors assigned
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Last updated: {format(new Date(dept.updatedAt), 'MMM d, yyyy')}
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary/10"
                          onClick={() => handleAddEdit(dept)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(dept._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <DepartmentDialog
        department={selectedDepartment}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 