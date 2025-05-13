import React from 'react'
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function PaketDuzenle() {
 const { id } = useParams();
   const navigate = useNavigate();
   const queryClient = useQueryClient();

const {
    data: paketIdData,
    isLoading,
    error,
    refetch: paketIdrefetch
  } = useQuery({
    queryKey: ["paketler", id], // ID'yi queryKey'e ekleyin
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/paketler/${id}`
        );
        console.log("Paket verileri:", response.data);
        // API yanıtını detaylı incelemek için
        if (response.data && response.data.length > 0) {
          console.log("Paket detayları:", response.data[0]);
          console.log("Paket modül yapısı:", response.data[0].moduller || "moduller alanı bulunamadı");
        }
        return response.data || [];
        
      } catch (error) {
        console.error("API Hatası:", error);
        if (error.response) {
          console.error("Sunucu yanıtı:", error.response.data);
        }
        throw error;
      }
    },
    // Sekme değişimlerinde otomatik yeniden çekmeyi devre dışı bırak
    enabled: !!id,
    refetchOnWindowFocus: false,
    // Ağ bağlantısı geri geldiğinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnReconnect: false,
  });

  // Show loading state while data is being fetched
  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  // Show error state if there was an error
  if (error) {
    return <div>Hata oluştu: {error.message}</div>;
  }

  // Check if data exists and has items before rendering
  if (!paketIdData || paketIdData.length === 0) {
    return <div>Paket bulunamadı</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Paket Detayları</h2>
        <div className="grid gap-2">
          <div><Label>Paket Kodu:</Label> {paketIdData[0].paket_kodu}</div>
          <div><Label>Paket Adı:</Label> {paketIdData[0].paket_adi}</div>
          <div><Label>Açıklama:</Label> {paketIdData[0].paket_aciklama}</div>
        </div>
      </div>

      <Separator className="my-4" />      <div>
        <h3 className="text-xl font-bold mb-2">Paket Modülleri</h3>
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Bu pakete ait modüller</span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              console.log("Modül ekle tıklandı", paketIdData[0]);
              // Modül ekleme modalını burada açabilirsiniz
            }}
          >
            Modül Ekle
          </Button>
        </div>
        <div className="grid gap-2">
          {paketIdData[0].moduller ? 
            paketIdData[0].moduller.map((modul, index) => (
              <div key={index} className="p-2 border rounded flex justify-between items-center">
                <div>{modul.modul_adi}</div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => console.log("Modülü düzenle", modul)}
                >
                  ✏️
                </Button>
              </div>
            )) : 
            <div className="p-2 border rounded bg-gray-100">
              Bu pakete henüz modül eklenmemiş
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default PaketDuzenle