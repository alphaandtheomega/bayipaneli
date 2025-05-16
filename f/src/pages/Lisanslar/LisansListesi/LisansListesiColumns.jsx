"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns = [    {    accessorKey: "lisans_kodu",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="w-full justify-center py-2"
      >
        Lisans Kodu
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    size: 110,
    minSize: 110,
    maxSize: 130,
    cell: ({ row }) => {
      const value = row.getValue("lisans_kodu");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    }
  },  {
    accessorKey: "musteri_adi",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Müşteri Adı</div>
    ),
    size: 100,
    minSize: 100,
    maxSize: 200,    cell: ({ row }) => {
      const value = row.getValue("musteri_adi");
      return (
        <div className="truncate max-w-[200px] px-3 py-2 border-r border-gray-200" title={value}>
          {value}
        </div>
      );
    }
  },
{
    accessorKey: "kullanici_sayisi",    header: () => (
      <div className="text-center w-full py-2 my-1.5">Kullanıcı</div>
    ),
    size: 70,
    minSize: 70,
    maxSize: 100,    cell: ({ row }) => {
      const value = row.getValue("kullanici_sayisi");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    }  },    {    accessorKey: "bayi_adi",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Bayi Adı</div>
    ),
    size: 100,
    minSize: 100,
    maxSize: 200,    cell: ({ row }) => {
      const value = row.getValue("bayi_adi");
      return (
        <div className="truncate max-w-[200px] px-3 py-2 border-r border-gray-200" title={value}>
          {value}
        </div>
      );
    }
  },  {
    accessorKey: "paket_adi",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Paket Adı</div>
    ),
    size: 90,
    minSize: 90,
    maxSize: 120,    cell: ({ row }) => {
      const value = row.getValue("paket_adi");
      return (
        <div className="truncate max-w-[120px] px-3 py-2 border-r border-gray-200" title={value}>
          {value}
        </div>
      );
    }
  },{
    accessorKey: "yetkili",    header: () => (
      <div className="text-center w-full py-2 my-1.5">Yetkili</div>
    ),
    size: 100,
    minSize: 100,
    maxSize: 140,    cell: ({ row }) => {
      const value = row.getValue("yetkili");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    }
  },    {
    accessorKey: "created_at",    header: () => (
      <div className="text-center w-full py-2 my-1.5">Oluşturulma Tarihi</div>
    ),
    size: 130,
    minSize: 130,
    maxSize: 180,    cell: ({ row }) => {
      const value = row.getValue("created_at");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    }
  },{
    accessorKey: "lisans_suresi",    header: () => (
      <div className="text-center w-full py-2 my-1.5">Lisans Süresi</div>
    ),    size: 120,
    minSize: 120,
    maxSize: 140,
    cell: ({ row }) => {
      const value = row.getValue("lisans_suresi");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    }
    
  },    {
    accessorKey: "lisans_suresi",    header: () => (
      <div className="text-center w-full py-2">Kalan Süre</div>
    ),    size: 120,
    minSize: 120,
    maxSize: 160,
    cell: ({ row }) => {
      const value = row.getValue("lisans_suresi");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    }
  },  {
    accessorKey: "aktif",    header: () => (
      <div className="text-center w-full py-2">Aktif</div>
    ),
    size: 130,
    minSize: 130,
    maxSize: 180,    cell: ({ row }) => {
      const value = row.getValue("aktif");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {String(value)}
        </div>
      );
    }
  },  {
    accessorKey: "kilit",    header: () => (
      <div className="text-center w-full py-2">Kilit</div>
    ),
    size: 130,
    minSize: 130,
    maxSize: 180,    cell: ({ row }) => {
      const value = row.getValue("kilit");
      return (
        <div className="text-center w-full px-3 py-2">
          {String(value)}
        </div>
      );
    }
  }
];
