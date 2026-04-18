# Apresentação Calvett — Hospital da Plástica

Guia para o Douglas conduzir a reunião. Duração sugerida: 15–20 min de
walkthrough + 10 min de levantamento de dados.

---

## PARTE 1 · Roteiro de apresentação (walkthrough)

### 0. Abertura (30s)

> "O sistema já está em produção, publicado e rodando. O que vou mostrar
> hoje é o **escopo funcional completo**: dashboards, cadastros, fluxos
> de agenda, financeiro e estoque. A partir de agora a gente entra na
> fase de **refino visual e carga de dados reais**."

### 1. Login premium (1 min)

- Abrir a URL no Easypanel (tela de login já aparece).
- Mostrar a **coluna esquerda** (marca + proposta de valor).
- Na direita, destacar que existem **5 perfis de demo** com acesso
  rápido: Admin · Médico · Enfermagem · Administrativo · Recepção.
- Clicar em **Dr. Ricardo Calvett (Admin)** para entrar.

### 2. Dashboard (2 min)

- **Saldo operacional** positivo `R$ +159.524,42` em destaque.
- Gráfico de faturamento do mês + crescimento "↗ 16%".
- Cards **Receitas** e **Despesas** do mês.
- Lista das **últimas transações** (Larissa, Maria, Ricardo…).
- No canto, stacks de **Pacientes** e **Fornecedores** com iniciais.
- Filtros **Hoje / Semana / Mês** no topo direito.

### 3. Agendados (1,5 min)

- Calendário + lista de cirurgias do mês.
- Clicar em uma cirurgia → painel de detalhes lateral:
  **Paciente · Cirurgião · Data · Valor · Agendamentos vinculados**.
- Tabs **Agendamentos / Orçamento / Pagamento / Malhas / Despesas**.
- Menu de ações (editar, duplicar, excluir).

### 4. Financeiro (2 min)

- Tabela de lançamentos agrupada por dia.
- Filtros **Todos / Recebimentos / Despesas** + navegação por mês.
- Clicar em uma linha → painel **Detalhe do Lançamento** (design
  premium: hero com avatar, valor grande, dados da operação, paciente,
  ações de Nota Fiscal, Observações, Excluir).
- Mostrar botão **"+ Nova Receita"** → modal (padrão Figma: placeholder-
  only, fundo cinza claro, sem labels flutuando).
- Cancelar o modal.

### 5. Estoque (3 min) — **maior diferencial**

- Sidebar com **9 categorias** (Medicações, Materiais, Campos, Fios,
  Curativos, Assepsia, Soluções, CME, Gases).
- Band de stats: **Valor em estoque · Itens cadastrados · Precisam de
  ação · Fornecedores ativos**.
- Widget **Inventário por categoria** — barras horizontais coloridas.
- Widget **Movimentações recentes** — feed estilo timeline com entradas,
  saídas e ajustes (quem fez, quando, quanto).
- Grid **Itens críticos · precisa de ação** — cards de medicamentos
  vencidos/esgotados/abaixo do mínimo.
- Botão **"+ Novo Item"** com dropdown (Medicação / Fornecedor).

### 6. Medicações (1,5 min)

- Tabela completa do inventário (12 medicamentos reais: Ácido
  Tranexâmico, Dipirona, Cefazolina, Propofol, Fentanila, etc).
- Colunas: **Medicação · Princípio · Lote · Qtd · Validade · Status**.
- 4 cards de resumo clicáveis (filtram a lista).
- Busca + Status + Ordenar.
- Destacar: status e validade coloridos automaticamente
  (verde/amarelo/terra/cinza).

### 7. Atividade (1 min)

- Linha do tempo do dia (cadastros, agendamentos, estoque,
  financeiro, procedimentos, sistema).
- Sidebar com chip **"Monitoramento ao vivo"** (animação) + 4 stats
  (Ações hoje / Procedimentos / Agendamentos / Alertas).
- Mini-chart de produtividade por hora.

### 8. Perfil e logout (30s)

- Clicar no avatar (canto superior direito) → dropdown:
  **Meu perfil · Configurações · Sair**.
- Clicar **Sair** → volta para `/login`.
- Trocar para outro perfil (ex.: Enfermagem) → mostra que o sistema
  está preparado para **múltiplos usuários com permissões distintas**.

### 9. Fechamento (1 min)

> "Tudo que vimos está rodando em produção. O próximo passo é o
> **carregamento dos dados reais do hospital** — pacientes, fornecedores,
> estoque físico, contas bancárias — e alguns refinos visuais finais.
> Para a gente chegar lá, preciso desses itens que vou passar agora."

---

## PARTE 2 · Dados a solicitar para operar 100%

Entregar esta lista ao cliente **no final da reunião**. Pedir que envie
em planilhas (.xlsx) ou PDFs estruturados. Prioridade de cima para baixo.

### A. Cadastros base (bloqueante para usar)

1. **Pacientes** (.xlsx) — nome completo · CPF · telefone · email ·
   data nasc. · endereço · observações.
2. **Fornecedores** (.xlsx) — razão social · CNPJ · categoria (usar
   as 9 do sistema) · contato · email · telefone.
3. **Equipe/usuários do sistema** — nome · email corporativo · cargo ·
   especialidade · foto (opcional). Usado para criar os logins.
4. **Procedimentos oferecidos** — nome · código · valor médio ·
   duração estimada · materiais típicos.
5. **Categorias financeiras em uso** — lista atual de categorias de
   receita e despesa do hospital.

### B. Financeiro inicial

6. **Contas bancárias** — nome da conta · banco · tipo · saldo atual.
7. **Últimos 3–6 meses de lançamentos** — receitas + despesas
   (exportar do sistema atual, se houver).
8. **Contas a pagar em aberto** — fornecedor · vencimento · valor ·
   status · nota fiscal.
9. **Compromissos recorrentes** — aluguel · folha · fornecedores
   mensais (para automação futura).
10. **Regras de parcelamento** — padrão de parcelas, juros, métodos
    aceitos.

### C. Agenda e cirurgia

11. **Agenda atual** — próximas 30–60 dias (cirurgias confirmadas
    e agendadas).
12. **Histórico do último trimestre** — cirurgias realizadas
    (para popular o sistema com dados reais).
13. **Cirurgiões e anestesistas** — @handle · especialidade · CRM.

### D. Estoque físico (dia do inventário)

14. **Inventário atual** (.xlsx) — medicação · princípio ativo ·
    dosagem · forma · lote · validade · quantidade · localização.
15. **Estoque mínimo por item** — nível de reposição.
16. **Últimas compras/entradas** do trimestre.
17. **Notas fiscais recentes** — PDFs dos últimos 3 meses.

### E. Identidade e configuração

18. **Dados fiscais** — razão social completa · CNPJ · IE · endereço.
19. **Logo em alta resolução** (PNG/SVG) + paleta oficial (se existir).
20. **E-mail de contato, telefone, site** — para rodapé/header.

### F. Permissões e workflow

21. **Matriz de permissões** — o que cada cargo pode ver/fazer
    (ex.: recepção vê agenda; administrativo vê financeiro;
    só admin exclui).
22. **Fluxos de aprovação** — lançamentos acima de `R$ X` precisam
    de aprovação? Quem aprova?

### G. Relatórios solicitados

23. **Lista dos relatórios mensais** que o gestor recebe hoje —
    formato, periodicidade, destinatários.
24. **KPIs importantes** — o que precisa estar visível no dashboard
    prioritariamente.

### H. Integrações futuras (não bloqueante — fase 2)

25. **Banco** — interesse em integração PIX / extrato automático?
26. **NFS-e** — emissão automática? Certificado digital? Município?
27. **WhatsApp** — notificações automáticas para pacientes?
28. **Backup** — política desejada (diário, semanal, retenção).

---

## Checklist antes da apresentação

- [ ] Abrir Easypanel e confirmar deploy rodando
- [ ] Fazer uma sessão rápida na URL para "esquentar" o cache
- [ ] Testar login com **Dr. Ricardo Calvett** (perfil admin)
- [ ] Navegar pelas 6 telas (Dashboard → Agendados → Financeiro →
      Estoque → Medicações → Atividade)
- [ ] Abrir e fechar o modal "Nova Receita" para mostrar padrão
- [ ] Conferir saldo positivo (+R$ 159k) na dashboard
- [ ] Testar logout e re-login como Enfermagem
- [ ] Zoom do navegador em 100% (evita que o canvas 1920×1080 escale)
- [ ] Rede estável e projetor/tela compatível com 16:9

---

## Mensagem de fechamento (para copiar/colar)

> Obrigado pelo tempo. O sistema já está no ar e o que vocês viram hoje é
> exatamente o que vão operar. O próximo passo depende do retorno dessa
> planilha de dados — assim que recebermos, a carga real é feita em
> poucos dias e vocês entram em operação efetiva.

Qualquer ajuste no material — é só chamar.
