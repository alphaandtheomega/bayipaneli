"use client";
import axios from "axios";
import { useState } from "react"; // useState import edildi
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  items: z.array(z.string()).refine((value) => value.length > 0, {
    message: "En az bir modül seçmelisiniz.",
  }),
  paket_adi: z.string().min(1, "Paket gerekli"),
  paket_kodu: z.string().min(1, "Paket gerekli"),
  paket_aciklama: z.string().min(1, "Paket gerekli"),
});

export default function PaketEkle() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3002";
  console.log("Kullanılan API URL:", apiUrl);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paket_adi: "",
      paket_kodu: "",
      paket_aciklama: "",
      items: [],
    },
  });

  const createTestMutation = useMutation({
    mutationFn: (TestData) => {
      return axios.post(`${apiUrl}/api/paketler`, TestData);
    },
    onSuccess: () => {
      setSuccess(true);
      setError(null);
      form.reset();

      toast.success("Müşteri başarıyla eklendi", {
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
          error.response?.data?.message || "Müşteri eklenirken bir hata oluştu",
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
    // API isteği yap
    createTestMutation.mutate({
      ...values,
      items: values.items,
    });
  }

  const {
    data: modulData,
    isLoading,
    error: modulError,
    refetch: modulrefetch,
  } = useQuery({
    queryKey: ["moduller"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/moduller`);
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
            onClick={() => modulrefetch()}
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
        <Form {...form}>
          <form            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white p-4 rounded-lg shadow-md shadow-slate-300"
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-m">
                {error}
              </div>
            )}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white py-2 pl-4 border-b bg-cyan-700 rounded-t-lg">
                Paket Ekle
              </h1>
             
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
              <FormField
                control={form.control}
                name="paket_kodu"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 font-medium text-m">
                      Paket Kodu
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Paket Kodu Giriniz"
                        className="bg-white border-slate-300  h-8 text-m shadow-sm shadow-blue-200"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paket_adi"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 font-medium text-m">
                      Paket Adı
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Paket No Giriniz"
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
                name="paket_aciklama"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-slate-700 font-medium text-m">
                      Paket Açıklama
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Paket Açıklama Giriniz"
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
                name="items"
                render={() => (
                  <FormItem className="md:col-span-3 mt-2">
                    <div>
                       <div className="mb-6">
                          <h1 className="text-2xl font-bold text-white py-2 pl-4 border-b bg-cyan-700 rounded-t-lg">
                            Modüller
                          </h1>
                          
                        </div>
                      
                      <FormDescription className="text-slate-600 text-sm">
                        Paket için kullanılabilir modülleri seçiniz.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                      {modulData.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="items"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.adi}
                                className="flex flex-row items-center space-x-2 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-300 border border-transparent hover:border-indigo-200 group"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      item.modul_adi
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.modul_adi,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
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
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100 mt-4">
              <Button
                type="button"
                onClick={() => {
                  form.reset();
                  navigate("/lisanslistesi/");
                }}
                className="bg-red-400 text-white border border-gray-300 hover:bg-red-600 h-11 text-sm rounded-lg px-5 font-medium transition-all shadow-sm flex items-center group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1.5 text-white group-hover:text-white transition-colors"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                İptal
              </Button>
              <Button
                type="submit"
                className="bg-teal-500 hover:bg-teal-600 text-white h-11 text-sm rounded-lg px-6 font-medium transition-all shadow-sm flex items-center relative"
              >
                Kaydet
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
