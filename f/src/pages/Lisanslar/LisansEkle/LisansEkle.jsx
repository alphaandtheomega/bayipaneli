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

const formSchema = z.object({
  bayi_adi: z.string().optional(),
  musteri_adi: z.string().optional(),
});

export default function LisansEkle() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openBayi, setOpenBayi] = React.useState(false);
  const [selectedBayi, setSelectedBayi] = useState(null);
  const [openMusteri, setOpenMusteri] = React.useState(false);
  const [selectedMusteri, setSelectedMusteri] = useState(null);
  const [openPaket, setOpenPaket] = React.useState(false);
  const [selectedPaket, setSelectedPaket] = useState(null);
  const queryClient = useQueryClient();

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

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bayi_adi: "",
      musteri_adi: "",
    },
  });
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
                                  <CommandEmpty>Müşteri bulunamadı.</CommandEmpty>
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
                                  <CommandGroup>
                                    {paketler.map((paket) => (
                                      <CommandItem
                                        key={paket.id}
                                        value={paket.id.toString()}
                                        onSelect={() => {
                                          setSelectedPaket(paket);
                                          field.onChange(paket.paket_adi);
                                          setOpenPaket(false);
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
