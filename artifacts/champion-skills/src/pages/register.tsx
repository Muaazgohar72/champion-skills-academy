import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useSubmitRegistration } from "@workspace/api-client-react";
import { Trophy, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const registrationSchema = z.object({
  playerFirstName: z.string().min(1, "Required"),
  playerLastName: z.string().min(1, "Required"),
  dateOfBirth: z.string().min(1, "Required"),
  age: z.coerce.number().min(7, "Must be at least 7").max(9, "Must be 9 or younger"),
  gender: z.enum(["male", "female"]),
  address: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  zip: z.string().min(1, "Required"),
  school: z.string().min(1, "Required"),
  grade: z.string().min(1, "Required"),
  shirtSize: z.enum(["YS", "YM", "YL", "AS", "AM", "AL", "AXL"]),
  
  parentName: z.string().min(1, "Required"),
  parentRelationship: z.string().min(1, "Required"),
  parentPhone: z.string().min(1, "Required"),
  parentEmail: z.string().email("Invalid email"),
  hearAboutUs: z.string().min(1, "Required"),
  
  emergencyContact1Name: z.string().min(1, "Required"),
  emergencyContact1Relationship: z.string().min(1, "Required"),
  emergencyContact1Phone: z.string().min(1, "Required"),
  emergencyContact2Name: z.string().optional().nullable(),
  emergencyContact2Relationship: z.string().optional().nullable(),
  emergencyContact2Phone: z.string().optional().nullable(),
  
  hasMedicalConditions: z.boolean(),
  medicalConditionsExplain: z.string().optional().nullable(),
  takesMedication: z.boolean(),
  medicationList: z.string().optional().nullable(),
  allergies: z.string().optional().nullable(),
  medicalNotes: z.string().optional().nullable(),
  
  liabilityAgreed: z.literal(true, { errorMap: () => ({ message: "You must agree to the liability waiver" }) }),
  liabilitySignature: z.string().min(1, "Signature required"),
  liabilityDate: z.string().min(1, "Date required"),
  
  attendanceAgreed: z.literal(true, { errorMap: () => ({ message: "You must agree to the attendance policy" }) }),
  attendanceSignature: z.string().min(1, "Signature required"),
  attendanceDate: z.string().min(1, "Date required"),
  
  parentConductAgreed: z.literal(true, { errorMap: () => ({ message: "You must agree to the parent code of conduct" }) }),
  parentConductSignature: z.string().min(1, "Signature required"),
  parentConductDate: z.string().min(1, "Date required"),
  
  playerConductAgreed: z.literal(true, { errorMap: () => ({ message: "You must agree to the player code of conduct" }) }),
  playerConductSignature: z.string().min(1, "Signature required"),
  playerConductDate: z.string().min(1, "Date required"),
  
  photoReleaseGranted: z.boolean(),
  photoReleaseParentName: z.string().min(1, "Name required"),
  photoReleaseSignature: z.string().min(1, "Signature required"),
  photoReleaseDate: z.string().min(1, "Date required"),
});

type RegistrationValues = z.infer<typeof registrationSchema>;

const STEPS = [
  "Player Info",
  "Parent/Guardian",
  "Emergency Contacts",
  "Medical Info",
  "Waivers & Code of Conduct",
  "Photo Release"
];

export default function Register() {
  const [step, setStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const submitMutation = useSubmitRegistration();

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      gender: "male",
      shirtSize: "YM",
      hasMedicalConditions: false,
      takesMedication: false,
      photoReleaseGranted: true,
      liabilityAgreed: true, // simplified for demo
      attendanceAgreed: true,
      parentConductAgreed: true,
      playerConductAgreed: true,
    },
    mode: "onChange"
  });

  const nextStep = async () => {
    const fieldsByStep: (keyof RegistrationValues)[][] = [
      ["playerFirstName", "playerLastName", "dateOfBirth", "age", "gender", "address", "city", "state", "zip", "school", "grade", "shirtSize"],
      ["parentName", "parentRelationship", "parentPhone", "parentEmail", "hearAboutUs"],
      ["emergencyContact1Name", "emergencyContact1Relationship", "emergencyContact1Phone"],
      ["hasMedicalConditions", "takesMedication"],
      ["liabilityAgreed", "liabilitySignature", "liabilityDate", "attendanceAgreed", "attendanceSignature", "attendanceDate", "parentConductAgreed", "parentConductSignature", "parentConductDate", "playerConductAgreed", "playerConductSignature", "playerConductDate"],
      ["photoReleaseGranted", "photoReleaseParentName", "photoReleaseSignature", "photoReleaseDate"]
    ];

    const currentFields = fieldsByStep[step];
    const isStepValid = await form.trigger(currentFields);
    
    if (isStepValid) {
      setStep(s => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo(0, 0);
  };

  const onSubmit = (data: RegistrationValues) => {
    submitMutation.mutate({ data }, {
      onSuccess: () => {
        setIsSuccess(true);
      },
      onError: () => {
        toast({ variant: "destructive", title: "Registration Failed", description: "Please try again later." });
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="max-w-md w-full bg-card border border-border p-12 rounded-3xl"
        >
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Registration Complete</h1>
          <p className="text-muted-foreground mb-8">
            Welcome to Champion Skills Academy. You'll receive a confirmation email shortly with the next steps.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full font-bold tracking-wider">RETURN TO HOME</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="playerFirstName" render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="playerLastName" render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="age" render={({ field }) => (
                <FormItem><FormLabel>Age (7-9)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="shirtSize" render={({ field }) => (
                <FormItem>
                  <FormLabel>Shirt Size</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select size" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["YS", "YM", "YL", "AS", "AM", "AL", "AXL"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="zip" render={({ field }) => (
                  <FormItem><FormLabel>ZIP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="school" render={({ field }) => (
                <FormItem><FormLabel>School</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="grade" render={({ field }) => (
                <FormItem><FormLabel>Grade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="parentName" render={({ field }) => (
                <FormItem><FormLabel>Parent/Guardian Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="parentRelationship" render={({ field }) => (
                <FormItem><FormLabel>Relationship to Player</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="parentPhone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="parentEmail" render={({ field }) => (
                <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="md:col-span-2">
                <FormField control={form.control} name="hearAboutUs" render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you hear about us?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select option" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="Friend">Word of Mouth / Friend</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Primary Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="emergencyContact1Name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emergencyContact1Relationship" render={({ field }) => (
                  <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emergencyContact1Phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <h3 className="text-lg font-bold text-muted-foreground mb-4">Secondary Emergency Contact (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="emergencyContact2Name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emergencyContact2Relationship" render={({ field }) => (
                  <FormItem><FormLabel>Relationship</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="emergencyContact2Phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <FormField control={form.control} name="hasMedicalConditions" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg bg-card">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Player has medical conditions</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.watch("hasMedicalConditions") && (
              <FormField control={form.control} name="medicalConditionsExplain" render={({ field }) => (
                <FormItem><FormLabel>Please explain conditions</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            )}
            
            <FormField control={form.control} name="takesMedication" render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg bg-card">
                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Player takes medication</FormLabel>
                </div>
              </FormItem>
            )} />
            {form.watch("takesMedication") && (
              <FormField control={form.control} name="medicationList" render={({ field }) => (
                <FormItem><FormLabel>List medications</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            )}

            <FormField control={form.control} name="allergies" render={({ field }) => (
              <FormItem><FormLabel>Allergies (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
            
            <FormField control={form.control} name="medicalNotes" render={({ field }) => (
              <FormItem><FormLabel>Additional Medical Notes (Optional)</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            {/* Liability */}
            <div className="p-6 bg-card border border-border rounded-xl space-y-4">
              <h3 className="font-bold text-primary">Liability Waiver</h3>
              <p className="text-sm text-muted-foreground">I hereby assume all risks associated with participation in Champion Skills Academy...</p>
              <FormField control={form.control} name="liabilityAgreed" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>I Agree</FormLabel>
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="liabilitySignature" render={({ field }) => (
                  <FormItem><FormLabel>Signature (Type Name)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="liabilityDate" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            {/* Attendance */}
            <div className="p-6 bg-card border border-border rounded-xl space-y-4">
              <h3 className="font-bold text-primary">Attendance Agreement</h3>
              <FormField control={form.control} name="attendanceAgreed" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>I Agree</FormLabel>
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="attendanceSignature" render={({ field }) => (
                  <FormItem><FormLabel>Signature</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="attendanceDate" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            {/* Conduct */}
            <div className="p-6 bg-card border border-border rounded-xl space-y-4">
              <h3 className="font-bold text-primary">Codes of Conduct</h3>
              <FormField control={form.control} name="parentConductAgreed" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>Parent Conduct Agreed</FormLabel>
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField control={form.control} name="parentConductSignature" render={({ field }) => (
                  <FormItem><FormLabel>Parent Signature</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="parentConductDate" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="playerConductAgreed" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-4">
                  <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  <FormLabel>Player Conduct Agreed</FormLabel>
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="playerConductSignature" render={({ field }) => (
                  <FormItem><FormLabel>Player/Parent Signature</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="playerConductDate" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="p-6 bg-card border border-border rounded-xl space-y-6">
              <h3 className="font-bold text-primary">Photo & Video Release</h3>
              <p className="text-muted-foreground">Do you grant permission for Champion Skills Academy to use photos/videos of your child for promotional purposes?</p>
              
              <FormField control={form.control} name="photoReleaseGranted" render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup 
                      onValueChange={(val) => field.onChange(val === 'yes')} 
                      defaultValue={field.value ? 'yes' : 'no'}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes, I grant permission</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No, I do not</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                <FormField control={form.control} name="photoReleaseParentName" render={({ field }) => (
                  <FormItem><FormLabel>Parent Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="photoReleaseSignature" render={({ field }) => (
                  <FormItem><FormLabel>Signature</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="photoReleaseDate" render={({ field }) => (
                  <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-white">
            <Trophy className="text-primary w-6 h-6" />
            CHAMPION <span className="text-primary font-normal">SKILLS</span>
          </Link>
          <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest hidden md:block">
            Registration Form
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Player Registration</h1>
          <p className="text-muted-foreground">Complete the form below to secure a spot for the upcoming season.</p>
          
          <div className="mt-8 flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border z-0" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary z-0 transition-all duration-500" style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }} />
            
            {STEPS.map((s, i) => (
              <div key={i} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${i <= step ? 'bg-primary text-white shadow-[0_0_15px_rgba(106,27,255,0.5)]' : 'bg-card border-2 border-border text-muted-foreground'}`}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="text-center mt-4 font-bold text-primary uppercase tracking-widest text-sm">
            Step {step + 1}: {STEPS[step]}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between pt-8 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={prevStep} 
                disabled={step === 0}
                className="font-bold tracking-wider"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> BACK
              </Button>
              
              {step < STEPS.length - 1 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="font-bold tracking-wider shadow-[0_0_15px_rgba(106,27,255,0.3)]"
                >
                  NEXT <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  className="font-bold tracking-wider bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]"
                >
                  {submitMutation.isPending ? "SUBMITTING..." : "COMPLETE REGISTRATION"}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
