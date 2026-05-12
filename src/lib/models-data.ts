import c23Branca from "@/assets/c23-branca.png";
import c23Azul from "@/assets/c23-azul.png";
import c23Preta from "@/assets/c23-preta.png";
import c23Lateral from "@/assets/c23-lateral.png";
import p112Img from "@/assets/move.jpg";

export type ModelSlug = "c23" | "p112";

export type ModelColor = { name: string; hex: string; image: string };

export type ModelData = {
  slug: ModelSlug;
  name: string;
  tagline: string;
  intro: string;
  image: string;
  gallery?: string[];
  colors?: ModelColor[];
  specs: { label: string; value: string }[];
  card_specs?: { label: string; value: string }[];
  design: { title: string; text: string }[];
  tech: { title: string; text: string }[];
};

export const MODELS: Record<ModelSlug, ModelData> = {
  c23: {
    slug: "c23",
    name: "C23",
    tagline: "Mobilidade urbana leve, silenciosa e prática.",
    intro: "A C23 é uma e-bike urbana pensada para o trajeto do dia a dia. Estrutura em aço carbono, motor brushless de 800 W e bateria removível para carregar onde quiser. Três cores, uma única atitude: se mover melhor pela cidade.",
    image: c23Branca,
    gallery: [c23Branca, c23Azul, c23Preta, c23Lateral],
    card_specs: [
      { label: "Autonomia", value: "31–60 km" },
      { label: "Vel. máx", value: "50 km/h" },
      { label: "Carga", value: "> 3h" },
    ],
    colors: [
      { name: "Branco", hex: "#F4F4F2", image: c23Branca },
      { name: "Azul", hex: "#3FA9F5", image: c23Azul },
      { name: "Preto", hex: "#1A1A1A", image: c23Preta },
    ],
    specs: [
      { label: "Tipo", value: "E-bike urbana" },
      { label: "Velocidade máxima", value: "30–50 km/h" },
      { label: "Autonomia", value: "31–60 km" },
      { label: "Motor", value: "Brushless 800 W — cubo traseiro" },
      { label: "Tensão", value: "48 V" },
      { label: "Bateria", value: "Chumbo-ácido 12 Ah ou 20 Ah" },
      { label: "Posição da bateria", value: "Tubo inferior" },
      { label: "Tempo de carga", value: "Acima de 3 horas" },
      { label: "Torque", value: "> 100 Nm" },
      { label: "Frame", value: "Aço carbono" },
      { label: "Roda", value: "14\"" },
      { label: "Suspensão", value: "Dianteira e traseira" },
      { label: "Freios", value: "Tambor dianteiro e traseiro" },
      { label: "Engrenagens", value: "Velocidade única" },
      { label: "Acionamento", value: "Acelerador de torção / cabo" },
      { label: "Painel", value: "Tela LCD" },
      { label: "Aplicação", value: "Transporte urbano — adultos" },
    ],
    design: [
      { title: "Três cores", text: "Branco, azul e preto. Acabamento sólido com detalhes em laranja ou vermelho." },
      { title: "Cesto frontal", text: "Volume útil para o dia a dia sem comprometer a linha." },
      { title: "Banco com encosto", text: "Conforto para piloto e garupa em trajetos longos." },
    ],
    tech: [
      { title: "Motor brushless", text: "800 W silenciosos com torque acima de 100 Nm para retomadas firmes." },
      { title: "Bateria flexível", text: "Opções de 12 Ah ou 20 Ah para ajustar autonomia ao seu uso." },
      { title: "Painel LCD", text: "Velocidade, autonomia e modo de pilotagem sempre à vista." },
    ],
  },

  p112: {
    slug: "p112",
    name: "P112",
    tagline: "Performance e autonomia para quem leva mais longe.",
    intro: "A P112 é categoria moto elétrica. Mais potência, mais alcance, mais presença. Para quem precisa de uma máquina capaz de cobrir trajetos completos sem concessões.",
    image: p112Img,
    card_specs: [
      { label: "Autonomia", value: "140 km" },
      { label: "Vel. máx", value: "95 km/h" },
      { label: "Carga", value: "5–7h" },
    ],
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
