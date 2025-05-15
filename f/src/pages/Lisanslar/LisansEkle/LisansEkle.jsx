"use client";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const formSchema = z.object({
  bayi_adi: z.string().optional(),
  musteri_adi: z.string().optional(),
  paket_adi: z.string().optional(),
  items: z.array(z.string()).optional(),
});

export default function LisansEkle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openBayi, setOpenBayi] = React.useState(false);
  const [selectedBayi, setSelectedBayi] = useState(null);
  const [openMusteri, setOpenMusteri] = React.useState(false);
  const [selectedMusteri, setSelectedMusteri] = useState(null);  
  const [openPaket, setOpenPaket] = React.useState(false);
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [selectedPaketId, setSelectedPaketId] = useState(null);
  const queryClient = useQueryClient();
    // Form tanımlaması
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bayi_adi: "",
      musteri_adi: "",
      paket_adi: "",
      items: [],
    },
  });
  
  //modülleri getirmek için useQuery kullanımı
  const {
    data: modulPaketDuzenleData,
    isLoading: modulPaketDuzenleLoading,
    error: modulPaketDuzenleError,
    refetch: modulPaketDuzenlerefetch,
  } = useQuery({
    queryKey: ["moduller"],
    queryFn: async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/moduller");
        return response.data || [];
      } catch (error) {
        console.error("API Hatası:", error);
        throw error;
      }
    },
    // Başlangıçta verileri otomatik yükle
    enabled: true,
    // Sekme değişimlerinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnWindowFocus: false,
    // Ağ bağlantısı geri geldiğinde otomatik yeniden çekmeyi devre dışı bırak
    refetchOnReconnect: false,
  });
  
  // Seçilen paket ID'sine göre modülleri getiren fonksiyon
  const fetchPaketModules = (armut) => {
    setSelectedPaketId(armut);
  };

  // Seçilen paket ID'sine göre modülleri getiren sorgu
  const {
    data: paketModulleri,
    isLoading: paketModulleriLoading,
  } = useQuery({
    queryKey: ["paketModulleri", selectedPaketId],
    queryFn: async () => {
      if (!selectedPaketId) return null;
      
      try {        const response = await axios.get(
          `http://localhost:3001/api/paketler/${selectedPaketId}`
        );
        console.log("Paket modülleri yüklendi:", response.data);
        // API yanıtının yapısını kontrol et
        if (response.data && Array.isArray(response.data)) {
          console.log("Paket modül verileri detayı:", 
            response.data.length > 0 ? 
            {
              paket_id: response.data[0].id,
              paket_adi: response.data[0].paket_adi,
              paket_modul: response.data[0].paket_modul,
              paket_modul_type: typeof response.data[0].paket_modul
            } : 
            "Boş dizi");
        }
        return response.data;
      } catch (error) {
        console.error("Paket modülleri yüklenirken hata oluştu:", error);
        toast.error("Paket modülleri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    enabled: !!selectedPaketId, // burada değişiklik!
    refetchOnWindowFocus: false,
  });  // Paket modülleri yüklendiğinde form alanlarını güncelle
  useEffect(() => {
    if (paketModulleri && Array.isArray(paketModulleri) && paketModulleri.length > 0 && modulPaketDuzenleData) {
      const paket = paketModulleri[0];

      // Eğer paket_modul bir string ise parse et
      let items = [];
      if (paket.paket_modul) {
        try {
          if (typeof paket.paket_modul === "string") {
            items = JSON.parse(paket.paket_modul);
          } else {
            items = paket.paket_modul;
          }
        } catch (e) {
          console.error("paket_modul parse edilemedi:", e);
        }
      }
      
      // Form alanlarını paket verileriyle doldur
      console.log("Paket modülleri yüklendi, değerler ayarlanıyor:", items);
      console.log("Mevcut form değerleri:", form.getValues());
      
      // Kontrol: Form değerleri ile mevcut modül adları uyumlu mu?
      if (modulPaketDuzenleData && modulPaketDuzenleData.length > 0) {
        console.log("Mevcut modüller:", modulPaketDuzenleData.map(m => m.modul_adi));
        console.log("Seçilen paket modülleri:", items);
        
        // items dizisi içindeki her bir öğenin modulPaketDuzenleData içinde karşılığı var mı kontrol et
        const validItems = items.filter(item => 
          modulPaketDuzenleData.some(modul => modul.modul_adi === item)
        );
        
        if (validItems.length !== items.length) {
          console.warn("Bazı modül adları sistemde bulunan modüllerle eşleşmiyor!");
          console.log("Geçerli modüller:", validItems);
          // Sadece geçerli olanları kullan
          items = validItems;
        }
      }
      
      // Form alanlarını temizle ve sonra değerleri ayarla
      setTimeout(() => {
        form.setValue("items", items || []);
        console.log("Form değerleri güncellendi:", form.getValues());
      }, 0);
    }
  }, [paketModulleri, form, modulPaketDuzenleData]);

  // Bayileri getirmek için useQuery kullanımı
  const {
    data: bayiler = [],
    isFetching,
    refetch: refetchBayiler,
  } = useQuery({
    queryKey: ["bayiler"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/bayiler/unvan"
        );
        console.log("Bayiler verileri alındı:", response.data);
        return response.data;
      } catch (error) {
        console.error("Bayiler verileri alınamadı:", error);
        return [];
      }
    },
    // Başlangıçta otomatik çalışmasını engelliyoruz
    enabled: false,
    // Önbellek süresini uzun tutuyoruz
    staleTime: 5 * 60 * 1000, // 5 dakika - bu süre içinde veri "taze" kabul edilir
    gcTime: 10 * 60 * 1000, // 10 dakika
    // Hata durumunda yeniden deneme sayısını sınırlıyoruz
    retry: 3,
  });

  // Müşterileri getirmek için useQuery kullanımı
  const {
    data: musteriler = [],
    isFetching: isFetchingMusteri,
    refetch: refetchMusteri,
  } = useQuery({
    queryKey: ["musteriler"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/musteri/unvan"
        );
        console.log("Müşteri verileri alındı:", response.data);
        return response.data;
      } catch (error) {
        console.error("Müşteri verileri alınamadı:", error);
        return [];
      }
    },
    // Başlangıçta otomatik çalışmasını engelliyoruz
    enabled: false,
    // Önbellek süresini uzun tutuyoruz
    staleTime: 5 * 60 * 1000, // 5 dakika - bu süre içinde veri "taze" kabul edilir
    gcTime: 10 * 60 * 1000, // 10 dakika
    // Hata durumunda yeniden deneme sayısını sınırlıyoruz
    retry: 3,
  });

  // paket adlarını getirmek için useQuery kullanımı
  const {
    data: paketler = [],
    isFetching: isFetchingPaketler,
    refetch: refetchPaketler,
  } = useQuery({
    queryKey: ["paketler"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/paket/paket_adi"
        );
        console.log("Paket verileri alındı:", response.data);
        return response.data;
      } catch (error) {
        console.error("Paket verileri alınamadı:", error);
        return [];
      }
    },
    // Başlangıçta otomatik çalışmasını engelliyoruz
    enabled: false,
    // Önbellek süresini uzun tutuyoruz
    staleTime: 5 * 60 * 1000, // 5 dakika - bu süre içinde veri "taze" kabul edilir
    gcTime: 10 * 60 * 1000, // 10 dakika
    // Hata durumunda yeniden deneme sayısını sınırlıyoruz
    retry: 3,
  });

  //paketleri idye göre getiren api
  const {
    data: paketIdData,
    isLoading: paketIdLoading,
    isError: paketIdError,
  } = useQuery({
    queryKey: ["paketduzenle", id],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/paketler/${id}`
        );
        console.log("Paket duzenle verileri yüklendi:", response.data);
        return response.data;
      } catch (error) {
        console.error(
          "Paket duzenle  verileri yüklenirken hata oluştu:",
          error
        );
        toast.error("Paket duzenle  verileri yüklenemedi", {
          description: "Lütfen daha sonra tekrar deneyin.",
        });
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!id, // id var ise sorguyu etkinleştir
  }); // Paket duzenle verisi geldiğinde formu doldur
  useEffect(() => {
    if (paketIdData && Array.isArray(paketIdData) && paketIdData.length > 0) {
      const paket = paketIdData[0];

      // Eğer paket_modul bir string ise parse et
      let items = [];
      if (paket.paket_modul) {
        try {
          if (typeof paket.paket_modul === "string") {
            items = JSON.parse(paket.paket_modul);
          } else {
            items = paket.paket_modul;
          }
        } catch (e) {
          console.error("paket_modul parse edilemedi:", e);
        }
      }

      // Form alanlarını paket verileriyle doldur
      const formValues = {
        items: items,
      };      console.log("Form değerleri yükleniyor:", formValues);
      form.reset(formValues);    }}, [paketIdData, form]);
  const createModulMutation = useMutation({
    mutationFn: (ModulData) => {
      return axios.post("http://localhost:3001/api/moduller", ModulData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();
      // Modüller listesini güncelle
      queryClient.invalidateQueries(["moduller"]);

      toast.success("Modül başarıyla eklendi", {
        description: "İşlem başarıyla tamamlandı",
        style: {
          backgroundColor: "#dcfce7",
          border: "1px solid #86efac",
          color: "#166534",
        },
      });
    },
    onError: (error) => {
      toast.error("Hata", {
        description:
          error.response?.data?.message || "Modül eklenirken bir hata oluştu",
        style: {
          backgroundColor: "#fee2e2",
          border: "1px solid #fca5a5",
          color: "#991b1b",
        },
      });
      setSuccess(false);
    },
  });

  function onSubmit(values) {
    console.log("Form Verileri:", values);
    console.log("Form hataları:", form.formState.errors);

    setSuccess(false);
    setError(null);
    createModulMutation.mutate(values);
  }

  return (
    <>
      <div className="h-full w-full">
        <div className="h-full w-full p-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white p-4 rounded-lg shadow-md max-h-[calc(100vh-120px)] overflow-y-auto shadow-slate-300"
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                <FormField
                  control={form.control}
                  name="bayi_adi"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Bayi
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openBayi}
                          onOpenChange={(open) => {
                            setOpenBayi(open);
                            if (open) {
                              refetchBayiler();
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openBayi}
                              className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-m font-normal shadow-sm shadow-blue-200"
                            >
                              {field.value ? field.value : "Bayi Seçiniz..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="Bayi ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[200px]">
                                {isFetching ? (
                                  <div className="py-3 text-center text-m">
                                    Yükleniyor...
                                  </div>
                                ) : bayiler.length === 0 ? (
                                  <CommandEmpty>Bayi bulunamadı.</CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {bayiler.map((bayi) => (
                                      <CommandItem
                                        key={bayi.id}
                                        value={bayi.id.toString()}
                                        onSelect={() => {
                                          setSelectedBayi(bayi);
                                          field.onChange(bayi.unvan);
                                          setOpenBayi(false);
                                        }}
                                        className="text-m"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-3 w-3",
                                            field.value === bayi.unvan
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {bayi.unvan}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
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
                  name="musteri_adi"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Müşteri Adı
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openMusteri}
                          onOpenChange={(open) => {
                            setOpenMusteri(open);
                            if (open) {
                              refetchMusteri();
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openMusteri}
                              className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-m font-normal shadow-sm shadow-blue-200"
                            >
                              {field.value ? field.value : "Müşteri Seçiniz..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="Müşteri ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[200px]">
                                {isFetchingMusteri ? (
                                  <div className="py-3 text-center text-m">
                                    Yükleniyor...
                                  </div>
                                ) : musteriler.length === 0 ? (
                                  <CommandEmpty>
                                    Müşteri bulunamadı.
                                  </CommandEmpty>
                                ) : (
                                  <CommandGroup>
                                    {musteriler.map((musteri) => (
                                      <CommandItem
                                        key={musteri.id}
                                        value={musteri.id.toString()}
                                        onSelect={() => {
                                          setSelectedMusteri(musteri);
                                          field.onChange(musteri.unvan);
                                          setOpenMusteri(false);
                                        }}
                                        className="text-m"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-3 w-3",
                                            field.value === musteri.unvan
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {musteri.unvan}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
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
                  name="paket_adi"
                  render={({ field }) => (
                    <FormItem className="space-y-1 ">
                      <FormLabel className="text-slate-700 font-medium text-m">
                        Paket
                      </FormLabel>
                      <FormControl>
                        <Popover
                          open={openPaket}
                          onOpenChange={(open) => {
                            setOpenPaket(open);
                            if (open) {
                              refetchPaketler();
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openPaket}
                              className="w-full justify-between bg-white border-slate-300 hover:bg-slate-50 h-8 text-m font-normal shadow-sm shadow-blue-200"
                            >
                              {field.value ? field.value : "Paket Seçiniz..."}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-full p-0"
                            align="start"
                            sideOffset={4}
                          >
                            <Command>
                              <CommandInput
                                placeholder="Paket ara..."
                                className="h-8"
                              />
                              <CommandList className="max-h-[200px]">
                                {isFetchingPaketler ? (
                                  <div className="py-3 text-center text-m">
                                    Yükleniyor...
                                  </div>
                                ) : paketler.length === 0 ? (
                                  <CommandEmpty>Paket bulunamadı.</CommandEmpty>
                                ) : (
                                  <CommandGroup>                                    {paketler.map((paket) => (
                                      <CommandItem
                                        key={paket.id}
                                        value={paket.id.toString()}
                                        onSelect={() => {
                                          setSelectedPaket(paket);
                                          field.onChange(paket.paket_adi);
                                          setOpenPaket(false);
                                          // Seçilen paket değiştiğinde, paket modüllerini getir
                                          fetchPaketModules(paket.id);
                                        }}
                                        className="text-m"
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-3 w-3",
                                            field.value === paket.paket_adi
                                              ? "opacity-100"
                                              : "opacity-0"
                                          )}
                                        />
                                        {paket.paket_adi}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                )}
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
                  name="items"
                  render={() => (
                    <FormItem className="md:col-span-3 mt-4">
                      <div className="mb-5 bg-gradient-to-r from-indigo-50 to-white p-4 rounded-xl border-l-4 border-indigo-500">
                        <FormLabel className="text-xl font-semibold text-indigo-700">
                          Modüller
                        </FormLabel>
                        <FormDescription className="text-slate-600 text-sm mt-1">
                          Paket için kullanılabilir modülleri seçiniz.
                        </FormDescription>                      </div>                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                        {(modulPaketDuzenleData || []).map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="items"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={item.adi}
                                  className="flex flex-row items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-300 border border-transparent hover:border-indigo-200 group"
                                >                                  <FormControl>
                                    <Checkbox
                                      checked={(field.value || []).includes(
                                        item.modul_adi
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              item.modul_adi,
                                            ])
                                          : field.onChange(
                                              (field.value || []).filter(
                                                (value) =>
                                                  value !== item.modul_adi
                                              )
                                            );
                                      }}
                                      className="h-7 w-7 rounded-md border-2 border-indigo-300 bg-white shadow-sm ring-offset-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-blue-500 data-[state=checked]:border-indigo-400 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                                    />
                                  </FormControl>
                                  <FormLabel className="text-base font-medium cursor-pointer select-none text-gray-700 group-hover:text-indigo-700 transition-colors ml-1">
                                    {item.modul_adi}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}{" "}
                      </div>
                      <FormMessage className="text-sm text-red-500 mt-2" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col justify-end space-y-2 md:space-y-0 md:space-x-2 md:flex-row md:items-end mt-5">
                <Button
                  type="button"
                  onClick={() => form.reset()}
                  className="bg-red-800 hover:bg-red-500 text-white h-10 text-sm px-3 py-0 pl-4 pr-4 mr-5"
                >
                  İptal
                </Button>

                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 text-sm px-3 py-0 pl-4 pr-4"
                >
                  Kaydet
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
