"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCreateBooking } from "@/lib/convex/client";
import { cn } from "@/lib/utils";

// Service options with pricing
const SERVICE_OPTIONS = [
  {
    value: "initial-consultation",
    label: "Initial Consultation",
    duration: "45-60 minutes",
    price: "$100",
    description: "Comprehensive initial assessment and treatment planning",
  },
  {
    value: "regular-adjustment",
    label: "Regular Adjustment",
    duration: "30 minutes",
    price: "$90",
    description: "Standard chiropractic adjustment session",
  },
  {
    value: "extended-comprehensive",
    label: "Extended Comprehensive Session",
    duration: "60 minutes",
    price: "$180",
    description: "Extended session with additional therapies and modalities",
  },
] as const;

// Form validation schema
const bookingFormSchema = z.object({
  serviceType: z.enum(["initial-consultation", "regular-adjustment", "extended-comprehensive"], {
    message: "Please select a service type",
  }),
  date: z.date({
    message: "Please select a date",
  }),
  time: z.string().min(1, {
    message: "Please select a time",
  }),
  notes: z.string().optional(),
});

// Type inference from schema
type BookingFormValues = z.infer<typeof bookingFormSchema>;

export function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      serviceType: undefined,
      notes: "",
    },
  });

  // Available time slots (9 AM to 5 PM, excluding lunch 12-1 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      if (hour === 12) continue; // Skip lunch hour

      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      const nextHour = `${(hour + 1).toString().padStart(2, "0")}:00`;

      slots.push({
        value: timeString,
        label: `${timeString} - ${nextHour}`,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert form data to booking format (Convex will handle userId)
      const bookingData = {
        serviceType: values.serviceType,
        date: Math.floor(values.date.getTime() / 1000), // Convert to timestamp for Convex
        time: values.time,
        notes: values.notes || undefined,
      };

      const bookingId = await createBooking(bookingData);

      toast({
        title: "Booking Confirmed!",
        description:
          "Your appointment has been successfully scheduled. You will receive a confirmation email shortly.",
      });

      // Redirect to booking confirmation page with booking ID
      router.push(`/booking/confirmation/${bookingId}`);
    } catch (error) {
      console.error("Booking submission error:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error scheduling your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedService = SERVICE_OPTIONS.find(
    (service) => service.value === form.watch("serviceType"),
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
        <p className="text-gray-600">Schedule your chiropractic care session with Dr. Tim Foo</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Selection */}
            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SERVICE_OPTIONS.map((service) => (
                        <SelectItem key={service.value} value={service.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{service.label}</span>
                            <span className="text-sm text-gray-500">
                              {service.duration} • {service.price}
                            </span>
                            <span className="text-xs text-gray-400">{service.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Preferred Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          // Disable past dates and Sundays
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today || date.getDay() === 0;
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Please select a date at least 24 hours in advance. We are closed on Sundays.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Selection */}
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Available from 9:00 AM - 5:00 PM (closed 12:00 PM - 1:00 PM for lunch)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific concerns or preferences..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Share any specific health concerns or preferences for your
                    appointment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Service Summary */}
            {selectedService && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Appointment Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Service:</strong> {selectedService.label}
                  </p>
                  <p>
                    <strong>Duration:</strong> {selectedService.duration}
                  </p>
                  <p>
                    <strong>Price:</strong> {selectedService.price}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Booking Appointment..." : "Book Appointment"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By booking this appointment, you agree to our cancellation policy (24-hour notice
              required).
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
