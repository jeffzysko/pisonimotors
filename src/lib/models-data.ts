import urbaImg from "@/assets/urba.jpg";
import moveImg from "@/assets/move.jpg";

export type ModelData = {
  slug: "urba" | "move";
  name: string;
  tagline: string;
  intro: string;
  image: string;
  specs: { label: string; value: string }[];
  design: { title: string; text: string }[];
  tech: { title: string; text: string }[];
};

export const MODELS: Record<"urba" | "move", ModelData> = {
  urba: {
    slug: "urba",
    name: "URBA",
    tagline: "A scooter para quem se move pela cidade todos os dias.",
    intro: "Leve, ágil e silenciosa. URBA é a resposta da PISONI para o uso diário urbano — sem barulho, sem combustão, sem comprometer estilo.",
    image: urbaImg,
    specs: [
      { label: "Autonomia", value: "80 km" },
      { label: "Velocidade máxima", value: "65 km/h" },
      { label: "Motor", value: "3.000 W" },
      { label: "Bateria", value: "Lítio removível 60V 32Ah" },
      { label: "Tempo de carga", value: "4–6 horas" },
      { label: "Peso", value: "78 kg" },
      { label: "Capacidade de carga", value: "150 kg" },
      { label: "Freios", value: "Disco hidráulico CBS" },
      { label: "Suspensão", value: "Telescópica dianteira / dupla traseira" },
      { label: "Painel", value: "LCD digital com Bluetooth" },
      { label: "Conectividade", value: "App PISONI (iOS / Android)" },
      { label: "Categoria CONTRAN", value: "Ciclomotor" },
    ],
    design: [
      { title: "Linhas limpas", text: "Carenagem monolítica sem ruídos visuais." },
      { title: "Acabamento matte", text: "Pintura fosca de alta resistência a marcas." },
      { title: "Detalhes em cobre", text: "Assinatura cromática PISONI em pontos discretos." },
    ],
    tech: [
      { title: "Bateria removível", text: "Carregue em casa ou no escritório, sem rampas." },
      { title: "Painel conectado", text: "Bluetooth para diagnóstico e atualizações." },
      { title: "Freios regenerativos", text: "Recuperação de energia em desacelerações." },
    ],
  },
  move: {
    slug: "move",
    name: "MOVE",
    tagline: "Performance e autonomia para quem leva mais longe.",
    intro: "MOVE é categoria moto elétrica. Mais potência, mais alcance, mais presença. Para quem precisa de uma máquina capaz de cobrir trajetos completos sem concessões.",
    image: moveImg,
    specs: [
      { label: "Autonomia", value: "140 km" },
      { label: "Velocidade máxima", value: "95 km/h" },
      { label: "Motor", value: "5.000 W" },
      { label: "Bateria", value: "Lítio dupla 72V 40Ah" },
      { label: "Tempo de carga", value: "5–7 horas" },
      { label: "Peso", value: "105 kg" },
      { label: "Capacidade de carga", value: "180 kg" },
      { label: "Freios", value: "Disco duplo dianteiro / disco traseiro ABS" },
      { label: "Suspensão", value: "Invertida dianteira / mono-amortecedor" },
      { label: "Painel", value: "TFT colorido 7'' com app conectado" },
      { label: "Conectividade", value: "App PISONI + GPS integrado" },
      { label: "Categoria CONTRAN", value: "Motocicleta elétrica (CNH A)" },
    ],
    design: [
      { title: "Postura naked", text: "Silhueta encorpada, postura ereta de pilotagem." },
      { title: "Iluminação full LED", text: "Assinatura luminosa identificável a distância." },
      { title: "Materiais premium", text: "Selim em couro técnico, peças em alumínio usinado." },
    ],
    tech: [
      { title: "Conectividade total", text: "App PISONI para rota, autonomia e diagnóstico remoto." },
      { title: "Modos de pilotagem", text: "Eco, City e Sport para diferentes contextos." },
      { title: "Suspensão regulável", text: "Ajuste fino para conforto ou esportividade." },
    ],
  },
};
