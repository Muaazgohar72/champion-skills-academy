import { motion } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar, Phone, MapPin, CheckCircle, Trophy, Star, Users, Target, Zap, Shield, Heart, Send } from "lucide-react";
import heroStadium from "@/assets/images/hero-stadium.png";
import coachSilhouette from "@/assets/images/coach-silhouette.png";
import transitionBg from "@/assets/images/transition-bg.png";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useSubmitContact, useHealthCheck } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message too short"),
});

export default function Home() {
  useHealthCheck(); // Ping the server
  
  const { toast } = useToast();
  const contactMutation = useSubmitContact();
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" }
  });

  const onContactSubmit = (data: z.infer<typeof contactSchema>) => {
    contactMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "Message Sent", description: "Coach Andi will get back to you shortly." });
        form.reset();
      },
      onError: () => {
        toast({ variant: "destructive", title: "Error", description: "Failed to send message." });
      }
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src={heroStadium} alt="Dark stadium" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary font-semibold tracking-wide text-sm">
              ELITE YOUTH SOCCER TRAINING
            </div>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6">
              Develop <span className="text-primary">Skills.</span><br />
              Build <span className="text-primary">Character.</span><br />
              Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Champion.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 font-light mb-10 max-w-2xl">
              Professional Soccer Training Program for Kids (Ages 7-9) in Springfield, MA. Stop playing games. Start training.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg font-bold tracking-wider shadow-[0_0_30px_rgba(106,27,255,0.4)]">
                  REGISTER NOW
                </Button>
              </Link>
              <a href="tel:4135792721">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold tracking-wider border-white/20 hover:bg-white hover:text-black">
                  <Phone className="mr-2 w-5 h-5" /> CALL COACH
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-xs tracking-widest uppercase font-bold text-primary">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Trust Stats */}
      <section className="py-20 border-b border-border/30 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: "20+", label: "Players Registered" },
              { number: "30", label: "Registrations In Progress" },
              { number: "Pro", label: "Coaching Level" },
              { number: "100%", label: "Skill Development" },
            ].map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="text-4xl md:text-6xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-primary font-bold tracking-widest uppercase text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Coach */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
                <img src={coachSilhouette} alt="Coach Andi Modrica" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-card border border-border p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
                <div className="font-black text-2xl text-white">Coach Andi</div>
                <div className="text-primary font-bold">Head Coach & Founder</div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">
                Meet <span className="text-primary">Head Coach</span> Andi Modrica
              </h2>
              <p className="text-xl text-gray-400 font-light mb-6 leading-relaxed">
                Elite coaching isn't just about running drills. It's about forging a champion's mindset. Coach Andi brings professional-level training standards to youth development, focusing on the critical early years of skill acquisition.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Professional coaching methodology",
                  "Focus on technical ball mastery",
                  "Character & leadership development",
                  "High-intensity, focused sessions"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-medium">
                    <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transition Banner */}
      <section className="h-64 relative flex items-center justify-center overflow-hidden border-y border-border/30">
        <img src={transitionBg} alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
        <h2 className="relative z-10 text-4xl md:text-6xl font-black tracking-widest uppercase text-white/90 text-center px-4">
          Built for <span className="text-primary">Greatness</span>
        </h2>
      </section>

      {/* Program Info */}
      <section className="py-32 bg-card relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">Program Details</h2>
            <p className="text-xl text-gray-400">Everything you need to know about the upcoming season.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "Ages", value: "7 - 9 Years Old" },
              { icon: Calendar, label: "Season", value: "July - Sept (3 Months)" },
              { icon: Target, label: "Practice", value: "Wednesdays 6:00-7:30PM" },
              { icon: MapPin, label: "Location", value: "Springfield, MA" },
            ].map((info, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-background border border-border p-8 rounded-2xl flex flex-col items-center text-center hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <info.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-gray-400 font-bold tracking-widest uppercase text-sm mb-2">{info.label}</div>
                <div className="text-xl font-bold text-white">{info.value}</div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-gradient-to-r from-primary/20 to-transparent border border-primary/30 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <div className="text-3xl font-black text-white mb-2">Tuition: $50 / Month</div>
              <div className="text-gray-400">Professional training at an accessible rate.</div>
            </div>
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg font-bold tracking-wider shadow-[0_0_20px_rgba(106,27,255,0.4)]">
                SECURE YOUR SPOT
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Practice Calendar */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
              Summer <span className="text-primary">Calendar</span>
            </h2>
            <p className="text-xl text-gray-400">Practices run every Wednesday from 6:00 PM to 7:30 PM</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['July', 'August', 'September'].map((month, idx) => (
              <Card key={month} className="bg-card/50 border-border/50 backdrop-blur">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-6 text-center">{month}</h3>
                  <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold text-muted-foreground uppercase">
                    <div>S</div><div>M</div><div>T</div><div className="text-primary">W</div><div>T</div><div>F</div><div>S</div>
                  </div>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {Array.from({ length: 35 }).map((_, i) => {
                      // Just a stylized placeholder calendar representation
                      const isWednesday = i % 7 === 3;
                      const dayNumber = i - (idx * 2) + 1; // offset start days roughly
                      const isValidDay = dayNumber > 0 && dayNumber <= 31;
                      
                      if (!isValidDay) return <div key={i} className="aspect-square" />;
                      
                      return (
                        <div 
                          key={i} 
                          className={`aspect-square flex items-center justify-center rounded-md text-sm font-medium
                            ${isWednesday ? 'bg-primary text-white shadow-[0_0_10px_rgba(106,27,255,0.5)]' : 'text-gray-400 hover:bg-white/5'}
                          `}
                        >
                          {dayNumber}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 relative overflow-hidden bg-card border-y border-border/30">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-4">
              The <span className="text-primary">Champion</span> Curriculum
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { label: "Technical Skills", icon: Zap },
              { label: "Confidence", icon: Star },
              { label: "Ball Control", icon: Target },
              { label: "Passing", icon: Users },
              { label: "Shooting", icon: Trophy },
              { label: "Fitness", icon: Heart },
              { label: "Character", icon: Shield },
              { label: "Leadership", icon: Star },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-background/50 backdrop-blur border border-border p-6 rounded-xl flex items-center gap-4 hover:bg-background transition-colors group"
              >
                <feature.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-bold text-white tracking-wide">{feature.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Checklist */}
      <section className="py-32 bg-background border-b border-border/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">
                Equipment <span className="text-primary">Checklist</span>
              </h2>
              <p className="text-xl text-gray-400 font-light mb-8">
                Come prepared. Look the part. Play the part.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Soccer Cleats", "Shin Guards", "Soccer Ball Size 4", 
                  "Water Bottle", "Black Shorts", "Purple or Black Socks", 
                  "Practice Jersey", "Sunscreen (Optional)"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-card border border-border p-4 rounded-lg">
                    <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                    <span className="font-semibold text-white">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-square bg-gradient-to-br from-primary/20 to-background rounded-full border-8 border-card flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(106,27,255,0.2)]"
            >
              <Trophy className="w-48 h-48 text-primary/50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-12 flex flex-col justify-center">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-8">Get In Touch</h2>
                
                <div className="space-y-8 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 font-bold tracking-widest uppercase mb-1">Call Coach Andi</div>
                      <a href="tel:4135792721" className="text-2xl font-bold text-white hover:text-primary transition-colors">(413) 579-2721</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 font-bold tracking-widest uppercase mb-1">Location</div>
                      <div className="text-xl font-bold text-white">Springfield, MA</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-8 mt-4">
                  <h3 className="text-lg font-bold mb-4">Send a Message</h3>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onContactSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                          <FormItem><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormControl><Input placeholder="Phone (Optional)" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormControl><Input placeholder="Email Address" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="message" render={({ field }) => (
                        <FormItem><FormControl><Textarea placeholder="How can we help?" className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button type="submit" disabled={contactMutation.isPending} className="w-full font-bold tracking-wider">
                        {contactMutation.isPending ? "SENDING..." : <><Send className="w-4 h-4 mr-2" /> SEND MESSAGE</>}
                      </Button>
                    </form>
                  </Form>
                </div>
              </div>
              
              <div className="relative min-h-[400px] bg-muted hidden md:block">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1m2!1s0x89e6e62c2f6d0f53%3A0xc47bba4ce33eb6e2!2sSpringfield%2C%20MA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                  className="absolute inset-0 w-full h-full border-0 grayscale invert opacity-70 hover:opacity-100 transition-opacity duration-500" 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
