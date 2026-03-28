"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import EventDetails from "@/components/EventDetails";
import RegistrationForm, { RegistrationData } from "@/components/RegistrationForm";
import TicketSection from "@/components/Ticket";
import Footer from "@/components/Footer";

export default function Home() {
  const [registration, setRegistration] = useState<RegistrationData | null>(null);

  const handleRegistration = (data: RegistrationData) => {
    setRegistration(data);
    setTimeout(() => {
      document.getElementById("ticketSection")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      {!registration && (
        <>
          <Hero />
          <EventDetails />
          <RegistrationForm onSubmit={handleRegistration} />
        </>
      )}

      {registration && <TicketSection data={registration} />}

      <Footer />
    </>
  );
}
