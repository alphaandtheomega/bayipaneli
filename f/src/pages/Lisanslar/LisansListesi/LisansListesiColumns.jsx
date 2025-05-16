"use client";

import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const columns = [
  {
    accessorKey: "lisans_kodu",
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
    size: 130,
    minSize: 110,
    maxSize: 170,
    cell: ({ row }) => {
      const value = row.getValue("lisans_kodu");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "musteri_adi",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Müşteri Adı</div>
    ),
    size: 100,
    minSize: 100,
    maxSize: 200,
    cell: ({ row }) => {
      const value = row.getValue("musteri_adi");
      return (
        <div
          className="truncate max-w-[200px] px-3 py-2 border-r border-gray-200"
          title={value}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "kullanici_sayisi",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Kullanıcı</div>
    ),
    size: 70,
    minSize: 70,
    maxSize: 100,
    cell: ({ row }) => {
      const value = row.getValue("kullanici_sayisi");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "bayi_adi",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Bayi Adı</div>
    ),
    size: 100,
    minSize: 100,
    maxSize: 200,
    cell: ({ row }) => {
      const value = row.getValue("bayi_adi");
      return (
        <div
          className="truncate max-w-[200px] px-3 py-2 border-r border-gray-200"
          title={value}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "paket_adi",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Paket Adı</div>
    ),
    size: 90,
    minSize: 90,
    maxSize: 120,
    cell: ({ row }) => {
      const value = row.getValue("paket_adi");
      return (
        <div
          className="truncate max-w-[120px] px-3 py-2 border-r border-gray-200"
          title={value}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "yetkili",
    header: () => <div className="text-center w-full py-2 my-1.5">Yetkili</div>,
    size: 100,
    minSize: 100,
    maxSize: 140,
    cell: ({ row }) => {
      const value = row.getValue("yetkili");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Oluşturulma Tarihi</div>
    ),
    size: 90,
    minSize: 90,
    maxSize:120,
    cell: ({ row }) => {
      const value = row.getValue("created_at");
      return (
        <div
          className="truncate max-w-[110px] px-3 py-2 border-r border-gray-200"
          title={value}
        >
          {value}
        </div>
      );
    },
  },  {
    accessorKey: "lisans_suresi",
    header: () => (
      <div className="text-center w-full py-2 my-1.5">Lisans Süresi (Gün)</div>
    ),
    size: 120,
    minSize: 120,
    maxSize: 140,
    cell: ({ row }) => {
      const value = row.getValue("lisans_suresi");
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    },
  },
  {
    // Use a derived accessor that doesn't conflict with original data fields
    accessorFn: (row) => {
      // Here we can calculate the remaining time based on creation date and lisans_suresi
      // This is just an example - adjust based on your actual data structure
      const lisansSuresi = row.lisans_suresi || 0;
      const creationDate = row.created_at ? new Date(row.created_at) : new Date();
      
      // Calculate days elapsed since creation
      const today = new Date();
      const daysSinceCreation = Math.floor((today - creationDate) / (1000 * 60 * 60 * 24));
      
      // Calculate remaining days
      const remainingDays = Math.max(0, lisansSuresi - daysSinceCreation);
      return remainingDays;
    },
    id: "kalan_sure", // Use id instead of accessorKey for derived accessors
    header: () => <div className="text-center w-full py-2">Kalan Süre (Gün)</div>,
    size: 120,
    minSize: 120,
    maxSize: 160,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <div className="text-center w-full px-3 py-2 border-r border-gray-200">
          {value}
        </div>
      );
    },
  },{
    accessorKey: "aktif",
    header: () => <div className="text-center w-full py-2">Aktif</div>,
    size: 130,
    minSize: 130,
    maxSize: 180,
    cell: ({ row, table }) => {
      const initialValue = row.getValue("aktif");
      const [isChecked, setIsChecked] = useState(initialValue);
      const queryClient = useQueryClient();
        // Toggle mutation tanımlama
      const toggleAktifMutation = useMutation({
        mutationFn: async (newValue) => {
          const response = await axios.put(`http://localhost:3001/api/lisanslar/${row.original.id}/toggle-aktif`, {
            aktif: newValue
          });
          return response.data;
        },
        onSuccess: () => {
          // Başarıyla güncellendiğinde cache'i yenile
          queryClient.invalidateQueries({ queryKey: ['filteredLisanslar'] });
          console.log(`Lisans ${row.original.id} aktif durumu başarıyla değiştirildi: ${!isChecked}`);
        },
        onError: (error) => {
          // Hata durumunda UI'ı geri al
          setIsChecked(isChecked);
          console.error("Aktif durumu değiştirilemedi:", error);
        }
      });
      
      const handleToggleAktif = async () => {
        try {
          // Önce UI'ı güncelle
          const newValue = !isChecked;
          setIsChecked(newValue);
          
          // Mutasyonu çağır
          toggleAktifMutation.mutate(newValue);
        } catch (error) {
          console.error("Aktif durumu değiştirilemedi:", error);
          // Hata durumunda UI'ı geri al
          setIsChecked(isChecked);
        }
      };
        return (
        <div className="flex items-center justify-center w-full px-3 py-2 border-r border-gray-200">
          <div className="flex items-center gap-2">
            <Switch 
              checked={isChecked} 
              onCheckedChange={handleToggleAktif}
              className={isChecked 
                ? "data-[state=checked]:bg-teal-500 data-[state=checked]:text-green-50" 
                : "data-[state=unchecked]:bg-slate-300 data-[state=unchecked]:text-red-50"}
            />
          </div>
        </div>
      );
    },
  },  {
    accessorKey: "kilit",
    header: () => <div className="text-center w-full py-2">Kilit</div>,
    size: 130,
    minSize: 130,
    maxSize: 180,
    cell: ({ row, table }) => {
      const initialValue = row.getValue("kilit");
      const [isChecked, setIsChecked] = useState(initialValue);
      const queryClient = useQueryClient();
        // Toggle mutation tanımlama
      const toggleKilitMutation = useMutation({
        mutationFn: async (newValue) => {
          const response = await axios.put(`http://localhost:3001/api/lisanslar/${row.original.id}/toggle-kilit`, {
            kilit: newValue
          });
          return response.data;
        },
        onSuccess: () => {
          // Başarıyla güncellendiğinde cache'i yenile
          queryClient.invalidateQueries({ queryKey: ['filteredLisanslar'] });
          console.log(`Lisans ${row.original.id} kilit durumu başarıyla değiştirildi: ${!isChecked}`);
        },
        onError: (error) => {
          // Hata durumunda UI'ı geri al
          setIsChecked(isChecked);
          console.error("Kilit durumu değiştirilemedi:", error);
        }
      });
      
      const handleToggleKilit = async () => {
        try {
          // Önce UI'ı güncelle
          const newValue = !isChecked;
          setIsChecked(newValue);
          
          // Mutasyonu çağır
          toggleKilitMutation.mutate(newValue);
        } catch (error) {
          console.error("Kilit durumu değiştirilemedi:", error);
          // Hata durumunda UI'ı geri al
          setIsChecked(isChecked);
        }
      };
        return (
        <div className="flex items-center justify-center w-full px-3 py-2">
          <div className="flex items-center gap-2">
           
            <Switch 
              checked={isChecked} 
              onCheckedChange={handleToggleKilit}
              className={isChecked 
                ? "data-[state=checked]:bg-red-400 data-[state=checked]:text-green-50" 
                : "data-[state=unchecked]:bg-slate-300 data-[state=unchecked]:text-red-50"}
            />
          </div>
        </div>
      );
    },
  },
];
