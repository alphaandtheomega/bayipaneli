"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
    minSize: 60,
    maxSize: 80
  },
  {
    accessorKey: "lisans_kodu",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lisans Kodu
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 110,
    minSize: 110,
    maxSize: 130
  },

  {
    accessorKey: "musteri_adi",
    header: "Müşteri Adı",
    size: 100,
    minSize: 100,
    maxSize: 120
  },
{
    accessorKey: "kullanici_sayisi",
    header: "Kullanıcı Sayısı",
    size: 130,
    minSize: 130,
    maxSize: 180
  },
 
  
  {
    accessorKey: "bayi_adi",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Bayi Adı     
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 110,
    minSize: 110,
    maxSize: 140
  },
  {
    accessorKey: "paket_adi",
    header: "Paket",
    size: 90,
    minSize: 90,
    maxSize: 120
  },
  {
    accessorKey: "yetkili",
    header: "Yetkili",
    size: 100,
    minSize: 100,
    maxSize: 140
  },
  
  {
    accessorKey: "created_at",
    header: "Oluşturulma Tarihi",
    size: 130,
    minSize: 130,
    maxSize: 180
  },
  {
    accessorKey: "lisans_suresi",
    header: "Lisans Süresi",
    size: 120,
    minSize: 120,
    maxSize: 140,
    
  },
    {
    accessorKey: "lisans_suresi",
    header: "Kalan Süre",
    size: 120,
    minSize: 120,
    maxSize: 160
  },
  {
    accessorKey: "aktif",
    header: "Aktif",
    size: 130,
    minSize: 130,
    maxSize: 180
  },
  {
    accessorKey: "kilit",
    header: "Kilit",
    size: 130,
    minSize: 130,
    maxSize: 180
  }
];
