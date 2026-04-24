import { useCallback, useEffect, useState } from "react";
import { Visit } from "@/types/visit";

const STORAGE_KEY = "eduvisitas:visits";

const seedVisits = (): Visit[] => {
  const today = new Date();
  const mk = (h: number, m: number) => {
    const d = new Date(today);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  return [
    {
      id: crypto.randomUUID(),
      fullName: "María Fernández López",
      dni: "45821093",
      reason: "Reunión con tutor",
      visiting: "Prof. Carlos Ramírez",
      createdAt: mk(8, 15),
    },
    {
      id: crypto.randomUUID(),
      fullName: "Jorge Quispe Mamani",
      dni: "70239841",
      reason: "Entrega de documentos",
      visiting: "Dirección Académica",
      createdAt: mk(9, 42),
    },
    {
      id: crypto.randomUUID(),
      fullName: "Ana Lucía Torres",
      dni: "48119273",
      reason: "Cita psicopedagógica",
      visiting: "Lic. Patricia Vega",
      createdAt: mk(11, 5),
    },
  ];
};

export function useVisits() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setVisits(JSON.parse(raw));
      } else {
        const seed = seedVisits();
        setVisits(seed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      }
    } catch {
      setVisits([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
    }
  }, [visits, loaded]);

  const addVisit = useCallback((data: Omit<Visit, "id" | "createdAt">) => {
    const newVisit: Visit = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setVisits((prev) => [newVisit, ...prev]);
    return newVisit;
  }, []);

  const removeVisit = useCallback((id: string) => {
    setVisits((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const getVisit = useCallback(
    (id: string) => visits.find((v) => v.id === id),
    [visits]
  );

  return { visits, addVisit, removeVisit, getVisit, loaded };
}
