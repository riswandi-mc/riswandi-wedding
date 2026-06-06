"use client";

import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Clock, MapPin, User, MessageCircle } from "lucide-react";

type CalendarEvent = {
  id: string;
  client: string;
  service: string;
  time: string;
  location: string;
  phone: string;
};

type EventsMap = {
  [day: number]: CalendarEvent[];
};

// Mock events for June 2026
const mockEvents: EventsMap = {
  5: [
    { id: "1", client: "Aria & Sarah", service: "MC Wedding Private", time: "08:00 - 13:00", location: "Kramat Jati, Jakarta Timur", phone: "6281234567891" }
  ],
  12: [
    { id: "2", client: "Budi & Rina", service: "MC Wedding Partner", time: "11:00 - 16:00", location: "Gedung Manggala Wanabakti, Jkt", phone: "6281234567892" }
  ],
  18: [
    { id: "3", client: "PT. Krakatau Steel", service: "MC All Event", time: "13:00 - 18:00", location: "Balai Kartini, Jakarta", phone: "6281234567893" }
  ],
  26: [
    { id: "4", client: "Sarah & Dimas", service: "MC Wedding Partner", time: "09:00 - 14:00", location: "Hotel Santika, Bekasi", phone: "6281234567894" }
  ]
};

export default function CalendarPage() {
  const [currentDate] = useState(new Date(2026, 5, 1)); // Fixed mock to June 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(12); // Default selected June 12

  // Month stats calculation
  const totalDays = 30; // June has 30 days
  const startDayOffset = 1; // June 1st 2026 falls on a Monday (offset = 1)

  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const emptyOffsetCells = Array.from({ length: startDayOffset }, (_, i) => i);

  const selectedDayEvents = selectedDay ? mockEvents[selectedDay] || [] : [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Kalender Acara</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 bg-muted/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold font-heading text-primary">Jadwal Kalender MC</h1>
            <p className="text-muted-foreground text-sm font-sans">Pantau agenda acara MC terjadwal dan slot tanggal kosong yang terisi booking.</p>
          </div>
          <Button size="sm" className="shadow-sm gap-2" asChild>
            <a href="/dashboard/booking-mc">
              <Plus className="w-4 h-4" /> Booking Jadwal Baru
            </a>
          </Button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Box */}
          <Card className="lg:col-span-2 shadow-sm bg-background">
            <CardHeader className="flex flex-row justify-between items-center pb-4 border-b">
              <div>
                <CardTitle className="text-lg font-heading">Juni 2026</CardTitle>
                <CardDescription>Kalender Jadwal Acara Aktif</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 font-sans">
              {/* Day Titles */}
              <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground mb-4">
                <span>Sen</span>
                <span>Sel</span>
                <span>Rab</span>
                <span>Kam</span>
                <span>Jum</span>
                <span>Sab</span>
                <span>Min</span>
              </div>

              {/* Grid Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Offset blanks */}
                {emptyOffsetCells.map((_, idx) => (
                  <div key={`offset-${idx}`} className="aspect-square bg-muted/20 rounded-lg border border-transparent" />
                ))}

                {/* Actual Days */}
                {daysArray.map((day) => {
                  const hasEvents = !!mockEvents[day];
                  const isSelected = selectedDay === day;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`aspect-square relative flex flex-col justify-between p-2 rounded-lg border text-left transition-all hover:bg-muted/10 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                          : hasEvents
                          ? "border-emerald-200 bg-emerald-50/30 text-emerald-800"
                          : "border-border bg-background"
                      }`}
                    >
                      <span className="text-xs font-bold">{day}</span>
                      {hasEvents && (
                        <div className="flex gap-1 items-center justify-end w-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-bold text-emerald-700 hidden sm:inline">
                            {mockEvents[day].length} MC
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Day Detail Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-sm flex flex-col h-full bg-background border">
              <CardHeader className="border-b pb-4">
                <CardTitle className="text-base font-heading flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" /> Detail Tanggal
                </CardTitle>
                <CardDescription>
                  Agenda Hari: {selectedDay ? `${selectedDay} Juni 2026` : "Pilih tanggal"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4 pt-6 font-sans">
                {selectedDayEvents.length > 0 ? (
                  selectedDayEvents.map((evt) => (
                    <div key={evt.id} className="p-4 rounded-xl border bg-muted/10 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm text-foreground">{evt.client}</p>
                          <Badge variant="outline" className="text-[10px] py-0 px-2 font-normal mt-1">{evt.service}</Badge>
                        </div>
                        <Button size="icon-sm" variant="ghost" asChild>
                          <a href={`https://wa.me/${evt.phone}?text=Halo%20Kak%20${evt.client}!`} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="w-4 h-4 text-emerald-500" />
                          </a>
                        </Button>
                      </div>

                      <div className="space-y-1.5 text-xs text-muted-foreground border-t pt-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{evt.time}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span className="leading-relaxed">{evt.location}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 text-muted-foreground space-y-2">
                    <CalendarDays className="w-8 h-8 text-muted-foreground/50" />
                    <div>
                      <p className="font-semibold text-xs text-foreground">Tidak Ada Jadwal Acara</p>
                      <p className="text-[10px]">Tanggal ini kosong dari booking, slot waktu tersedia untuk dipesan.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
