# **App Name**: RankInsight

## Core Features:

- Pesquisa e Visualização de Candidatos: Permite aos usuários pesquisar candidatos por número de inscrição ou nome (busca parcial e case insensitive), visualizando o ranking atualizado em uma tabela com dados detalhados como inscrição, nome, nota final, posição na lista de vaga, tipo (PCD, sub judice) e posição atual. A tabela oferece ordenação por posição e nota.
- Gestão CRUD de Candidatos (Admin): Funcionalidade exclusiva para administradores realizarem o cadastro, edição (inclusive 'inline' ou via modal) e exclusão de registros de candidatos, com formulários para campos obrigatórios (inscrição, nome, nota_final, posicao_lista_vaga, tipo, posicao_atual), validação de dados e confirmação antes da exclusão.
- Autenticação e Controle de Acesso: Sistema de login com e-mail e senha, implementando autenticação baseada em JWT e middleware para controlar dois perfis de usuário (Admin e Usuário Comum), garantindo acesso diferenciado às funcionalidades e proteção de rotas com interfaces adaptadas.
- Importação Inicial e Normalização de Dados: Funcionalidade para popular automaticamente o banco de dados com os dados iniciais fornecidos, incluindo o tratamento de duplicidade de inscrição, limpeza de aspas e caracteres inválidos, e normalização de 'sub judice' e 'PCD' no campo 'tipo'.
- Pesquisa Instantânea e Paginação na Tabela: Implementação de um campo de busca com filtro em tempo real (utilizando 'debounce') para uma experiência de pesquisa fluida e eficiente. A tabela de resultados inclui paginação para gerenciamento e navegação otimizada em grandes conjuntos de dados.
- Interface Responsiva com Destaques Visuais: Design moderno e estilo dashboard, completamente responsivo para desktops e dispositivos móveis, garantindo excelente usabilidade. A tabela de candidatos possui destaque visual para identificação rápida de 'PCD' e 'sub judice'.

## Style Guidelines:

- Paleta de cores profissional e clara. Cor primária (funcional): Um azul escuro sóbrio (#315C76), evocando confiança e estabilidade. Cor de fundo: Um tom de azul muito claro e levemente dessaturado (#EAF0F2), para manter a clareza e facilitar a leitura. Cor de destaque: Um ciano vibrante (#26D9D9), para ações interativas e pontos de foco, criando contraste dinâmico.
- Corpo e título: 'Inter' (sans-serif), escolhida por sua modernidade, neutralidade e alta legibilidade em diferentes tamanhos e contextos, ideal para dashboards e tabelas de dados.
- Utilizar um conjunto de ícones modernos e minimalistas (estilo 'outline' ou 'glyph') para representar ações e estados na interface, como pesquisa, edição, exclusão, e perfis de usuário, mantendo a consistência visual do dashboard.
- Layout focado em densidade e legibilidade para dados tabulares, com uma estrutura estilo dashboard que otimiza o uso do espaço. Elementos-chave serão responsivos, adaptando-se fluidamente a telas de dispositivos móveis e desktops, com painéis laterais retraíveis em telas maiores e navegação inferior ou minimalista em dispositivos menores.
- Animações sutis e funcionais, aplicadas para transições de carregamento de dados (ex: 'fade in' ao atualizar a tabela), feedback visual em ações de botão e interações de modais ou aberturas/fechamentos de elementos, a fim de enriquecer a experiência do usuário sem distrair.