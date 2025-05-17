"use client";

import { useState, useEffect } from "react";
import * as React from "react"; // React import eklendi
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // React Query eklendi
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Label } from "@radix-ui/react-label";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const iller = [
  {
    value: "Adana",
    label: "Adana",
  },
  {
    value: "Adıyaman",
    label: "Adıyaman",
  },
  {
    value: "Afyonkarahisar",
    label: "Afyonkarahisar",
  },
  {
    value: "Ağrı",
    label: "Ağrı",
  },
  {
    value: "Amasya",
    label: "Amasya",
  },
  {
    value: "Ankara",
    label: "Ankara",
  },
  {
    value: "Antalya",
    label: "Antalya",
  },
  {
    value: "Artvin",
    label: "Artvin",
  },
  {
    value: "Aydın",
    label: "Aydın",
  },
  {
    value: "Balıkesir",
    label: "Balıkesir",
  },
  {
    value: "Bilecik",
    label: "Bilecik",
  },
  {
    value: "Bingöl",
    label: "Bingöl",
  },
  {
    value: "Bitlis",
    label: "Bitlis",
  },
  {
    value: "Bolu",
    label: "Bolu",
  },
  {
    value: "Burdur",
    label: "Burdur",
  },
  {
    value: "Bursa",
    label: "Bursa",
  },
  {
    value: "Çanakkale",
    label: "Çanakkale",
  },
  {
    value: "Çankırı",
    label: "Çankırı",
  },
  {
    value: "Çorum",
    label: "Çorum",
  },
  {
    value: "Denizli",
    label: "Denizli",
  },
  {
    value: "Diyarbakır",
    label: "Diyarbakır",
  },
  {
    value: "Edirne",
    label: "Edirne",
  },
  {
    value: "Elazığ",
    label: "Elazığ",
  },
  {
    value: "Erzincan",
    label: "Erzincan",
  },
  {
    value: "Erzurum",
    label: "Erzurum",
  },
  {
    value: "Eskişehir",
    label: "Eskişehir",
  },
  {
    value: "Gaziantep",
    label: "Gaziantep",
  },
  {
    value: "Giresun",
    label: "Giresun",
  },
  {
    value: "Gümüşhane",
    label: "Gümüşhane",
  },
  {
    value: "Hakkari",
    label: "Hakkari",
  },
  {
    value: "Hatay",
    label: "Hatay",
  },
  {
    value: "Isparta",
    label: "Isparta",
  },
  {
    value: "Mersin",
    label: "Mersin",
  },
  {
    value: "İstanbul",
    label: "İstanbul",
  },
  {
    value: "İzmir",
    label: "İzmir",
  },
  {
    value: "Kars",
    label: "Kars",
  },
  {
    value: "Kastamonu",
    label: "Kastamonu",
  },
  {
    value: "Kayseri",
    label: "Kayseri",
  },
  {
    value: "Kırklareli",
    label: "Kırklareli",
  },
  {
    value: "Kırşehir",
    label: "Kırşehir",
  },
  {
    value: "Kocaeli",
    label: "Kocaeli",
  },
  {
    value: "Konya",
    label: "Konya",
  },
  {
    value: "Kütahya",
    label: "Kütahya",
  },
  {
    value: "Malatya",
    label: "Malatya",
  },
  {
    value: "Manisa",
    label: "Manisa",
  },
  {
    value: "Kahramanmaraş",
    label: "Kahramanmaraş",
  },
  {
    value: "Mardin",
    label: "Mardin",
  },
  {
    value: "Muğla",
    label: "Muğla",
  },
  {
    value: "Muş",
    label: "Muş",
  },
  {
    value: "Nevşehir",
    label: "Nevşehir",
  },
  {
    value: "Niğde",
    label: "Niğde",
  },
  {
    value: "Ordu",
    label: "Ordu",
  },
  {
    value: "Rize",
    label: "Rize",
  },
  {
    value: "Sakarya",
    label: "Sakarya",
  },
  {
    value: "Samsun",
    label: "Samsun",
  },
  {
    value: "Siirt",
    label: "Siirt",
  },
  {
    value: "Sinop",
    label: "Sinop",
  },
  {
    value: "Sivas",
    label: "Sivas",
  },
  {
    value: "Tekirdağ",
    label: "Tekirdağ",
  },
  {
    value: "Tokat",
    label: "Tokat",
  },
  {
    value: "Trabzon",
    label: "Trabzon",
  },
  {
    value: "Tunceli",
    label: "Tunceli",
  },
  {
    value: "Şanlıurfa",
    label: "Şanlıurfa",
  },
  {
    value: "Uşak",
    label: "Uşak",
  },
  {
    value: "Van",
    label: "Van",
  },
  {
    value: "Yozgat",
    label: "Yozgat",
  },
  {
    value: "Zonguldak",
    label: "Zonguldak",
  },
  {
    value: "Aksaray",
    label: "Aksaray",
  },
  {
    value: "Bayburt",
    label: "Bayburt",
  },
  {
    value: "Karaman",
    label: "Karaman",
  },
  {
    value: "Kırıkkale",
    label: "Kırıkkale",
  },
  {
    value: "Batman",
    label: "Batman",
  },
  {
    value: "Şırnak",
    label: "Şırnak",
  },
  {
    value: "Bartın",
    label: "Bartın",
  },
  {
    value: "Ardahan",
    label: "Ardahan",
  },
  {
    value: "Iğdır",
    label: "Iğdır",
  },
  {
    value: "Yalova",
    label: "Yalova",
  },
  {
    value: "Karabük",
    label: "Karabük",
  },
  {
    value: "Kilis",
    label: "Kilis",
  },
  {
    value: "Osmaniye",
    label: "Osmaniye",
  },
  {
    value: "Düzce",
    label: "Düzce",
  },
];

export function LisansListesiDataTable({ columns, data, refetch }) {
  const [error, setError] = useState(null);
  const [filterParams, setFilterParams] = useState({}); // Filtreleme parametrelerini saklayacak state
  const [selectedIl, setSelectedIl] = React.useState("");
  const [openIller, setOpenIller] = React.useState(false);
  const queryClient = useQueryClient(); // QueryClient'ı al
  const form = useForm({
    defaultValues: {
      lisans_arama: "",
      musteri_arama: "",
      bayi_arama: "",
      paket_arama: "",
      yetkili_arama: "",
      il: "",
      aktiflik_durumu_arama: "",
      lisans_tipi_arama: "",
    },
  });
  const navigate = useNavigate(); // Hook fonksiyon içine taşındı
  const { id } = useParams(); // URL'den id parametresini al
  const [filtering, setFiltering] = useState(""); // Ana bayiler verisi değiştiğinde filtrelenmiş verileri güncelle
  // Bu sayede başka bir sayfada bayiler güncellendiğinde bu liste de güncellenecek
  React.useEffect(() => {
    // data prop'u değiştiğinde ve içeriği varsa, ana veriyi direkt kullan (API isteği yapmadan)
    if (data?.length > 0) {
      console.log(
        "Data prop'u değişti, filtrelemesiz tablo verilerini güncelliyorum"
      );

      // Tablo verisi için direkt olarak data prop'unu kullan
      // Sadece filtre yoksa veriyi güncelle
      if (!Object.values(filterParams).some((val) => val && val !== "")) {
        // Tüm bayiler/filtre querylerini bul ve güncelle
        const queriesInCache = queryClient.getQueriesData({
          queryKey: ["filteredLisanslar"],
        });

        // Her bir query için cache'i güncelle
        queriesInCache.forEach(([queryKey]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    }
  }, [data, queryClient, filterParams]); // <-- added filterParams to dependencies for correctness

  const {
    data: filteredData,
    isLoading,
    isRefetching,
    refetch: refetchFiltered, // Filtrelemeyi tetiklemek için refetch fonksiyonunu alıyoruz
  } = useQuery({
    queryKey: ["filteredLisanslar", filterParams], // filterParams değiştiğinde yeniden sorgu yapılacak
    queryFn: async () => {
      try {
        // Filtreleme parametreleri varsa onları kullan, yoksa tüm verileri getir
        const hasFilters = Object.keys(filterParams).length > 0;

        if (hasFilters) {
          // Boş olmayan parametreleri URL'ye ekle
          const queryParams = new URLSearchParams(); // <-- semicolon added here
          // Form field adlarını API adlarına çeviriyoruz - adlandırma kurallarını düzeltiyoruz
          Object.entries(filterParams).forEach(([key, value]) => {
            if (value && value !== "") {
              // Arama alanlarını API parametrelerine çeviriyoruz
              let apiParam;

              // Her bir arama alanı için doğru API parametresi adını belirliyoruz
              switch (key) {
                case "lisans_arama":
                  apiParam = "lisans";
                  break;
                case "musteri_arama":
                  apiParam = "musteri";
                  break;
                case "bayi_arama":
                  apiParam = "bayi";
                  break;
                case "paket_arama":
                  apiParam = "paket";
                  break; // İl filtrelemesi için müşteri tablosunda il alanı kullanılır
                case "il":
                  apiParam = "il";
                  break;
                  case "yetkili_arama":
                  apiParam = "yetkili";
                  break;
                case "aktiflik_durumu_arama":
                  apiParam = "aktiflik_durumu";
                  break;
                case "lisans_tipi_arama":
                  apiParam = "lisans_tipi";
                  break;
                default:
                  apiParam = key;
              }

              console.log(`API parametresi: ${apiParam} = ${value}`);
              queryParams.append(apiParam, value);
            }
          });
          setError(null); // Her yeni istek başlangıcında error durumunu sıfırla
          console.log("Filtreleme isteği yapılıyor:", queryParams.toString());
          const apiUrl = `http://localhost:3001/api/lisans/filter?${queryParams.toString()}`;
          console.log(`Filtreleme URL: ${apiUrl}`);

          try {
            // Önbelleği devre dışı bırakmak için zaman damgası ekleyebiliriz
            const timestamp = new Date().getTime();
            const cacheBusterUrl = `${apiUrl}${
              apiUrl.includes("?") ? "&" : "?"
            }_t=${timestamp}`;
            const response = await axios.get(cacheBusterUrl);
            console.log(
              "API yanıtı alındı, kayıt sayısı:",
              response.data?.length
            );
            console.log("İlk kayıtlar:", response.data?.slice(0, 2));
            // Kullanıcıya sonucu bildir
            if (response.data.length === 0) {
              toast.info("Filtreleme sonucu", {
                description: "Arama kriterlerine uygun kayıt bulunamadı.",
              });
            } else {
              toast.success("Filtreleme sonucu", {
                description: `${response.data.length} kayıt bulundu.`,
              });
            }
            return response.data;
          } catch (error) {
            console.error("Filtreleme sırasında hata oluştu:", error);
            const errorMessage =
              error.response?.data?.message ||
              error.message ||
              "Bilinmeyen bir hata oluştu";
            // İl filtrelemesi ile ilgili özel hata mesajı
            if (queryParams.has("il") && error.response?.status === 500) {
              setError(
                "İl filtresi kullanılırken bir hata oluştu. Bu filtreleme müşteri veritabanı ile JOIN işlemi gerçekleştiriyor."
              );
              toast.error("İl filtreleme hatası", {
                description:
                  "İl filtrelemesi sırasında bir sorun oluştu. Lütfen tekrar deneyin.",
              });
            } else {
              setError(`Filtreleme hatası: ${errorMessage}`);
              toast.error("Filtreleme hatası", {
                description: errorMessage,
              });
            }
            throw error;
          }
        } else {
          // Eğer filtreleme parametresi yoksa ve parent'tan gelen data varsa, onu kullan
          // Gereksiz API çağrısı yapma
          if (data) {
            console.log(
              "Filtresiz verileri data prop'undan kullanıyorum - API çağrısı yok"
            );
            return data; // Direkt olarak parent'tan gelen veriyi döndür
          }
          // Bu duruma pek düşülmemeli - veri yoksa ve filtre yoksa
          console.log(
            "API'dan tüm verileri getiriyorum - Bu normalde olmamalı"
          );
          const response = await axios.get("http://localhost:3001/api/lisans");
          return response.data;
        }
      } catch (error) {
        console.error("Veri çekme hatası:", error);

        // Hata mesajını daha açıklayıcı yap
        let errorMessage = "Veriler çekilirken bir hata oluştu.";

        if (error.response) {
          // Sunucudan gelen hata yanıtı
          if (error.response.status === 404) {
            errorMessage =
              "API endpoint bulunamadı. Sunucunun çalıştığından ve bu endpoint'in tanımlı olduğundan emin olun.";
            console.error("API endpoint bulunamadı:", error.config.url);
          } else {
            errorMessage = `Sunucu hatası: ${error.response.status} - ${error.response.statusText}`;
          }
        } else if (error.request) {
          // İstek yapıldı ama yanıt alınamadı
          errorMessage =
            "Sunucuya bağlanılamadı. Sunucunun çalıştığından emin olun.";
        }

        setError(errorMessage);

        toast.error("Veri çekme hatası", {
          description: error.response?.data?.message || errorMessage,
        });

        // Opsiyonel olarak, hata sonrası filtreleme parametrelerini temizleyebilirsiniz
        // setFilterParams({});

        throw error;
      }
    },
    enabled: Object.keys(filterParams).length > 0,
    initialData: data,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
  // Form gönderildiğinde çalışacak fonksiyon
  function onSubmit(values) {
    console.log("Form Verileri:", values);

    // Filtreleme parametreleri var mı kontrol et - her bir değeri ayrı ayrı kontrol ediyoruz
    const hasFilters = Object.entries(values).some(
      ([_, val]) => val !== null && val !== undefined && val !== ""
    );

    if (hasFilters) {
      // Filtreleme parametreleri varsa, bunlarla filtreleme yap
      console.log("Filtre parametreleri var, filtreleme sorgusu yapılacak");

      // Boş olmayan değerleri içeren bir nesne oluştur - API'ye gönderilecek formatta
      const filteredValues = {};

      // Her bir form alanı için API'ye gönderilecek parametreleri hazırla
      Object.entries(values).forEach(([key, value]) => {
        // Null, undefined veya boş string kontrolü
        if (value !== null && value !== undefined && value !== "") {
          // API için doğru parametre adını kullanıyoruz - bu kritik
          filteredValues[key] = value;
        }
      });

      console.log("Filtrelenecek değerler:", filteredValues);

      // FilterParams state'ini güncelle
      setFilterParams(filteredValues);

      // Açıkça sorguyu yeniden çalıştır (önbellekten kaçınmak için)
      setTimeout(() => {
        refetchFiltered().then(() => {
          console.log("Filtreleme sorgusu yeniden çalıştırıldı");
        });
      }, 100);

      // Arama yapıldığını kullanıcıya bildir
      toast.info("Arama yapılıyor", {
        description: "Arama kriterlerine göre sonuçlar getiriliyor...",
      });
    } else {
      // Filtre yoksa, filterParams'ı sıfırla ve mevcut verileri göster
      console.log("Filtre parametreleri yok, tüm verileri göster");
      setFilterParams({});

      // Mevcut verileri direkt kullan
      if (data) {
        // Boş filtreyle olan sorgu için veriyi güncelle
        queryClient.setQueryData(["filteredLisanslar", {}], data);
        console.log("Tüm veriler gösteriliyor - filtre temizlendi");
      }
    }
  }

  // Herhangi bir işlem yapıldığında verileri yenilemek için kullanılabilecek fonksiyon
  const refreshData = () => {
    console.log("Yenileme butonu tıklandı"); // Form'u sıfırla
    form.reset({
      lisans_arama: "",
      musteri_arama: "",
      bayi_arama: "",
      paket_arama: "",
      il: "",
      aktiflik_durumu_arama: "",
      lisans_tipi_arama: "",
    });

    // Filtreleri temizle
    setFilterParams({});

    // Önbelleği temizle ve veriyi ana kaynaktan yenile
    queryClient.removeQueries(["filteredLisanslar"]);

    // Ana listeyi yenile (Bu tek API isteği yapacak)
    refetch().then((result) => {
      if (result.data) {
        // Yeni veri geldiğinde filtresiz sorguya kaydet
        queryClient.setQueryData(["filteredLisanslar", {}], result.data);

        toast.success("Veriler güncellendi", {
          description: `${result.data.length} kayıt başarıyla yenilendi.`,
        });
      }
    });
  };

  // Paketleri backend'den çeken query
  const { data: paketler, isLoading: paketlerYukleniyor } = useQuery({
    queryKey: ["paketler"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/paketler");
        return response.data;
      } catch (error) {
        console.error("Paket verileri çekilemedi:", error);
        toast.error("Paket verileri yüklenemedi", {
          description: "Paket listesi alınırken bir hata oluştu.",
        });
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 dakika
    cacheTime: 10 * 60 * 1000, // 10 dakika
  });
  // Filtreleme durumunu göstermek için state
  const [isFiltering, setIsFiltering] = useState(false);

  // Filtreleme işlemi sırasında ve sonrasında UI göstergeleri
  React.useEffect(() => {
    if (isRefetching) {
      setIsFiltering(true);
    } else {
      setIsFiltering(false);
    }
  }, [isRefetching]);

  // Table yapılandırması
  const table = useReactTable({
    data: filteredData || [], // NULL güvenliği eklendi
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  //aktif pasif durumu değiştirme api

  return (
    <div className="h-full flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white p-0   max-h-[calc(100vh-120px)] overflow-y-auto shadow-slate-300  "
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-3 pb-2">
            <FormField
              control={form.control}
              name="lisans_arama"
              render={({ field }) => (
                <FormItem className="space-y-1 ">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Lisans Kodu
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Lisans kodu ile ara"
                      className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="musteri_arama"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Müşteri Ünvanı
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Müşteri ünvanı ile ara"
                      className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bayi_arama"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m ">
                    Bayi Ünvanı
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Bayi ünvanı ile ara"
                      className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paket_arama"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Paket
                  </FormLabel>{" "}
                  <FormControl>
                    <Select
                      className="w-[180px] max-h-60 overflow-auto"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      {...field}
                    >
                      <SelectTrigger className="bg-white   h-8 text-m shadow-sm shadow-blue-200">
                        <SelectValue placeholder="Paket seçin veya arayın" />
                      </SelectTrigger>{" "}
                      <SelectContent>
                        {paketlerYukleniyor ? (
                          <SelectItem value="loading" disabled>
                            Yükleniyor...
                          </SelectItem>
                        ) : paketler && paketler.length > 0 ? (
                          paketler.map((paket) => (
                            <SelectItem
                              key={paket.id}
                              value={paket.paket_adi.toString()}
                            >
                              {paket.paket_adi}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-data" disabled>
                            Paket bulunamadı
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="yetkili_arama"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Yetkili
                  </FormLabel>{" "}
                  <FormControl>
                    <Select
                      className="w-[180px] max-h-60 overflow-auto"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      {...field}
                    >
                      <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200">
                        <SelectValue placeholder="Yetkili seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ömür">Ömür</SelectItem>
                        <SelectItem value="volkan">Volkan</SelectItem>
                        <SelectItem value="hazar">Hazar</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="il"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    İl
                  </FormLabel>
                  <FormControl>
                    <Popover open={openIller} onOpenChange={setOpenIller}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openIller}
                          className="w-full justify-between bg-white border-slate-300 h-8 text-sm shadow-sm shadow-blue-200"
                          {...field}
                        >
                          {field.value
                            ? iller.find((il) => il.value === field.value)
                                ?.label
                            : "İl seçin veya arayın"}
                          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="İl ara..." />
                          <CommandEmpty>İl bulunamadı.</CommandEmpty>
                          <CommandList className="max-h-64 overflow-auto">
                            {iller.map((il) => (
                              <CommandItem
                                key={il.value}
                                value={il.value}
                                onSelect={(currentValue) => {
                                  field.onChange(currentValue);
                                  setOpenIller(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === il.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {il.label}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aktiflik_durumu_arama"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Aktiflik Durumu
                  </FormLabel>{" "}
                  <FormControl>
                    <Select
                      className="w-[180px] max-h-60 overflow-auto"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      {...field}
                    >
                      <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200">
                        <SelectValue placeholder="Aktiflik durumu seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Aktif</SelectItem>
                        <SelectItem value="false">Pasif</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lisans_tipi_arama"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-slate-700 font-medium text-m">
                    Lisans Tipi
                  </FormLabel>{" "}
                  <FormControl>
                    <Select
                      className="w-[180px] max-h-60 overflow-auto"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      {...field}
                    >
                      <SelectTrigger className="bg-white border-slate-300 focus:border-blue-500 h-8 text-m shadow-sm shadow-blue-200">
                        <SelectValue placeholder="Lisans tipi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demo">Demo</SelectItem>
                        <SelectItem value="tam_surum">Tam Sürüm</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="flex items-end gap-4">
              {" "}
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-sm px-3 py-0 pl-4 pr-4"
              >
                ARA
              </Button>
              <Button
                type="button"
                onClick={() => {
                  // Form'u sıfırla
                  form.reset({
                    lisans_arama: "",
                    musteri_arama: "",
                    bayi_arama: "",
                    paket_arama: "",
                    il: "", // İl alanı devre dışı olsa da formu sıfla
                    aktiflik_durumu_arama: "",
                    lisans_tipi_arama: "",
                    yetkili_arama: "",
                  });

                  // Filtreleri temizle
                  setFilterParams({});

                  // Filtreleme sıfırlandı bilgisi
                  toast.info("Filtreler temizlendi", {
                    description: "Tüm arama kriterleri temizlendi.",
                  });

                  // Tablo verilerini yenile
                  if (data) {
                    // Bu geçerli sorguya veriyi kaydeder
                    queryClient.setQueryData(["filteredLisanslar", {}], data);
                    console.log(
                      "Tablo verileri sıfırlandı, tüm kayıtlar gösteriliyor"
                    );
                  }

                  // Eğer veri yoksa, ana kaynaktan yenileyebiliriz
                  if (!data) {
                    refreshData();
                  }
                }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-sm px-3 py-0 pl-4 pr-4"
              >
                TEMİZLE
              </Button>
            </div>
          </div>
          {/* </div> */}
        </form>
      </Form>{" "}
      <div className="flex items-center py-2 justify-between">
        <Input
          placeholder="Tüm alanlarda arama yapın..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm h-8"
        />
      </div>{" "}
      <div className="flex-1 min-h-0">
        <div className="h-full rounded-md border overflow-auto">
          {isLoading || isRefetching || isFiltering ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-3"></div>
                <p className="text-indigo-600 font-medium">
                  Veriler yükleniyor...
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          width: header.column.columnDef.size,
                          minWidth: header.column.columnDef.minSize,
                          maxWidth: header.column.columnDef.maxSize,
                          
                        }}
                        className="px-2 py-0 whitespace-nowrap text-white bg-[#a390cd]"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            width: cell.column.columnDef.size,
                            minWidth: cell.column.columnDef.minSize,
                            maxWidth: cell.column.columnDef.maxSize,
                          }}
                          className="px-2 py-2"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {Object.keys(filterParams).length > 0 ? (
                        <span className="text-amber-600">
                          Arama kriterlerine uygun kayıt bulunamadı.
                        </span>
                      ) : (
                        <span>Kayıt bulunamadı.</span>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      <div className="py-4 flex items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Toplam {table.getFilteredRowModel().rows.length} kayıt
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Önceki
          </Button>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              Sayfa {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LisansListesiDataTable;
