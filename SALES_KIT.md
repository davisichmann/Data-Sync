# 📊 Conteúdo da Apresentação de Vendas - Data Sync Engine

Use este roteiro para criar seus slides. O foco é: **Economia de Tempo** e **Confiabilidade**.

---

## 🎨 Estrutura dos Slides

### Slide 1: Capa
**Título:** O Fim do "Copy & Paste" na Sua Agência
**Subtítulo:** Automatize a coleta de dados de marketing e foque na estratégia.
**Imagem Sugerida:** Logo do Data Sync Engine ou uma imagem clean de tecnologia.

### Slide 2: O Problema
**Título:** Quanto tempo sua equipe perde coletando dados?
**Pontos Principais:**
*   **Processo Manual:** Entrar em cada plataforma (Meta, Google, GA4) todo dia.
*   **Risco de Erros:** Copiar e colar números errados na planilha.
*   **Atraso na Tomada de Decisão:** Dados sempre desatualizados ou dependentes de alguém atualizar.
*   **Custo Invisível:** Horas de analistas seniores fazendo trabalho de estagiário.

### Slide 3: A Solução
**Título:** Data Sync Engine
**Subtítulo:** Seus dados no Google Sheets, automaticamente, todo dia às 6h da manhã.
**Pontos Principais:**
*   **100% Automatizado:** Conecte uma vez, esqueça para sempre.
*   **Multi-Plataforma:** Meta Ads, Google Ads e Google Analytics 4.
*   **Destino Universal:** Google Sheets (onde sua equipe já trabalha).
*   **Auditoria Completa:** Saiba exatamente quando os dados foram atualizados.

### Slide 4: Como Funciona (Simples em 3 Passos)
**Título:** Simples, Rápido e Seguro
**Visual:** Ícones ou fluxo simples (1 -> 2 -> 3)
1.  **Conectamos:** Linkamos suas contas de anúncios de forma segura.
2.  **Sincronizamos:** Nosso motor roda toda madrugada enquanto você dorme.
3.  **Analisamos:** Você acorda com sua planilha preenchida e pronta.

### Slide 5: O Que Nós Coletamos
**Título:** As Métricas que Importam
**Colunas (Visual de Tabela):**
*   **Meta Ads:** Spend, Clicks, Impressions, Conversions.
*   **Google Ads:** Cost, Clicks, Impressions, Conversions.
*   **GA4:** Sessions, Conversions, Revenue.
*   *Tudo normalizado por Data e Campanha.*

### Slide 6: Demonstração (Momento da Demo)
**Título:** Veja Funcionando na Prática
*(Neste momento, você troca para a tela do Dashboard e da Planilha - veja o script de demo abaixo)*

### Slide 7: Investimento
**Título:** Preço Simples e Transparente
**Destaque:** Menos que 1 hora do seu analista.
**Oferta:**
*   **R$ 197 / mês** por cliente.
*   Sem taxa de implementação.
*   Cancele quando quiser.
*   Suporte via WhatsApp.

### Slide 8: Próximos Passos
**Título:** Vamos Automatizar Hoje?
**Call to Action:**
*   "Posso configurar seu primeiro cliente agora para teste?"
*   **Contato:** Seu Email / WhatsApp

---

# 🗣️ Roteiro da Demonstração (Demo Script)

**Cenário:** Você está em uma call (Zoom/Meet) com o dono da agência.

**1. Introdução (Slide 1-5):**
"Vou passar rápido pelos slides só para contextualizar, mas quero gastar a maior parte do tempo mostrando a ferramenta rodando, ok?"

**2. Transição para Demo (Slide 6):**
"Chega de slides. Deixa eu te mostrar a mágica acontecendo."

**3. Mostrando o Dashboard:**
*Acesse: http://localhost:3000/dashboard*
"Este é o painel de controle. Aqui você vê todos os seus clientes. O design é super limpo para você bater o olho e saber que está tudo funcionando."
"Veja aqui os status: Meta Ads (Azul), GA4 (Laranja). Tudo verde significa que os dados de hoje já foram coletados."

**4. O "Wow Moment" (Sincronização Manual):**
"O sistema roda sozinho às 6h da manhã. Mas digamos que você subiu uma campanha agora e quer ver o dado já. Eu clico neste botão 'Sincronizar'..."
*(Clique no botão de Sync)*
"...e em segundos ele vai na API do Facebook e do Google, pega os dados e joga na planilha."

**5. Mostrando a Planilha:**
*Abra a Planilha do Google Sheets*
"Aqui está o resultado final. É uma planilha do Google Sheets comum, que você já usa. A diferença é que você não digitou nada disso."
"Olha aqui as linhas novas que acabaram de entrar. Data, Plataforma, Campanha, Custo, Cliques... tudo aqui."

**6. Fechamento:**
"Imagina isso acontecendo para todos os seus 10, 20 clientes, todo santo dia, sem você mover um dedo. Quanto tempo sua equipe economizaria?"

---

# 📝 Checklist de Preparação para a Call

1.  [ ] **Servidor Rodando:** `npm run dev` no backend e frontend.
2.  [ ] **Planilha Aberta:** Tenha a aba do Google Sheets já aberta e limpa (ou com os dados de teste).
3.  [ ] **Dashboard Aberto:** Tenha o `localhost:3000/dashboard` aberto.
4.  [ ] **Notificações Desativadas:** Para não atrapalhar a apresentação.
