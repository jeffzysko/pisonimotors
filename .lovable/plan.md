## Estrutura de revendedores PISONI

Criar um sistema completo de revendedores com páginas individuais, agregação por cidade e busca por cidade/CEP com geolocalização.

---

### 1. Banco de dados

**Nova tabela `dealers`** (revendedores publicados, separada de `representative_applications`):
- Identificação: `slug` (único, ex: `sao-paulo-centro`), `name`, `city_slug` (ex: `sao-paulo`)
- Localização: `city`, `state`, `address`, `postal_code`, `latitude`, `longitude`
- Contato: `phone`, `whatsapp`, `email`
- Operação: `business_hours` (texto livre), `published` (bool)
- Vínculo opcional: `application_id` (FK para a candidatura aprovada que originou o cadastro)

**RLS:** leitura pública dos `published = true`; escrita apenas para admins.

**Aprovação automática:** trigger em `representative_applications` — quando `status` muda para `aprovado`, insere automaticamente em `dealers` com `published = true`, gerando `slug` a partir de cidade+nome e geocodificando o CEP via job (na primeira vez que admin aprova, lat/lng pode ficar null e ser preenchido manualmente ou via edge function).

### 2. Geocodificação (CEP → lat/lng)

Server function `geocodeCep` usa **ViaCEP** (gratuito, sem chave) para validar e expandir o CEP, e **Nominatim/OpenStreetMap** para obter lat/lng. Chamada:
- No trigger de aprovação (assíncrono via server function chamada pelo admin)
- Na busca do usuário (converter CEP digitado → coordenadas → calcular distância)

### 3. Rotas novas

```
/revendedores                       → lista geral + busca (substitui o conteúdo atual de /encontre-um-revendedor)
/revendedores/$citySlug             → página da cidade (lista revendedores daquela cidade)
/revendedores/$citySlug/$slug       → página individual do revendedor
```

A rota antiga `/encontre-um-revendedor` redireciona para `/revendedores` (preserva links existentes).

### 4. Busca inteligente

Componente de busca único que detecta o input:
- **Só dígitos (8 chars)** → trata como CEP: geocodifica e ordena por distância (Haversine), mostra os 10 mais próximos com km.
- **Texto** → busca case-insensitive em `city`, `state`, `name` do dealer.

Resultados clicáveis levam à página individual do revendedor.

### 5. Páginas

**`/revendedores`** — campo de busca grande + lista de cidades com revendedores (agrupada por estado) quando vazia.

**`/revendedores/$citySlug`** — H1 com nome da cidade, lista de cards dos revendedores daquela cidade (nome, endereço resumido, botões WhatsApp/telefone, link "Ver detalhes").

**`/revendedores/$citySlug/$slug`** — página completa do revendedor:
- Header com nome + cidade/estado
- Endereço completo
- Telefone, WhatsApp, e-mail (clicáveis)
- Horários de funcionamento
- CTA "Falar no WhatsApp"
- Breadcrumb: Início › Revendedores › Cidade › Nome
- SEO: `head()` com title/description/og específicos por revendedor (ótimo para SEO local)

### 6. Admin

Estender `/admin` para listar dealers e permitir:
- Editar dados básicos (endereço, telefone, horários)
- Forçar geocodificação de um CEP
- Despublicar/publicar
- Ver candidatura aprovada de origem

### 7. Sitemap

Atualizar `src/routes/sitemap[.]xml.ts` para incluir todas as rotas `/revendedores/$citySlug` e `/revendedores/$citySlug/$slug` dinamicamente — essencial para o SEO local.

---

### Detalhes técnicos

- Migrations criam tabela `dealers`, função `gen_dealer_slug()`, trigger `auto_publish_approved_dealer()`.
- Server functions: `searchDealers({ query? , postalCode? })`, `getDealerBySlug({ citySlug, slug })`, `listDealersByCity({ citySlug })`, `geocodeCep({ cep })`, `geocodeDealer({ id })` (admin).
- Distância via Haversine no SQL: `earth_distance` (extensão `cube` + `earthdistance`) ou cálculo em JS sobre o resultado da query.
- Para começar, deixo a tabela vazia — você cadastra os primeiros revendedores via admin (ou aprova candidaturas existentes para popular automaticamente).