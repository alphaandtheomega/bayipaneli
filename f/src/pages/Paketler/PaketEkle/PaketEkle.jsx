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
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const formSchema = z.object({
  paket_kodu: z.string().min(1, "Paket kodu gerekli"),
  paket_adi: z.string().min(1, "Paket adı gerekli"),
  paket_aciklama: z.string().min(1, "Paket açıklama gerekli"),
  items: z
    .array(z.string())
    .refine((value) => value.length > 0, {
      message: "En az bir modül seçmelisiniz.",
    })
    .refine((value) => new Set(value).size === value.length, {
      message: "Aynı modül birden fazla kez seçilemez.",
    }),
});

export default function PaketEkle() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [modulItems, setModulItems] = useState([]);
  const queryClient = useQueryClient();

  // Veritabanından modülleri çek
  const {
    data: moduller,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["moduller"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3001/api/moduller");
      return response.data;
    },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paket_kodu: "",
      paket_adi: "",
      paket_aciklama: "",
      items: [],
    },
  });

  const createPaketMutation = useMutation({
    mutationFn: (PaketData) => {
      return axios.post("http://localhost:3001/api/paketler", PaketData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();

      toast.success("Paket başarıyla eklendi", {
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
          error.response?.data?.message || "Paket eklenirken bir hata oluştu",
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
    // Form verilerini konsola yazdır
    console.log("Form Verileri:", values);

    // Form doğrulaması sırasında hataları konsola yazdır
    console.log("Form hataları:", form.formState.errors);

    // Modülleri tekrar kontrolü ve temizliği
    const cleanedValues = {
      ...values,
      items: [...new Set(values.items)], // Duplicate modülleri kaldır
    };

    // API'ye form verilerini gönder
    setSuccess(false);
    setError(null);
    createPaketMutation.mutate(cleanedValues);
  }

  return (
    <>
      <div className="h-full w-full">
        <div className="h-full w-full p-3">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-white p-6 rounded-xl shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto transition-all duration-300 hover:shadow-xl"
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-sm flex items-center space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                {/* Paket Kodu */}
                <FormField
                  control={form.control}
                  name="paket_kodu"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-sm">
                        Paket Kodu
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Paket Kodu"
                          className="bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 h-9 text-sm shadow-sm shadow-blue-200 transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                {/* Paket Adı */}
                <FormField
                  control={form.control}
                  name="paket_adi"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-sm">
                        Paket Adı
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Paket Adı"
                          className="bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 h-9 text-sm shadow-sm shadow-blue-200 transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                {/* Paket Açıklama */}
                <FormField
                  control={form.control}
                  name="paket_aciklama"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-slate-700 font-medium text-sm">
                        Paket Açıklama
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Paket Açıklama"
                          className="bg-white border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 h-9 text-sm shadow-sm shadow-blue-200 transition-all duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={form.control}
                  name="items"
                  render={() => (
                    <FormItem className="col-span-1 md:col-span-3 mt-4">
                      <div className="mb-3">
                        <FormLabel className="text-slate-700 font-medium text-lg">
                          Modüller
                        </FormLabel>
                        <FormDescription className="text-slate-500 text-sm">
                          Pakete dahil edilecek modülleri seçiniz
                        </FormDescription>
                      </div>

                      {isLoading ? (
                        <div className="flex items-center justify-center h-24 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="animate-pulse flex items-center space-x-2">
                            <div className="h-4 w-4 bg-slate-300 rounded-full animate-bounce"></div>
                            <div className="text-slate-500">
                              Modüller yükleniyor...
                            </div>
                          </div>
                        </div>
                      ) : isError ? (
                        <div className="flex items-center justify-center h-24 bg-red-50 rounded-lg border border-red-200">
                          <div className="text-red-500 flex items-center space-x-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-red-500"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>Modülleri yüklerken bir hata oluştu</span>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-0">
                          {/* Modülleri dışarıda bir kez çağır */}

                          <FormField
                            control={form.control}
                            name="items"
                            render={({ field }) => (
                              <>
                                {moduller?.map((modul) => {
                                  // Her modül için seçilip seçilmediğini kontrol et
                                  const isSelected = field.value?.includes(
                                    modul.modul_kodu
                                  );

                                  return (
                                    <div
                                      key={modul.id}
                                      className={`flex flex-row items-center space-x-3 space-y-0 p-3 rounded-md transition-all duration-200 cursor-pointer select-none ${
                                        isSelected
                                          ? "bg-blue-50 border border-blue-200 shadow-sm"
                                          : "bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30"
                                      }`}
                                      onClick={() => {
                                        // Tıklama işlemi - modülün durumunu değiştir
                                        const newValue = [...field.value];

                                        if (isSelected) {
                                          // Modül seçiliyse kaldır
                                          const index = newValue.indexOf(
                                            modul.modul_kodu
                                          );
                                          if (index !== -1) {
                                            newValue.splice(index, 1);
                                          }
                                        } else {
                                          // Modül seçili değilse ekle
                                          if (
                                            !newValue.includes(modul.modul_kodu)
                                          ) {
                                            newValue.push(modul.modul_kodu);
                                          } else {
                                            // Modül zaten seçili, bildiri göster
                                            toast.error("Hata", {
                                              description: `${modul.modul_adi} modülü zaten seçilmiş`,
                                              style: {
                                                backgroundColor: "#fee2e2",
                                                border: "1px solid #fca5a5",
                                                color: "#991b1b",
                                              },
                                            });
                                            return;
                                          }
                                        }

                                        // Form değerini güncelle
                                        field.onChange(newValue);
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        className={`h-5 w-5 ${
                                          isSelected
                                            ? "border-blue-500 text-blue-500"
                                            : "border-slate-300"
                                        }`}
                                        readOnly
                                      />
                                      <div className="flex flex-col">
                                        <span
                                          className={`font-medium text-sm ${
                                            isSelected
                                              ? "text-blue-700"
                                              : "text-slate-700"
                                          } cursor-pointer`}
                                        >
                                          {modul.modul_adi}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                          Kod: {modul.modul_kodu}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          />
                        </div>
                      )}
                      <FormMessage className="mt-2 text-xs text-red-500" />
                    </FormItem>
                  )}
                />
              </div>{" "}
              <div className="flex flex-col justify-end space-y-2 md:space-y-0 md:space-x-3 md:flex-row md:items-center mt-6">
                <Button
                  type="button"
                  onClick={() => form.reset()}
                  className="bg-white border border-red-500 text-red-600 hover:bg-red-50 h-10 text-sm px-5 py-0 rounded-md transition-all duration-200 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  İptal
                </Button>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm px-5 py-0 rounded-md transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                  </svg>
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
