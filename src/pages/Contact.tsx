import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import SEO from "@/components/SEO";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <SEO />
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid gap-8">
        <div className="grid gap-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Get in Touch</h2>
            <p className="text-slate-600">
              Have questions? We'd love to hear from you. Send us a message
              and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-2">Email</p>
              <p className="text-slate-600">contact@backlinkbazaar.online</p>
            </div>
            <div>
              <p className="font-medium mb-2">Location</p>
              <p className="text-slate-600">United States</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-2">Name</label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium mb-2">Email</label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>
          
          <div>
            <label htmlFor="subject" className="block font-medium mb-2">Subject</label>
            <Input id="subject" name="subject" required />
          </div>
          
          <div>
            <label htmlFor="message" className="block font-medium mb-2">Message</label>
            <Textarea id="message" name="message" rows={5} required />
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;