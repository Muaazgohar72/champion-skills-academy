import { useState } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  useGetStats, 
  useListRegistrations, 
  useDeleteRegistration, 
  useAdminLogout,
  useGetRegistration,
  getGetStatsQueryKey,
  getListRegistrationsQueryKey,
  Registration
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trophy, LogOut, Search, Trash2, Eye, Download, Users, TrendingUp, Calendar as CalendarIcon, Shield } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRegId, setSelectedRegId] = useState<number | null>(null);

  // Simple debounce for search
  useState(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: registrations, isLoading: regsLoading } = useListRegistrations({ search: debouncedSearch });
  
  const { data: selectedReg, isLoading: regDetailLoading } = useGetRegistration(selectedRegId as number, {
    query: { enabled: !!selectedRegId }
  });

  const logoutMutation = useAdminLogout();
  const deleteMutation = useDeleteRegistration();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => setLocation("/admin"),
    });
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this registration? This cannot be undone.")) return;
    
    deleteMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Registration deleted" });
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListRegistrationsQueryKey() });
        if (selectedRegId === id) setSelectedRegId(null);
      }
    });
  };

  const downloadCSV = () => {
    if (!registrations || registrations.length === 0) return;
    
    const headers = Object.keys(registrations[0]).join(",");
    const rows = registrations.map(reg => 
      Object.values(reg).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `champion-skills-registrations-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-white">
            <Trophy className="text-primary w-6 h-6" />
            CHAMPION <span className="text-primary font-normal">ADMIN</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-white">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">Total Players</p>
                <h3 className="text-3xl font-black text-white">{statsLoading ? "-" : stats?.total || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">This Month</p>
                <h3 className="text-3xl font-black text-white">{statsLoading ? "-" : stats?.thisMonth || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">This Week</p>
                <h3 className="text-3xl font-black text-white">{statsLoading ? "-" : stats?.thisWeek || 0}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">By Gender</p>
                <div className="text-lg font-bold text-white flex gap-2">
                  <span className="text-blue-400">M:{stats?.byGender.male || 0}</span>
                  <span className="text-pink-400">F:{stats?.byGender.female || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions & Table */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border pb-6">
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Registrations</CardTitle>
            <div className="flex w-full md:w-auto items-center gap-4">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search names..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background border-border"
                />
              </div>
              <Button onClick={downloadCSV} variant="outline" className="shrink-0">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="font-bold text-muted-foreground">ID</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Player Name</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Age/Gender</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Parent</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Phone</TableHead>
                    <TableHead className="font-bold text-muted-foreground">Date</TableHead>
                    <TableHead className="text-right font-bold text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading registrations...</TableCell>
                    </TableRow>
                  ) : registrations?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No registrations found.</TableCell>
                    </TableRow>
                  ) : (
                    registrations?.map((reg) => (
                      <TableRow key={reg.id} className="border-border/50 hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-xs text-muted-foreground">#{reg.id}</TableCell>
                        <TableCell className="font-bold text-white">{reg.playerFirstName} {reg.playerLastName}</TableCell>
                        <TableCell>
                          <span className="inline-block px-2 py-1 rounded bg-secondary text-xs font-semibold mr-2">{reg.age}</span>
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${reg.gender === 'male' ? 'bg-blue-500/20 text-blue-400' : 'bg-pink-500/20 text-pink-400'}`}>
                            {reg.gender.toUpperCase()}
                          </span>
                        </TableCell>
                        <TableCell>{reg.parentName}</TableCell>
                        <TableCell className="font-mono text-sm">{reg.parentPhone}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{format(new Date(reg.createdAt), "MMM d, yyyy")}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setSelectedRegId(reg.id)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(reg.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Detail Modal */}
      <Dialog open={!!selectedRegId} onOpenChange={(o) => !o && setSelectedRegId(null)}>
        <DialogContent className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">Registration Details</DialogTitle>
          </DialogHeader>
          
          {regDetailLoading ? (
            <div className="py-12 flex justify-center text-muted-foreground">Loading details...</div>
          ) : selectedReg ? (
            <div className="space-y-8 py-4">
              {/* Player Info */}
              <section>
                <h3 className="text-lg font-bold text-primary mb-4 border-b border-border pb-2">Player Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><label className="text-xs text-muted-foreground uppercase">First Name</label><div className="font-medium">{selectedReg.playerFirstName}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Last Name</label><div className="font-medium">{selectedReg.playerLastName}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">DOB</label><div className="font-medium">{selectedReg.dateOfBirth}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Age/Gender</label><div className="font-medium">{selectedReg.age} / {selectedReg.gender}</div></div>
                  <div className="col-span-2"><label className="text-xs text-muted-foreground uppercase">Address</label><div className="font-medium">{selectedReg.address}, {selectedReg.city}, {selectedReg.state} {selectedReg.zip}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">School/Grade</label><div className="font-medium">{selectedReg.school} / {selectedReg.grade}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Shirt Size</label><div className="font-medium">{selectedReg.shirtSize}</div></div>
                </div>
              </section>

              {/* Parent Info */}
              <section>
                <h3 className="text-lg font-bold text-primary mb-4 border-b border-border pb-2">Parent/Guardian Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground uppercase">Name (Rel)</label><div className="font-medium">{selectedReg.parentName} ({selectedReg.parentRelationship})</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Contact</label><div className="font-medium">{selectedReg.parentPhone} | {selectedReg.parentEmail}</div></div>
                </div>
              </section>

              {/* Medical */}
              <section>
                <h3 className="text-lg font-bold text-primary mb-4 border-b border-border pb-2">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground uppercase">Conditions</label><div className="font-medium">{selectedReg.hasMedicalConditions ? `Yes: ${selectedReg.medicalConditionsExplain}` : "None"}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Medications</label><div className="font-medium">{selectedReg.takesMedication ? `Yes: ${selectedReg.medicationList}` : "None"}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Allergies</label><div className="font-medium">{selectedReg.allergies || "None"}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Notes</label><div className="font-medium">{selectedReg.medicalNotes || "None"}</div></div>
                </div>
              </section>

              {/* Waivers */}
              <section>
                <h3 className="text-lg font-bold text-primary mb-4 border-b border-border pb-2">Waivers & Signatures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="text-xs text-muted-foreground uppercase">Liability Waiver</label><div className="font-medium text-green-400">Signed: {selectedReg.liabilitySignature}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Attendance</label><div className="font-medium text-green-400">Signed: {selectedReg.attendanceSignature}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Parent Conduct</label><div className="font-medium text-green-400">Signed: {selectedReg.parentConductSignature}</div></div>
                  <div><label className="text-xs text-muted-foreground uppercase">Player Conduct</label><div className="font-medium text-green-400">Signed: {selectedReg.playerConductSignature}</div></div>
                  <div className="col-span-2"><label className="text-xs text-muted-foreground uppercase">Photo Release</label><div className="font-medium">{selectedReg.photoReleaseGranted ? "Granted" : "Denied"} - {selectedReg.photoReleaseSignature}</div></div>
                </div>
              </section>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
