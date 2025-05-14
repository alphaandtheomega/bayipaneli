"use client"
import axios from "axios"
import { useState } from "react" // useState import edildi
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {useMutation} from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useQuery } from "@tanstack/react-query"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
 
const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
]

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
      return axios.post("http://localhost:3001/api/paketler", TestData);
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
        const response = await axios.get(
          "http://localhost:3001/api/moduller"
        );
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
          <button          onClick={() => modulrefetch()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    Paket Aciklama
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      
                      placeholder="Paket Aciklama Giriniz"
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
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Modüller</FormLabel>
                <FormDescription>
                  Modül Seçiniz.
                </FormDescription>
              </div>
              {modulData.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.adi}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.modul_adi)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.modul_adi])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.modul_adi
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {item.modul_adi}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}