"use client";

import { useQuery } from "@tanstack/react-query";
import { PaketListesiDataTable } from "./paketlistesidatatable";
import { paketlistesicolumns } from "./paketlistesicolumns";
import axios from "axios";
import { toast } from "sonner";

export default function PaketListesi() {

 const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
  console.log("Kullanılan API URL:", apiUrl);

  const {
    data: paketData,
    isLoading,
    error,
    refetch: paketrefetch,
  } = useQuery({
    queryKey: ["paketler"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/paketler`);
        return response.data || [];
      } catch (error) {
        console.error("API Hatası:", error);
        throw error;
      }
    },
    // Sekme değişimlerinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnWindowFocus: false,
    // Ağ bağlantısı geri geldiğinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnReconnect: false,
  });

  if (isLoading) {
    return (
      <div className="h-full p-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full p-4">
        <div className="flex flex-col justify-center items-center h-32">
          <div className="text-red-500 mb-2">
            Veri yüklenirken bir hata oluştu
          </div>
          <button
            onClick={() => paketrefetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div className="h-full w-full p-1">
        {" "}
        <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-1 shadow-slate-300">
          <div className="py-2 pl-4 border-b bg-cyan-700 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Paket Listesi</h1>
            </div>{" "}
          </div>
          <div className="flex-1 min-h-0">
            <div className="h-full overflow-auto">
              <PaketListesiDataTable
                columns={paketlistesicolumns}
                data={paketData || []}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
